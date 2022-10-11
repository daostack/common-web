import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { DeadSeaUserDetailsFormValuesWithoutUserDetails } from "@/containers/Common/components";
import { useSupportersDataContext } from "@/containers/Common/containers/SupportersContainer/context";
import { useCommonMember } from "@/containers/Common/hooks";
import { createMemberAdmittanceProposal } from "@/containers/Common/store/actions";
import { subscribeToCommonMembers } from "@/containers/Common/store/api";
import { Loader } from "@/shared/components";
import { MemberAdmittance } from "@/shared/models/governance/proposals";
import { getUserName } from "@/shared/utils";
import { useLoadingState } from "@/shared/hooks";
import { ErrorText } from "@/shared/components/Form";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";
import "./index.scss";

interface MemberAdmittanceStepProps {
  data: DeadSeaUserDetailsFormValuesWithoutUserDetails;
  onFinish: () => void;
}

const MemberAdmittanceStep: FC<MemberAdmittanceStepProps> = (props) => {
  const { data, onFinish } = props;
  const dispatch = useDispatch();
  const {
    data: commonMember,
    fetched: isCommonMemberFetched,
    fetchCommonMember,
  } = useCommonMember();
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
    if (commonId) {
      fetchCommonMember(commonId);
    }
  }, [fetchCommonMember, commonId]);

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

      dispatch(
        createMemberAdmittanceProposal.request({
          payload: {
            args: {
              commonId,
              title,
              description: data.supportPlan || title,
              images: [],
              files: [],
              links: [],
              feeMonthly: null,
              feeOneTime: null,
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
        })
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
