export const getFinalAmount = (
  selectedAmount: number | null,
  inputValue: string
): number => selectedAmount || Number(inputValue) * 100;
