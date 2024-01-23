export const logError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return error;
};
