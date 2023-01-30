import { TextFieldProps } from "@/shared/components/Form/Formik";
import { CreationFormItemType } from "./constants";

interface BaseFormItem<Props extends { name: string } = { name: string }> {
  type: CreationFormItemType;
  className?: string;
  props: Props;
}

interface TextFieldFormItem extends BaseFormItem<TextFieldProps> {
  type: CreationFormItemType.TextField;
}

export type CreationFormItem = TextFieldFormItem;
