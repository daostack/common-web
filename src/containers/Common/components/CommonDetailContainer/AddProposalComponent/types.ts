import { CreateProposal } from "@/containers/Common/interfaces";
import { ProposalsTypes } from "@/shared/constants";

export type CreateFundsAllocationData = Omit<CreateProposal[ProposalsTypes.FUNDS_ALLOCATION]["data"], "type">;
export type CreateFundsAllocationFormData = Omit<CreateFundsAllocationData["args"], "commonId" | "files">;
