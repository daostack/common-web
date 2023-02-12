import { TextEditorValue } from "@/shared/ui-kit/TextEditor";
import { ProposalTypeSelectOption } from "../constants";
import { UploadFile } from "./UploadFile";

export interface NewProposalCreationFormValues {
  proposalType: ProposalTypeSelectOption;
  title: string;
  content: TextEditorValue;
  images: UploadFile[];
  files: UploadFile[];
}
