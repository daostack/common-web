import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { DeadSeaUserDetailsFormValuesWithoutUserDetails } from "@/pages/OldCommon/components";
import { useSupportersDataContext } from "@/pages/OldCommon/containers/SupportersContainer/context";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { CreateProposal } from "@/pages/OldCommon/interfaces";
import { createMemberAdmittanceProposal } from "@/pages/OldCommon/store/actions";
import { subscribeToCommonMembers } from "@/pages/OldCommon/store/api";
import { Logger, ProposalService } from "@/services";
import { Loader } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import { ProposalsTypes } from "@/shared/constants";
import { useLoadingState } from "@/shared/hooks";
import { Circles, CirclesPermissions, CommonMember } from "@/shared/models";
import { MemberAdmittance } from "@/shared/models/governance/proposals";
import { getUserName } from "@/shared/utils";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";
import styles from "./MemberAdmittanceForProjectStep.module.scss";

interface MemberAdmittanceForProjectStepProps {
  data: DeadSeaUserDetailsFormValuesWithoutUserDetails;
  parentCommonId: string;
  circleId: string;
  commonMember: (CommonMember & CirclesPermissions) | null;
  isCommonMemberFetched: boolean;
  parentGovernanceCircles?: Circles;
  onFinish: () => void;
}

const MemberAdmittanceForProjectStep: FC<
  MemberAdmittanceForProjectStepProps
> = (props) => {
  const {
    data,
    parentCommonId,
    circleId,
    commonMember,
    isCommonMemberFetched,
    parentGovernanceCircles,
    onFinish,
  } = props;
  const dispatch = useDispatch();
  const {
    data: parentCommonMember,
    fetched: isParentCommonMemberFetched,
    fetchCommonMember: fetchParentCommonMember,
  } = useCommonMember({
    shouldAutoReset: false,
  });
  const [
    {
      data: createdMemberAdmittance,
      loading: isProposalCreationLoading,
      fetched: isProposalCreationFinished,
    },
    setProposalCreationState,
  ] = useLoadingState<MemberAdmittance | null>(null);
  const { supportersData, currentTranslation } = useSupportersDataContext();
  const [isParentCommonMemberCreated, setIsParentCommonMemberCreated] =
    useState(false);
  const [isProjectCommonMemberCreated, setIsProjectCommonMemberCreated] =
    useState(false);
  const [isAssignCircleCreated, setIsAssignCircleCreated] = useState(false);
  const [errorText, setErrorText] = useState("");
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const userName = getUserName(user);
  const commonId = supportersData?.commonId;
  const circleName =
    Object.values(parentGovernanceCircles || {}).find(
      ({ id }) => id === circleId,
    )?.name || "";

  useEffect(() => {
    fetchParentCommonMember(parentCommonId, {}, true);
  }, [parentCommonId, userId]);

  useEffect(() => {
    const isParentCommonMemberFinished =
      Boolean(isParentCommonMemberFetched && parentCommonMember) ||
      isParentCommonMemberCreated;
    const isProjectCommonMemberFinished =
      Boolean(isCommonMemberFetched && commonMember) ||
      isProjectCommonMemberCreated;

    if (isParentCommonMemberFinished && isProjectCommonMemberFinished) {
      onFinish();
    }
  }, [
    isParentCommonMemberFetched,
    parentCommonMember,
    isParentCommonMemberCreated,
    isCommonMemberFetched,
    commonMember,
    isProjectCommonMemberCreated,
    onFinish,
  ]);

  useEffect(() => {
    (async () => {
      if (
        !isParentCommonMemberFetched ||
        parentCommonMember ||
        isProposalCreationLoading ||
        isProposalCreationFinished
      ) {
        return;
      }

      setProposalCreationState((state) => ({
        ...state,
        loading: true,
      }));

      const title = `Membership request from ${userName}`;

      dispatch(
        createMemberAdmittanceProposal.request({
          payload: {
            args: {
              commonId: parentCommonId,
              title,
              description: data.supportPlan || title,
              images: [],
              files: [],
              links: [],
              feeMonthly: null,
              feeOneTime: null,
              fromSupportersFlow: true,
              receiveEmails: data.marketingContentAgreement ?? false,
              userWhatsapp: data.whatsappGroupAgreement ?? false,
            },
          },
          callback: (error, proposal) => {
            if (error || !proposal) {
              setErrorText(error?.message || "Something went wrong");
              return;
            }

            setProposalCreationState({
              loading: false,
              fetched: true,
              data: proposal,
            });
          },
        }),
      );
    })();
  }, [
    isParentCommonMemberFetched,
    parentCommonMember,
    isProposalCreationLoading,
    isProposalCreationFinished,
    parentCommonId,
    data,
  ]);

  useEffect(() => {
    if (!createdMemberAdmittance) {
      return;
    }

    return subscribeToCommonMembers(parentCommonId, (commonMembers) => {
      if (
        commonMembers.some((commonMember) => commonMember.userId === userId)
      ) {
        setIsParentCommonMemberCreated(true);
      }
    });
  }, [createdMemberAdmittance, userId, parentCommonId]);

  useEffect(() => {
    (async () => {
      if (
        !isCommonMemberFetched ||
        commonMember ||
        !userId ||
        !circleName ||
        !createdMemberAdmittance
      ) {
        return;
      }

      try {
        const title = `${userName} joins and supports ${circleName}`;
        const payload: Omit<
          CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["data"],
          "type"
        > = {
          args: {
            commonId: parentCommonId,
            title,
            description: data.supportPlan || title,
            images: [],
            files: [],
            links: [],
            circleId,
            userId,
          },
        };
        await ProposalService.createAssignProposal(payload);
        setIsAssignCircleCreated(true);
      } catch (err) {
        Logger.error(err);
        setErrorText("Something went wrong");
      }
    })();
  }, [
    isCommonMemberFetched,
    commonMember,
    userId,
    circleName,
    createdMemberAdmittance,
  ]);

  useEffect(() => {
    if (!isAssignCircleCreated || !commonId) {
      return;
    }

    return subscribeToCommonMembers(commonId, (commonMembers) => {
      if (
        commonMembers.some((commonMember) => commonMember.userId === userId)
      ) {
        setIsProjectCommonMemberCreated(true);
      }
    });
  }, [isAssignCircleCreated, commonId, userId]);

  if (!currentTranslation) {
    return null;
  }

  return (
    <GeneralInfoWrapper title={currentTranslation.title}>
      {errorText ? (
        <ErrorText className={styles.error}>{errorText}</ErrorText>
      ) : (
        <Loader />
      )}
    </GeneralInfoWrapper>
  );
};

export default MemberAdmittanceForProjectStep;
