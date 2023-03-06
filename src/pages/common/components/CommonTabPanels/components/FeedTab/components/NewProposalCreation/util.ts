import { CreateProposalWithFiles } from "@/pages/OldCommon/interfaces";
import { AllocateFundsTo, ProposalsTypes, RecipientType } from "@/shared/constants";
import { NewProposalCreationFormValues } from "@/shared/interfaces";

export const getFundingProposalPayload = (values: NewProposalCreationFormValues, commonId: string, userId: string): CreateProposalWithFiles<ProposalsTypes.FUNDS_ALLOCATION> | null => {
  if(!values.recipientInfo) {
    return null;
  }

  const fundAllocationToUser =
  userId === values.recipientInfo?.recipientId
    ? AllocateFundsTo.Proposer
    : AllocateFundsTo.OtherMember;

  return ({
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
        values.recipientInfo.recipientType === RecipientType.Projects
          ? AllocateFundsTo.SubCommon
          : fundAllocationToUser,
      ...(values.recipientInfo.recipientType === RecipientType.Projects
        ? {
            subcommonId: values.recipientInfo.recipientId,
          }
        : {
            otherMemberId: values.recipientInfo.recipientId,
          }),
  })
}

export const getSurveyProposalPayload = (values:NewProposalCreationFormValues, commonId: string): CreateProposalWithFiles<ProposalsTypes.SURVEY> => {
  return ({
    title: values.title,
    description: JSON.stringify(values.content),
    images: values.images,
    files: values.files,
    links: [],
    commonId,
  });
}
