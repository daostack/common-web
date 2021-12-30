import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../../../../../shared/components";
import { getLoading } from "../../../../../shared/store/selectors";
import { createRequestToJoin } from "../../../store/actions";
import { IStageProps } from "./MembershipRequestModal";

export default function MembershipRequestCreating(props: IStageProps) {
  const { userData, setUserData, common } = props;
  const [isCreationSubmitted, setIsCreationSubmitted] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector(getLoading());

  useEffect(() => {
    (async () => {
      if (isCreationSubmitted || !common) {
        return;
      }

      dispatch(
        createRequestToJoin.request({
          commonId: common.id,
          description: userData.intro,
          funding: userData.contributionAmount || 0,
          cardId: userData.cardId,
        })
      );

      setIsCreationSubmitted(true);
    })();
  }, [isCreationSubmitted, common, dispatch, userData]);

  useEffect(() => {
    if (isCreationSubmitted && !isLoading) {
      setUserData((nextUserData) => ({ ...nextUserData, stage: 7 }));
    }
  }, [isCreationSubmitted, isLoading, setUserData]);

  return (
    <div className="membership-request-content membership-request-creating">
      <img
        src="/assets/images/membership-request-creating.svg"
        alt="introduce"
      />
      <div className="title">Creating your membership request</div>
      <div className="loader-container">
        <Loader />
      </div>
    </div>
  );
}
