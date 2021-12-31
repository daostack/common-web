import React, { useEffect, useState } from "react";
import ProposalService from "../../../../../services/ProposalService";
import { Loader } from "../../../../../shared/components";
import { IStageProps } from "./MembershipRequestModal";

export default function MembershipRequestCreating(props: IStageProps) {
  const { userData, setUserData, common } = props;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (isLoading || !common) {
        return;
      }

      setIsLoading(true);

      try {
        const funding = userData.contributionAmount || 0;

        await ProposalService.createRequestToJoin({
          funding,
          commonId: common.id,
          description: userData.intro,
          cardId: funding !== 0 ? userData.cardId : undefined,
        });

        setUserData((nextUserData) => ({ ...nextUserData, stage: 7 }));
      } catch (error) {
        console.error("Error during request to join creation");
      }
    })();
  }, [isLoading, common, userData, setUserData]);

  return (
    <div className="membership-request-content membership-request-creating">
      <img src="/assets/images/membership-request-creating.svg" alt="introduce" />
      <div className="title">Creating your membership request</div>
      <div className="loader-container">
        <Loader />
      </div>
    </div>
  );
}
