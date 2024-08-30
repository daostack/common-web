import { CreateProposalWithFiles } from "@/pages/OldCommon/interfaces";
import {
  AllocateFundsTo,
  ProposalsTypes,
  RecipientType,
} from "@/shared/constants";
import { NewProposalCreationFormValues } from "@/shared/interfaces";

export const getFundingProposalPayload = (
  values: NewProposalCreationFormValues,
  commonId: string,
  userId: string,
  proposalId: string,
  discussionId: string,
): CreateProposalWithFiles<ProposalsTypes.FUNDS_ALLOCATION> | null => {
  if (!values.recipientInfo) {
    return null;
  }

  const fundAllocationToUser =
    userId === values.recipientInfo?.recipientId
      ? AllocateFundsTo.Proposer
      : AllocateFundsTo.OtherMember;

  return {
    id: proposalId,
    discussionId,
    title: values.title,
    description: JSON.stringify(values.content),
    images: values.images,
    files: values.files,
    links: [],
    commonId,
    amount: {
      amount: values.recipientInfo?.amount * 100,
      currency: values.recipientInfo?.currency,
    },
    to:
      values.recipientInfo.recipientType === RecipientType.Spaces
        ? AllocateFundsTo.SubCommon
        : fundAllocationToUser,
    ...(values.recipientInfo.recipientType === RecipientType.Spaces
      ? {
          subcommonId: values.recipientInfo.recipientId,
        }
      : {
          otherMemberId: values.recipientInfo.recipientId,
        }),
  };
};

export const getSurveyProposalPayload = (
  values: NewProposalCreationFormValues,
  commonId: string,
  proposalId: string,
  discussionId: string,
): CreateProposalWithFiles<ProposalsTypes.SURVEY> => {
  return {
    id: proposalId,
    discussionId,
    title: values.title,
    description: JSON.stringify(values.content),
    images: values.images,
    files: values.files,
    links: [],
    commonId,
  };
};
