const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function generateId(
  size: number,
  charset: string = DEFAULT_CHARSET,
): string {
  if (size <= 0) {
    throw new Error("Size must be a positive integer.");
  }

  const charsetLength = charset.length;
  if (charsetLength < 2 || charsetLength > 256) {
    throw new Error("Charset must have between 2 and 256 unique characters.");
  }

  const randomValues = new Uint8Array(size);
  const result: string[] = [];

  while (result.length < size) {
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < randomValues.length && result.length < size; i++) {
      const randomIndex = randomValues[i] % charsetLength;

      // Ensure no bias by discarding values that would cause uneven distribution
      if (randomValues[i] < Math.floor(256 / charsetLength) * charsetLength) {
        result.push(charset[randomIndex]);
      }
    }
  }

  return result.join("");
}
