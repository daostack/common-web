import React, { useEffect, useState, useCallback, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import classNames from "classnames";

import {
  CommonListItem,
  ProposalListItem,
  ProposalDetailModal,
} from "../../../Common/components";
import {
  Common,
  Proposal,
  ProposalType,
} from "@/shared/models";
import { Loader, Modal } from "@/shared/components";
import { ROUTE_PATHS, ScreenSize } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import {
  getCommonsList,
  loadUserProposalList,
  loadProposalDetail,
  clearCurrentProposal,
  closeCurrentCommon,
  getCommonDetail,
} from "../../../Common/store/actions";
import {
  selectCommonList,
  selectUserProposalList,
  selectCurrentProposal,
  selectCommonDetail,
} from "../../../Common/store/selectors";
import { selectUser } from "../../../Auth/store/selectors";
import {
  getLoading,
  getScreenSize,
} from "../../../../shared/store/selectors";
import "./index.scss";

const Activities: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser());
  const commons = useSelector(selectCommonList());
  const myProposals = useSelector(selectUserProposalList());
  const currentProposal = useSelector(selectCurrentProposal());
  const currentCommon = useSelector(selectCommonDetail());
  const loading = useSelector(getLoading());
  const screenSize = useSelector(getScreenSize());
  const { isShowing, onOpen, onClose } = useModal(false);
  const [myCommons, setMyCommons] = useState<Common[]>([]);
  const [myFundingProposals, setMyFundingProposals] = useState<Proposal[]>([]);
  const isMobileView = screenSize === ScreenSize.Mobile;

  const commonMember = currentCommon?.members.find(
    (member) => member.userId === user?.uid
  );
  const isCommonMember = Boolean(commonMember);

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

  const getProposalDetail = useCallback(
    (payload: Proposal) => {
      dispatch(loadProposalDetail.request(payload));
      onOpen();
    },
    [dispatch, onOpen]
  );

  const closeModalHandler = useCallback(() => {
    onClose();
    dispatch(clearCurrentProposal());
  }, [onClose, dispatch]);

  useEffect(() => {
    if (!currentProposal) return;

    dispatch(
      getCommonDetail.request({
        payload: currentProposal?.commonId,
      })
    );

    return () => {
      dispatch(closeCurrentCommon());
    };
  }, [dispatch, currentProposal]);

  useEffect(() => {
    if (commons.length === 0)
      dispatch(getCommonsList.request());
  }, [dispatch, commons]);

  useEffect(() => {
    if (myProposals.length === 0 && user?.uid)
      dispatch(loadUserProposalList.request(user?.uid));
  }, [dispatch, myProposals, user]);

  useEffect(() => {
    const myCommons = commons.filter((common) =>
      common.members.some((member) => member.userId === user?.uid)
    );

    setMyCommons(myCommons);
  }, [commons, user]);

  useEffect(() => {
    const myFundingProposals = myProposals.filter((proposal) =>
      proposal.type === ProposalType.FundingRequest
    );

    setMyFundingProposals(myFundingProposals);
  }, [myProposals, user]);

  return (
    <>
      {
        isShowing && <Modal
          isShowing={isShowing}
          onClose={closeModalHandler}
          mobileFullScreen
          className={classNames("proposals", {
            "mobile-full-screen": isMobileView,
          })}
          isHeaderSticky
          shouldShowHeaderShadow={false}
          styles={{
            headerWrapper: "my-account-activities__detail-modal-header-wrapper",
          }}
        >
          <ProposalDetailModal
            proposal={currentProposal}
            common={currentCommon}
            onOpenJoinModal={() => true}
            isCommonMember={isCommonMember}
            isJoiningPending={false}
          />
        </Modal>
      }
      <div className="route-content my-account-activities">
        <div className="my-account-activities__header">
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
                  {myFundingProposals.length}
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
        </div>
        <div className="my-account-activities_content-wrapper">
          <section className="my-account-activities_commons">
            <div className="my-account-activities_section-header">
              <h3>
                Commons ({myCommons.length})
              </h3>
              <NavLink
                className={classNames(
                  "my-account-activities_section-viewall",
                  {
                    hidden: hideViewAllButton(myCommons)
                  }
                )}
                to={ROUTE_PATHS.MY_COMMONS}
              >
                View all
                <img src="/icons/right-arrow.svg" alt="right-arrow" />
              </NavLink>
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
                : !loading && <div>
                  No commons yet
                </div>
            }
          </section>
          <section className="my-account-activities_proposals">
            <div className="my-account-activities_section-header">
              <h3>
                Prososals ({myFundingProposals.length})
              </h3>
              <NavLink
                className={classNames(
                  "my-account-activities_section-viewall",
                  {
                    hidden: hideViewAllButton(myFundingProposals)
                  }
                )}
                to={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES_PROPOSALS}
              >
                View all
                <img src="/icons/right-arrow.svg" alt="right-arrow" />
              </NavLink>
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
                          loadProposalDetails={getProposalDetail}
                        />
                    ).slice(0, 4)
                  }
                </div>
                : !loading && <div>
                  No proposals yet
                </div>
            }
          </section>
          <section className="my-account-activities_membership-requests">

          </section>
        </div>
      </div>
    </>
  );
}

export default Activities;
