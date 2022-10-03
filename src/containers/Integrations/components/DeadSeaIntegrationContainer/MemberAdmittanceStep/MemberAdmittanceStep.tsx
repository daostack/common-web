import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "@/config";
import { selectUser } from "@/containers/Auth/store/selectors";
import { useCommonMember } from "@/containers/Common/hooks";
import { createMemberAdmittanceProposal } from "@/containers/Common/store/actions";
import { subscribeToCommonMembers } from "@/containers/Common/store/api";
import { Loader } from "@/shared/components";
import { MemberAdmittance } from "@/shared/models/governance/proposals";
import { getUserName } from "@/shared/utils";
import { useLoadingState } from "@/shared/hooks";
import { ErrorText } from "@/shared/components/Form";
import { GeneralInfoWrapper } from "../../../../Common/components/SupportersContainer/GeneralInfoWrapper";
import "./index.scss";

interface MemberAdmittanceStepProps {
  description: string;
  onFinish: () => void;
}

const MemberAdmittanceStep: FC<MemberAdmittanceStepProps> = (props) => {
  const { description, onFinish } = props;
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
  const [errorText, setErrorText] = useState("");
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const userName = getUserName(user);

  useEffect(() => {
    fetchCommonMember(config.deadSeaCommonId);
  }, [fetchCommonMember]);

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
              commonId: config.deadSeaCommonId,
              title,
              description: description || title,
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
  ]);

  useEffect(() => {
    if (!createdMemberAdmittance) {
      return;
    }

    return subscribeToCommonMembers(config.deadSeaCommonId, (commonMembers) => {
      if (
        commonMembers.some((commonMember) => commonMember.userId === userId)
      ) {
        onFinish();
      }
    });
  }, [createdMemberAdmittance, userId, onFinish]);

  return (
    <GeneralInfoWrapper>
      {errorText ? (
        <ErrorText className="dead-sea-member-admittance-step__error">
          {errorText}
        </ErrorText>
      ) : (
        <Loader />
      )}
    </GeneralInfoWrapper>
  );
};

export default MemberAdmittanceStep;
