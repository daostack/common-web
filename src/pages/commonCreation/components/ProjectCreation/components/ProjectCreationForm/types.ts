import { UploadFile } from "@/shared/interfaces";
import { TextEditorValue } from "@/shared/ui-kit";

export interface ProjectCreationFormValues {
  projectImages: UploadFile[];
  projectName: string;
  byline: string;
  description: TextEditorValue;
  videoUrl: string;
  gallery: UploadFile[];
}
