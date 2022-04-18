import React, { useEffect, useState, useCallback, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import classNames from "classnames";

import { CommonListItem, ProposalListItem } from "../../../Common/components";
import {
  Common,
  Proposal,
  ProposalType,
} from "@/shared/models";
import { Loader } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import {
  getCommonsList,
  loadUserProposalList,
} from "../../../Common/store/actions";
import {
  selectCommonList,
  selectUserProposalList,
} from "../../../Common/store/selectors";
import { selectUser } from "../../../Auth/store/selectors";
import { getLoading } from "../../../../shared/store/selectors";
import "./index.scss";

const Activities: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser());
  const commons = useSelector(selectCommonList());
  const proposals = useSelector(selectUserProposalList());
  const loading = useSelector(getLoading());
  const [myCommons, setMyCommons] = useState<Common[]>([]);
  const [myFundingProposals, setMyFundingProposals] = useState<Proposal[]>([]);

  const handleViewAllClick = useCallback(
    (route: ROUTE_PATHS) =>
      history.push(route),
    [history]
  );

  const hideViewAllButton = useCallback(
    (collection: Array<any>) =>
      collection && (collection.length < 4),
    []
  );

  useEffect(() => {
    if (commons.length === 0)
        dispatch(getCommonsList.request());
  }, [dispatch, commons]);

  useEffect(() => {
    if (proposals.length === 0 && user?.uid)
      dispatch(loadUserProposalList.request(user?.uid));
  }, [dispatch, proposals, user]);

  useEffect(() => {
    const myCommons = commons.filter((common) =>
      common.members.some((member) => member.userId === user?.uid)
    );

    setMyCommons(myCommons);
  }, [commons, user]);

  useEffect(() => {
    const myFundingProposals = proposals.filter((proposal) =>
      proposal.type === ProposalType.FundingRequest
    );

    setMyFundingProposals(myFundingProposals);
  }, [proposals, user]);

  return (
    <div className="route-content my-account-activities">
      <header className="my-account-activities__header">
        <h2 className="route-title">Activities</h2>
        <div className="my-account-activities_summaries">
          <div className="my-account-activities_summaries-item">
            <div className="my-account-activities_summary-info">
              <span className="my-account-activities_summary-amount">
                {myCommons.length}
              </span>
              <span className="my-account-activities_summary-title">
                Commons
              </span>
            </div>
            <img
              className="my-account-activities_summary-icon"
              src="/assets/images/my-account-activities-commons-summary.svg"
              alt="Commons summary icon"
            />
          </div>
          <div className="my-account-activities_summaries-item">
            <div className="my-account-activities_summary-info">
              <span className="my-account-activities_summary-amount">
                3
              </span>
              <span className="my-account-activities_summary-title">
                Proposals
              </span>
            </div>
            <img
              className="my-account-activities_summary-icon"
              src="/assets/images/my-account-activities-proposals-summary.svg"
              alt="Proposals summary icon"
            />
          </div>
        </div>
      </header>
      <div className="my-account-activities_content-wrapper">
        <section className="my-account-activities_commons">
          <div className="my-account-activities_section-header">
            <h3>
              Commons ({myCommons.length})
            </h3>
            <div
              className={classNames(
                "my-account-activities_section-viewall",
                {
                  hidden: hideViewAllButton(myCommons)
                }
              )}
              onClick={() => handleViewAllClick(ROUTE_PATHS.MY_COMMONS)}
            >
              <div>
                View all
              </div>
              <img src="/icons/right-arrow.svg" alt="right-arrow" />
            </div>
          </div>
          {loading ? <Loader /> : null}
          {
            (myCommons.length !== 0)
            ? <div className="my-account-activities_section-list">
              {
                myCommons.map(
                  common =>
                    <CommonListItem
                      common={common}
                      key={common.id}
                    />
                ).slice(0, 4)
              }
              </div>
            : !loading && <div className="">
                No commons yet
              </div>  
          }
        </section>
        <section className="my-account-activities_proposals">
          <div className="my-account-activities_section-header">
            <h3>
              Prososals ({myFundingProposals.length})
            </h3>
            <div
              className={classNames(
                "my-account-activities_section-viewall",
                {
                hidden: hideViewAllButton(myFundingProposals)
                }
              )}
              onClick={() => handleViewAllClick(ROUTE_PATHS.MY_PROPOSALS)}
            >
            <div>
              View all
            </div>
              <img src="/icons/right-arrow.svg" alt="right-arrow" />
            </div>
          </div>
          {loading ? <Loader /> : null}
          {
            (myFundingProposals.length !== 0)
            ? <div className="my-account-activities_section-list">
              {
                myFundingProposals.map(
                  proposal =>
                    <ProposalListItem
                      proposal={proposal}
                      key={proposal.id}
                    />
                ).slice(0, 4)
              }
            </div>
            : !loading && <div className="">
              No proposals yet
            </div>  
          }
        </section>
        <section className="my-account-activities_membership-requests">
        
        </section>
      </div>
    </div>
  );
}

export default Activities;
