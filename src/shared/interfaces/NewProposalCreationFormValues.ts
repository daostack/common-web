import { TextEditorValue } from "@/shared/ui-kit/TextEditor";
import { ProposalTypeSelectOption, RecipientType } from "../constants";
import { UploadFile } from "./UploadFile";
import { Currency } from "../models";

export interface RecipientInfo {
  recipientType: RecipientType
  goalOfPayment: string;
  recipientId: string;
  currency: Currency
  amount: number;
}

export interface NewProposalCreationFormValues {
  proposalType: ProposalTypeSelectOption;
  title: string;
  content: TextEditorValue;
  images: UploadFile[];
  files: UploadFile[];
  recipientInfo?: RecipientInfo;
}
