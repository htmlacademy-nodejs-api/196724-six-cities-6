import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Command } from './command.interface.js';
import { Commands } from './commands.enums.js';
import Chalk from 'chalk';
import { logError } from '../../shared/utils/index.js';

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

export class VersionCommand implements Command {
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
      console.info(`${Chalk.yellow('⚠️ Текущая версия:')} ${version}'`);
    } catch (error: unknown) {
      console.error(`Failed to read version from ${this.filePath}`);
      logError(error);
    }
  }
}
