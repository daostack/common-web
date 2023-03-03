import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  PROPOSAL_TYPE_SELECT_OPTIONS,
  ProposalsTypes,
  RecipientType,
  AllocateFundsTo,
} from "@/shared/constants";
import { NewProposalCreationFormValues } from "@/shared/interfaces";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { parseStringToTextEditorValue } from "@/shared/ui-kit/TextEditor";
import {
  selectIsProposalCreationLoading,
  selectProposalCreationData,
} from "@/store/states";
import { commonActions } from "@/store/states";
import { useCommonDataContext } from "../../../../../../providers";
import { ProposalCreationCard, ProposalCreationModal } from "./components";

interface NewProposalCreationProps {
  governanceCircles: Governance["circles"];
  commonMember: (CommonMember & CirclesPermissions) | null;
  commonImage?: string;
  commonName?: string;
  isModalVariant?: boolean;
}

const INITIAL_VALUES: NewProposalCreationFormValues = {
  proposalType: PROPOSAL_TYPE_SELECT_OPTIONS[0],
  title: "",
  content: parseStringToTextEditorValue(),
  images: [],
  files: [],
};

const NewProposalCreation: FC<NewProposalCreationProps> = (props) => {
  const {
    governanceCircles,
    commonMember,
    commonImage,
    commonName,
    isModalVariant = false,
  } = props;
  const dispatch = useDispatch();
  const { common, governance } = useCommonDataContext();
  const proposalCreationData = useSelector(selectProposalCreationData);
  const isLoading = useSelector(selectIsProposalCreationLoading);
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const commonId = common.id;
  const initialValues = useMemo(
    () => proposalCreationData || INITIAL_VALUES,
    [],
  );

  const userCircleIds = useMemo(
    () => (commonMember ? Object.values(commonMember.circles.map) : []),
    [commonMember?.circles.map],
  );

  const handleCancel = () => {
    dispatch(commonActions.setCommonAction(null));
    dispatch(commonActions.setProposalCreationData(null));
  };

  const handleSubmit = useCallback(
    (values: NewProposalCreationFormValues) => {
      if (!userId) {
        return;
      }

      if (
        values.proposalType.value === ProposalsTypes.FUNDS_ALLOCATION &&
        values.recipientInfo
      ) {
        const fundAllocationToUser =
          userId === values.recipientInfo?.recipientId
            ? AllocateFundsTo.Proposer
            : AllocateFundsTo.OtherMember;

        dispatch(
          commonActions.createFundingProposal.request({
            payload: {
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
            },
          }),
        );
      } else {
        dispatch(
          commonActions.createSurveyProposal.request({
            payload: {
              title: values.title,
              description: JSON.stringify(values.content),
              images: values.images,
              files: values.files,
              links: [],
              commonId,
            },
          }),
        );
      }
    },
    [governanceCircles, userCircleIds, userId, commonId],
  );

  if (
    isModalVariant &&
    typeof commonImage === "string" &&
    typeof commonName === "string"
  ) {
    return (
      <ProposalCreationModal
        initialValues={initialValues}
        governanceCircles={governanceCircles}
        governance={governance}
        userCircleIds={userCircleIds}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        commonImage={commonImage}
        commonName={commonName}
      />
    );
  }

  return (
    <ProposalCreationCard
      initialValues={initialValues}
      governanceCircles={governanceCircles}
      governance={governance}
      userCircleIds={userCircleIds}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
};

export default NewProposalCreation;
