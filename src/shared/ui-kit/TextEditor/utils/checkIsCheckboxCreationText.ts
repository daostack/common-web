const EMPTY_CHECKBOX_CREATION_TEXTS = ["[ ]", "[]", "( )", "()"];
const CHECKBOX_CREATION_TEXTS = [
  ...EMPTY_CHECKBOX_CREATION_TEXTS,
  "[x]",
  "[X]",
  "(x)",
  "(X)",
];

export const checkIsCheckboxCreationText = (text: string): boolean =>
  CHECKBOX_CREATION_TEXTS.includes(text);

export const checkIsEmptyCheckboxCreationText = (text: string): boolean =>
  EMPTY_CHECKBOX_CREATION_TEXTS.includes(text);
