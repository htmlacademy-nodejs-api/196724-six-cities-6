type ParsedCommand = Record<string, string[]>

export class CommandParser {
  static parse(cliArgs: string[]): ParsedCommand {
    const commandIndex: number = cliArgs.findIndex(((arg: string) => arg.startsWith('--')));
    const [command, ...restArgs] = cliArgs.slice(commandIndex, cliArgs.length);
    if (commandIndex >= 0) {
      return {[command]: restArgs};
    }
    return {};
  }
}
