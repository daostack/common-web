const EMPTY_CHECKBOX_CREATION_TEXT = "[ ]";
const CHECKBOX_CREATION_TEXTS = [EMPTY_CHECKBOX_CREATION_TEXT, "[x]", "[X]"];

export const checkIsCheckboxCreationText = (text: string): boolean =>
  CHECKBOX_CREATION_TEXTS.includes(text);

export const checkIsEmptyCheckboxCreationText = (text: string): boolean =>
  text === EMPTY_CHECKBOX_CREATION_TEXT;
