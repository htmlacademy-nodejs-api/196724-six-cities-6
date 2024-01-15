import {Command} from './commands/command.interface.js';
import {CommandParser} from './command-parser.js';
import {Commands} from './commands/commands.enums.js';

type CommandCollection = Record<string, Command>;

export class CliApplication {
  constructor(
    private readonly command: string = Commands.help
  ) {}

  private commands: CommandCollection = {};

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
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered.`);
      }
      this.commands[command.getName()] = command;
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
