import React, { useEffect, useCallback, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { NavLink, useParams } from "react-router-dom";

import { Proposal } from "@/shared/models";
import { FundingProposalListItem, MembershipRequestListItem } from "@/containers/Common/components";
import { Loader } from "@/shared/components";
import { ProposalsTypes, ROUTE_PATHS } from "@/shared/constants";
import { selectUserProposalList, selectCurrentProposal } from "../../../../Common/store/selectors";
import { selectUser } from "../../../../Auth/store/selectors";
import { getLoading } from "../../../../../shared/store/selectors";
import {
  getCommonDetail,
  loadUserProposalList,
  closeCurrentCommon,
} from "../../../../Common/store/actions";
import "./index.scss";

interface MyProposalsContainerRouterParams {
  proposalType: ProposalsTypes;
}

const ActivitiesProposalsContainer: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { proposalType } = useParams<MyProposalsContainerRouterParams>();
  const myProposals = useSelector(selectUserProposalList());
  const user = useSelector(selectUser());
  const currentProposal = useSelector(selectCurrentProposal());
  const loading = useSelector(getLoading());
  const [myProposalsByType, setMyProposalsByType] = useState<Proposal[]>([]);

  const getProposalDetail = useCallback(
    (payload: Proposal) =>
      history.push(ROUTE_PATHS.PROPOSAL_DETAIL.replace(":id", payload.id)),
    []
  );

  const renderListItem = useCallback(
    (proposal: Proposal) => {
      switch (proposalType) {
        case ProposalsTypes.FUNDS_ALLOCATION:
          return (
            <FundingProposalListItem
              proposal={proposal}
              key={proposal.id}
              loadProposalDetails={getProposalDetail}
            />
          );
        case ProposalsTypes.MEMBER_ADMITTANCE:
          return (
            <MembershipRequestListItem
              proposal={proposal}
              key={proposal.id}
              loadProposalDetails={getProposalDetail}
            />
          );
      }
    },
    [proposalType, getProposalDetail]
  );

  useEffect(() => {
    if (myProposals.length === 0 && user?.uid)
      dispatch(loadUserProposalList.request(user?.uid));
  }, [dispatch, myProposals, user]);

  useEffect(() => {
    if (!myProposals.length) return;

    const myProposalsByType = myProposals.filter(
      (proposal) => proposal.type === proposalType
    );

    setMyProposalsByType(myProposalsByType);
  }, [myProposals, setMyProposalsByType, proposalType]);

  useEffect(() => {
    if (!currentProposal) return;

    dispatch(
      getCommonDetail.request({
        payload: currentProposal.data.args.commonId,
      })
    );

    return () => {
      dispatch(closeCurrentCommon());
    };
  }, [dispatch, currentProposal]);

  return (
    <div className="activities-proposals">
      <h2 className="activities-proposals__header">
        <NavLink to={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES}>
          <img src="/icons/left-arrow.svg" alt="left-arrow" />
          {proposalType === ProposalsTypes.FUNDS_ALLOCATION
            ? "Proposals "
            : "Membership requests "}
          ({myProposalsByType.length})
        </NavLink>
      </h2>
      {loading && <Loader />}
      <div className="activities-proposals__proposals-list">
        {myProposalsByType.map((proposal) => renderListItem(proposal))}
      </div>
    </div>
  );
};

export default ActivitiesProposalsContainer;
