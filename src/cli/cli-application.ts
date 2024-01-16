import {Command} from './commands/command.interface.js';
import {CommandParser} from './command-parser.js';
import {Commands} from './commands/commands.enums.js';

export class CliApplication {
  private readonly command: string = Commands.help;
  private commands: Record<string, Command> = {};

  private get defaultCommand(): Command | never {
    if (! this.commands[this.command]) {
      throw new Error(`The default command (${this.command}) is not registered.`);
    }
    return this.commands[this.command];
  }

  private getCommand(name: string): Command {
    return this.commands[name] ?? this.defaultCommand;
  }

  public registerCommands(commandList: Command[]): void {
    commandList.forEach((command) => {
      const name: string = command.getName();
      if (this.commands[name]) {
        throw new Error(`Command ${name} is already registered.`);
      }
      this.commands[name] = command;
    });
  }

  public processCommand(args: string[]): void {
    const parsedCommand = CommandParser.parse(args);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
