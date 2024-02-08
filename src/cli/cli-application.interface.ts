import { Command } from './commands/command.interface.js';

export interface ICliApplication {
  getCommand: (name: string) => Command;
  registerCommands: () => void;
  processCommand: (args: string[]) => void;
}
