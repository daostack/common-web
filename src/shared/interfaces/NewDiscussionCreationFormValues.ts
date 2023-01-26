import { Circle } from "@/shared/models";
import { TextEditorValue } from "@/shared/ui-kit/TextEditor";
import { UploadFile } from "./UploadFile";

export interface NewDiscussionCreationFormValues {
  circle: Circle | null;
  title: string;
  content: TextEditorValue;
  images: UploadFile[];
}
