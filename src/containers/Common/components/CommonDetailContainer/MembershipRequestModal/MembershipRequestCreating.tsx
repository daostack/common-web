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

      const funding = userData.contributionAmount || 0;

      dispatch(
        createRequestToJoin.request({
          funding,
          commonId: common.id,
          description: userData.intro,
          cardId: funding !== 0 ? userData.cardId : undefined,
          links: userData.links,
        })
      );

      setIsCreationSubmitted(true);
    })();
  }, [isCreationSubmitted, common, dispatch, userData]);

  useEffect(() => {
    if (isCreationSubmitted && !isLoading) {
      setUserData((nextUserData) => ({ ...nextUserData, stage: 6 }));
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
