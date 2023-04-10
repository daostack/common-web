import React, { FC, ReactNode, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  PROPOSAL_TYPE_SELECT_OPTIONS,
  ProposalsTypes,
} from "@/shared/constants";
import { NewProposalCreationFormValues } from "@/shared/interfaces";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { parseStringToTextEditorValue } from "@/shared/ui-kit/TextEditor";
import {
  selectIsProposalCreationLoading,
  selectProposalCreationData,
} from "@/store/states";
import { commonActions } from "@/store/states";
import { ProposalCreationCard, ProposalCreationModal } from "./components";
import {
  NewProposalCreationContext,
  NewProposalCreationContextValue,
} from "./context";
import { getFundingProposalPayload, getSurveyProposalPayload } from "./util";

interface NewProposalCreationProps {
  common: Common;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
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
    common,
    governance,
    parentCommons,
    subCommons,
    commonMember,
    commonImage,
    commonName,
    isModalVariant = false,
  } = props;
  const dispatch = useDispatch();
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
    [governance.circles, userCircleIds, userId, commonId],
  );

  const contextValue = useMemo<NewProposalCreationContextValue>(
    () => ({
      common,
      parentCommons,
      subCommons,
    }),
    [common, parentCommons, subCommons],
  );
  let contentEl: ReactNode;

  if (
    isModalVariant &&
    typeof commonImage === "string" &&
    typeof commonName === "string"
  ) {
    contentEl = (
      <ProposalCreationModal
        initialValues={initialValues}
        governanceCircles={governance.circles}
        governance={governance}
        userCircleIds={userCircleIds}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        commonImage={commonImage}
        commonName={commonName}
      />
    );
  } else {
    contentEl = (
      <ProposalCreationCard
        initialValues={initialValues}
        governanceCircles={governance.circles}
        governance={governance}
        userCircleIds={userCircleIds}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    );
  }

  return (
    <NewProposalCreationContext.Provider value={contextValue}>
      {contentEl}
    </NewProposalCreationContext.Provider>
  );
};

export default NewProposalCreation;
