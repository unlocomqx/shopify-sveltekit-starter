export function ServerError(message) {
  return {
    body: JSON.stringify({
      error: true,
      message,
    }),
  };
}
