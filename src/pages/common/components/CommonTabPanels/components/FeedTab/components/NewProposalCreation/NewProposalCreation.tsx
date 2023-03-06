import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  PROPOSAL_TYPE_SELECT_OPTIONS,
  ProposalsTypes,
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
import { getFundingProposalPayload, getSurveyProposalPayload } from "./util";

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

      switch (values.proposalType.value) {
        case ProposalsTypes.FUNDS_ALLOCATION: {
          const fundingProposalPayload = getFundingProposalPayload(
            values,
            commonId,
            userId,
          );

          if (!fundingProposalPayload) {
            break;
          }
          dispatch(
            commonActions.createFundingProposal.request({
              payload: fundingProposalPayload,
            }),
          );
          break;
        }
        case ProposalsTypes.SURVEY: {
          dispatch(
            commonActions.createSurveyProposal.request({
              payload: getSurveyProposalPayload(values, commonId),
            }),
          );
          break;
        }
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
