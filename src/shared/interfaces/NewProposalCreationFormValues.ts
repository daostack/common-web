import { TextEditorValue } from "@/shared/ui-kit/TextEditor";
import { UploadFile } from "./UploadFile";
import { ProposalTypeSelectOption } from "../constants";

export interface NewProposalCreationFormValues {
  proposalType: ProposalTypeSelectOption;
  title: string;
  content: TextEditorValue;
  images: UploadFile[];
  files: UploadFile[];
}
