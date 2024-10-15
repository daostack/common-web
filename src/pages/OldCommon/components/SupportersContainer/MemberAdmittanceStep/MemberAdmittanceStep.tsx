import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "@/pages/Auth/store/selectors";
import { DeadSeaUserDetailsFormValuesWithoutUserDetails } from "@/pages/OldCommon/components";
import { useSupportersDataContext } from "@/pages/OldCommon/containers/SupportersContainer/context";
import { createMemberAdmittanceProposal } from "@/pages/OldCommon/store/actions";
import { subscribeToCommonMembers } from "@/pages/OldCommon/store/api";
import { Loader } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import { useLoadingState } from "@/shared/hooks";
import { CirclesPermissions, CommonMember } from "@/shared/models";
import { MemberAdmittance } from "@/shared/models/governance/proposals";
import { getUserName } from "@/shared/utils";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";
import "./index.scss";

interface MemberAdmittanceStepProps {
  data: DeadSeaUserDetailsFormValuesWithoutUserDetails;
  commonMember: (CommonMember & CirclesPermissions) | null;
  isCommonMemberFetched: boolean;
  onFinish: () => void;
}

const MemberAdmittanceStep: FC<MemberAdmittanceStepProps> = (props) => {
  const { data, commonMember, isCommonMemberFetched, onFinish } = props;
  const dispatch = useDispatch();
  const [
    {
      data: createdMemberAdmittance,
      loading: isProposalCreationLoading,
      fetched: isProposalCreationFinished,
    },
    setProposalCreationState,
  ] = useLoadingState<MemberAdmittance | null>(null);
  const { supportersData, currentTranslation } = useSupportersDataContext();
  const [errorText, setErrorText] = useState("");
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const userName = getUserName(user);
  const commonId = supportersData?.commonId;

  useEffect(() => {
    if (isCommonMemberFetched && commonMember) {
      onFinish();
    }
  }, [isCommonMemberFetched, commonMember, onFinish]);

  useEffect(() => {
    (async () => {
      if (
        !isCommonMemberFetched ||
        commonMember ||
        isProposalCreationLoading ||
        isProposalCreationFinished ||
        !commonId
      ) {
        return;
      }

      setProposalCreationState((state) => ({
        ...state,
        loading: true,
      }));

      const title = `Membership request from ${userName}`;

      const proposalId = uuidv4();
      const discussionId = uuidv4();
      dispatch(
        createMemberAdmittanceProposal.request({
          payload: {
            args: {
              id: proposalId,
              discussionId,
              commonId,
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
    isCommonMemberFetched,
    commonMember,
    isProposalCreationLoading,
    isProposalCreationFinished,
    commonId,
    data,
  ]);

  useEffect(() => {
    if (!createdMemberAdmittance || !commonId) {
      return;
    }

    return subscribeToCommonMembers(commonId, (commonMembers) => {
      if (
        commonMembers.some((commonMember) => commonMember.userId === userId)
      ) {
        onFinish();
      }
    });
  }, [createdMemberAdmittance, userId, commonId, onFinish]);

  if (!currentTranslation) {
    return null;
  }

  return (
    <GeneralInfoWrapper title={currentTranslation.title}>
      {errorText ? (
        <ErrorText className="supporters-page-member-admittance-step__error">
          {errorText}
        </ErrorText>
      ) : (
        <Loader />
      )}
    </GeneralInfoWrapper>
  );
};

export default MemberAdmittanceStep;
