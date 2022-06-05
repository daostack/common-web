import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "@/shared/components";
import { getLoading } from "@/shared/store/selectors";
import { createMemberAdmittanceProposal } from "../../../store/actions";
import { IStageProps } from "./MembershipRequestModal";
import { MembershipRequestStage } from "./constants";

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
        createMemberAdmittanceProposal.request({
          payload: {
            args: {
              commonId: common.id,
              title: "",
              description: userData.intro,
              images: [],
              files: [],
              links: userData.links || [],
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
        })
      );

      setIsCreationSubmitted(true);
    })();
  }, [isCreationSubmitted, common, dispatch, userData, setUserData]);

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
      <div className="title">Creating your membership request</div>
      <div className="loader-container">
        <Loader />
      </div>
    </div>
  );
}
