import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "@/pages/Auth/store/selectors";
import { Loader } from "@/shared/components";
import { ContributionSourceType, Currency } from "@/shared/models";
import { getLoading } from "@/shared/store/selectors";
import { getUserName } from "@/shared/utils";
import { createMemberAdmittanceProposal } from "../../../store/actions";
import { IStageProps } from "./MembershipRequestModal";
import { MembershipRequestStage } from "./constants";

interface MembershipRequestCreatingProps
  extends Omit<IStageProps, "governance"> {
  shouldSkipCreation?: boolean;
}

export default function MembershipRequestCreating(
  props: MembershipRequestCreatingProps,
) {
  const {
    userData,
    setUserData,
    common,
    isAutomaticAcceptance,
    shouldSkipCreation = false,
  } = props;
  const [isCreationSubmitted, setIsCreationSubmitted] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector(getLoading());
  const user = useSelector(selectUser());
  const userName = getUserName(user);
  const title = isAutomaticAcceptance
    ? "Joining in a moment"
    : "Creating your membership request";

  useEffect(() => {
    (async () => {
      if (isCreationSubmitted || !common || shouldSkipCreation) {
        return;
      }

      const proposalId = uuidv4();
      const discussionId = uuidv4();
      dispatch(
        createMemberAdmittanceProposal.request({
          payload: {
            args: {
              id: proposalId,
              discussionId,
              commonId: common.id,
              title: `Membership request from ${userName}`,
              description: userData.intro,
              images: [],
              files: [],
              links: userData.links || [],
              ...((userData?.feeMonthly || userData?.feeOneTime) && {
                contributionSourceType: ContributionSourceType.CommonImmediate,
              }),
              ...(userData?.feeMonthly
                ? {
                    feeMonthly: {
                      amount: userData?.feeMonthly,
                      currency: Currency.ILS,
                    },
                  }
                : { feeMonthly: null }),
              ...(userData?.feeOneTime
                ? {
                    feeOneTime: {
                      amount: userData?.feeOneTime,
                      currency: Currency.ILS,
                    },
                  }
                : { feeOneTime: null }),
            },
          },
          callback: (error) => {
            if (error) {
              console.error(error);
              return;
            }

            setUserData((nextUserData) => ({
              ...nextUserData,
              stage: MembershipRequestStage.Created,
            }));
          },
        }),
      );

      setIsCreationSubmitted(true);
    })();
  }, [
    isCreationSubmitted,
    common,
    dispatch,
    userData,
    setUserData,
    userName,
    shouldSkipCreation,
  ]);

  useEffect(() => {
    if (isCreationSubmitted && !isLoading) {
      setUserData((nextUserData) => ({
        ...nextUserData,
        stage: MembershipRequestStage.Created,
      }));
    }
  }, [isCreationSubmitted, isLoading, setUserData]);

  return (
    <div className="membership-request-content membership-request-creating">
      <img
        src="/assets/images/membership-request-creating.svg"
        alt="introduce"
      />
      <div className="title">{title}</div>
      <div className="loader-container">
        <Loader />
      </div>
    </div>
  );
}
