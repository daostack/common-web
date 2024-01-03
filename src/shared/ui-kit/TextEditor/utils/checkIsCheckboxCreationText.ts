const CHECKBOX_CREATION_TEXTS = ["[ ]", "[x]", "[X]"];

export const checkIsCheckboxCreationText = (text: string): boolean =>
  CHECKBOX_CREATION_TEXTS.includes(text);
