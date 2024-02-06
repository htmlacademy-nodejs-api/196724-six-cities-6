import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Command } from './command.interface.js';
import { Commands } from './commands.enums.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../shared/types/index.js';
import { ILogger } from '../../shared/libs/logger/index.js';

type PackageJSONConfig = {
  version: string;
}

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'version')
  );
}

@injectable()
export class VersionCommand implements Command {
  constructor(
    @inject(Components.ConsoleLogger) private readonly logger: ILogger
  ) {}

  private readonly filePath: string = './package.json';
  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content.');
    }

    return importedContent.version;
  }

  public getName(): string {
    return Commands.version;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = this.readVersion();
      this.logger.info(`Текущая версия: ${version}`)
    } catch (error: unknown) {
      this.logger.error(`Failed to read version from ${this.filePath}`, error as Error);
    }
  }
}
