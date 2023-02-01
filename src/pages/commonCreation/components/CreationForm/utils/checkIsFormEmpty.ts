import { checkIsTextEditorValueEmpty, TextEditorValue } from "@/shared/ui-kit";
import { CreationFormItemType } from "../constants";
import { CreationFormItem } from "../types";

export const checkIsFormEmpty = (
  values: Record<string, unknown>,
  items: CreationFormItem[],
): boolean => {
  return Object.entries(values).every(([key, value]) => {
    const valueType = typeof value;

    if (
      valueType === null ||
      valueType === "undefined" ||
      (valueType === "string" && !valueType) ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return true;
    }

    const valueConfiguration = items.find((item) => item.props.name === key);

    return (
      valueConfiguration?.type === CreationFormItemType.TextEditor &&
      checkIsTextEditorValueEmpty(value as TextEditorValue)
    );
  });
};
