type ParsedCommand = Record<string, string[]>

export class CommandParser {
  static parse(cliArgs: string[]): ParsedCommand {
    const [command, ...args] = cliArgs;
    const isCommand: boolean = command.startsWith('--');
    if (isCommand) {
      return {[command]: args};
    }
    return {};
  }
}
