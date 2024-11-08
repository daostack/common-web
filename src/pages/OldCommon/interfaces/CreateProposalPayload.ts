import { ProposalsTypes } from "@/shared/constants";
import { UploadFile } from "@/shared/interfaces";
import { ContributionSourceType, PaymentAmount } from "@/shared/models";
import {
  AssignCircle,
  DeleteCommon,
  RemoveCircle,
  FundsAllocation,
  MemberAdmittance,
  Survey,
} from "@/shared/models/governance/proposals";

interface CreateFundsAllocation {
  type: ProposalsTypes.FUNDS_ALLOCATION;
  args: Omit<FundsAllocation["data"]["args"], "proposerId">;
}

interface CreateMemberAdmittance {
  type: ProposalsTypes.MEMBER_ADMITTANCE;
  args: Omit<MemberAdmittance["data"]["args"], "proposerId"> & {
    contributionSourceType?: ContributionSourceType;
    feeMonthly: PaymentAmount | null;
    feeOneTime: PaymentAmount | null;
    fromSupportersFlow?: boolean;
    receiveEmails?: boolean;
    userWhatsapp?: boolean;
  };
}

interface CreateAssignCircle {
  type: ProposalsTypes.ASSIGN_CIRCLE;
  args: Omit<AssignCircle["data"]["args"], "proposerId">;
}
interface CreateRemoveCircle {
  type: ProposalsTypes.REMOVE_CIRCLE;
  args: Omit<RemoveCircle["data"]["args"], "proposerId">;
}

interface CreateSurvey {
  type: ProposalsTypes.SURVEY;
  args: Omit<Survey["data"]["args"], "proposerId">;
}

interface CreateDeleteCommon {
  type: ProposalsTypes.DELETE_COMMON;
  args: Omit<DeleteCommon["data"]["args"], "proposerId">;
}

interface Request<P, R> {
  data: P;
  response: R;
}

export interface CreateProposal {
  [ProposalsTypes.FUNDS_ALLOCATION]: Request<
    CreateFundsAllocation,
    FundsAllocation
  >;
  [ProposalsTypes.MEMBER_ADMITTANCE]: Request<
    CreateMemberAdmittance,
    MemberAdmittance
  >;
  [ProposalsTypes.ASSIGN_CIRCLE]: Request<CreateAssignCircle, AssignCircle>;
  [ProposalsTypes.REMOVE_CIRCLE]: Request<CreateRemoveCircle, RemoveCircle>;
  [ProposalsTypes.SURVEY]: Request<CreateSurvey, Survey>;
  [ProposalsTypes.DELETE_COMMON]: Request<CreateDeleteCommon, DeleteCommon>;
}

export type CreateProposalWithFiles<T extends keyof CreateProposal> = Omit<
  CreateProposal[T]["data"]["args"],
  "files" | "images"
> & {
  files?: UploadFile[];
  images?: UploadFile[];
};
