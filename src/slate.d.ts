import {
  CustomEditor,
  CustomElement,
  CustomText,
} from "@/shared/ui-kit/TextEditor/types";

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
