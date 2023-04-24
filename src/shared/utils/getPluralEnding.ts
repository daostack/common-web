export const getPluralEnding = (amount: number): string =>
  amount === 1 ? "" : "s";
