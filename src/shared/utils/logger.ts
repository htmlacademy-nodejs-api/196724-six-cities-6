import Chalk from 'chalk';

export const logError = (error: unknown) => {
  if (error instanceof Error) {
    return console.error(Chalk.red(`🚫 ${error.message}`));
  }
  return console.error(Chalk.red(`🚫 ${error}`));
};


export const logInfo = (text: string, ...args: unknown[]) => console.info(Chalk.blue(`💪 ${text}`,args));
