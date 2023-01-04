import { Circle } from "@/shared/models";
import { UploadFile } from "@/shared/ui-kit";
import { TextEditorValue } from "@/shared/ui-kit/TextEditor";

export interface NewDiscussionCreationFormValues {
  circle: Circle | null;
  title: string;
  content: TextEditorValue;
  images: UploadFile[];
}
