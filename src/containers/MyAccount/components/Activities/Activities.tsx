import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  FC
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import SwiperCore, { Pagination } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import classNames from "classnames";

import {
  CommonListItem,
  FundingProposalListItem,
  MembershipRequestListItem,
  ProposalDetailModal,
} from "@/containers/Common/components";
import { CollectionSummaryCard } from "./CollectionSummaryCard";
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

SwiperCore.use([Pagination]);

interface ShowSliderViewAllState {
  showSliderCommonsViewAll: boolean;
  showSliderProposalsViewAll: boolean;
  showSliderMembershipRequestsViewAll: boolean;
}

enum ActivitiesCollection {
  COMMONS,
  PROPOSALS,
  MEMBERSHIP_REQUESTS,
}

const INITIAL_SHOW_SLIDER_VIEWALL_STATE: ShowSliderViewAllState = {
  showSliderCommonsViewAll: false,
  showSliderProposalsViewAll: false,
  showSliderMembershipRequestsViewAll: false,
};

const Activities: FC = () => {
  const dispatch = useDispatch();
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
  const [myMembershipRequests, setMyMembershipRequests] = useState<Proposal[]>([]);
  const [
    {
      showSliderCommonsViewAll,
      showSliderProposalsViewAll,
      showSliderMembershipRequestsViewAll,
    },
    setShowSliderViewAllState,
  ] = useState<ShowSliderViewAllState>(INITIAL_SHOW_SLIDER_VIEWALL_STATE);

  document.documentElement.style.setProperty("--swiper-theme-color", "#000000");

  const isMobileView = useMemo(() => (screenSize === ScreenSize.Mobile), [screenSize]);

  const isCommonMember = useMemo(() => {
    const commonMember = currentCommon?.members.find(
      (member) => member.userId === user?.uid
    );

    return Boolean(commonMember);
  }, [currentCommon, user]);

  const MAX_ROW_ITEMS_AMOUNT = useMemo(() => (isMobileView ? 5 : 4), [isMobileView]);

  const showViewAllButton = useCallback(
    (collectionLength: number) =>
      (collectionLength > MAX_ROW_ITEMS_AMOUNT),
    [MAX_ROW_ITEMS_AMOUNT]
  );

  const setShowSliderViewAllButton = useCallback(
    (
      collectionEnum: ActivitiesCollection,
      collectionLength: number,
      showViewAll: boolean
    ) => {
      switch (collectionEnum) {
        case ActivitiesCollection.COMMONS:
          setShowSliderViewAllState((nextState) => ({
            ...nextState,
            showSliderCommonsViewAll: showViewAllButton(collectionLength) && showViewAll,
          })); return;
        case ActivitiesCollection.PROPOSALS:
          setShowSliderViewAllState((nextState) => ({
            ...nextState,
            showSliderProposalsViewAll: showViewAllButton(collectionLength) && showViewAll,
          })); return;
        case ActivitiesCollection.MEMBERSHIP_REQUESTS:
          setShowSliderViewAllState((nextState) => ({
            ...nextState,
            showSliderMembershipRequestsViewAll: showViewAllButton(collectionLength) && showViewAll,
          })); return;
      }
    },
    [showViewAllButton]
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

  const renderCollectionListItem = useCallback(
    (collectionEnum: ActivitiesCollection, item: Common | Proposal) => {
      switch (collectionEnum) {
        case ActivitiesCollection.COMMONS:
          return (
            <CommonListItem
              common={item as Common}
              key={item.id}
            />
          );
        case ActivitiesCollection.PROPOSALS:
          return (
            <FundingProposalListItem
              proposal={item as Proposal}
              key={item.id}
              loadProposalDetails={getProposalDetail}
            />
          );
        case ActivitiesCollection.MEMBERSHIP_REQUESTS:
          return (
            <MembershipRequestListItem
              proposal={item as Proposal}
              key={item.id}
              loadProposalDetails={getProposalDetail}
            />
          );
      }
    },
    [getProposalDetail]
  );

  const renderCollectionList = useCallback(
    (collection: Common[] | Proposal[], collectionEnum: ActivitiesCollection) =>
      (
        isMobileView
        ? (
          <div>
            <Swiper
              slidesPerView={"auto"}
              centeredSlides={true}
              spaceBetween={20}
              pagination={{ clickable: true }}
              onReachEnd={() =>
                setShowSliderViewAllButton(
                  collectionEnum,
                  collection.length,
                  true,
                )}
              onFromEdge={() =>
                setShowSliderViewAllButton(
                  collectionEnum,
                  collection.length,
                  false,
              )}
            >
              {
                collection.slice(0, MAX_ROW_ITEMS_AMOUNT).map(
                  (item: Common | Proposal) =>
                    <SwiperSlide className="swiper-slide" key={item.id}>
                      {renderCollectionListItem(collectionEnum, item)}
                    </SwiperSlide>
                )
              }
            </Swiper>
          </div>
        )
        : (
          <div className="my-account-activities_section-list">
            {
              collection.slice(0, MAX_ROW_ITEMS_AMOUNT).map(
                (item: Common | Proposal) =>
                  renderCollectionListItem(collectionEnum, item)
              )
            }
          </div>
        )
      ),
    [isMobileView, renderCollectionListItem, MAX_ROW_ITEMS_AMOUNT, setShowSliderViewAllButton]
  );

  useEffect(() => {
    if (!currentProposal) return;

    dispatch(
      getCommonDetail.request({
        payload: currentProposal.commonId,
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
    if (commons.length === 0 || !user?.uid)
      return

    const myCommons = commons.filter((common) =>
      common.members.some((member) => member.userId === user?.uid)
    );

    setMyCommons(myCommons);
  }, [setMyCommons, commons, user]);

  useEffect(() => {
    if (!myProposals.length)
      return;

    const myFundingProposals = myProposals.filter((proposal) =>
      proposal.type === ProposalType.FundingRequest
    );

    const myMembershipRequests = myProposals.filter((proposal) =>
      proposal.type === ProposalType.Join
    );

    setMyFundingProposals(myFundingProposals);
    setMyMembershipRequests(myMembershipRequests);
  }, [setMyFundingProposals, setMyMembershipRequests, myProposals]);

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
            isCommonMember={isCommonMember}
          />
        </Modal>
      }
      <div className="route-content my-account-activities">
        <div className="my-account-activities__header">
          <h2 className="route-title">Activities</h2>
          <div className="my-account-activities_summaries">
            <CollectionSummaryCard
              collectionName="Commons"
              collectionLength={myCommons.length}
              iconSrc="/assets/images/common-sign.svg"
              iconAlt="Commons summary icon"
            />
            <CollectionSummaryCard
              collectionName="Proposals"
              collectionLength={myProposals.length}
              iconSrc="/assets/images/proposal-sign.svg"
              iconAlt="Proposals summary icon"
            />
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
                    hidden: !showViewAllButton(myCommons.length)
                            || (isMobileView && !showSliderCommonsViewAll)
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
                ? renderCollectionList(myCommons, ActivitiesCollection.COMMONS)
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
                    hidden: !showViewAllButton(myFundingProposals.length)
                            || (isMobileView && !showSliderProposalsViewAll)
                  }
                )}
                to={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES_PROPOSALS.replace(":proposalType", ProposalType.FundingRequest)}
              >
                View all
                <img src="/icons/right-arrow.svg" alt="right-arrow" />
              </NavLink>
            </div>
            {loading ? <Loader /> : null}
            {
              (myFundingProposals.length !== 0)
                ? renderCollectionList(myFundingProposals, ActivitiesCollection.PROPOSALS)
                : !loading && <div>
                  No proposals yet
                </div>
            }
          </section>
          <section className="my-account-activities_membership-requests">
            <div className="my-account-activities_section-header">
              <h3>
                Membership requests ({myMembershipRequests.length})
              </h3>
              <NavLink
                className={classNames(
                  "my-account-activities_section-viewall",
                  {
                    hidden: !showViewAllButton(myMembershipRequests.length)
                            || (isMobileView && !showSliderMembershipRequestsViewAll)
                  }
                )}
                to={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES_PROPOSALS.replace(":proposalType", ProposalType.Join)}
              >
                View all
                <img src="/icons/right-arrow.svg" alt="right-arrow" />
              </NavLink>
            </div>
            {loading ? <Loader /> : null}
            {
              (myMembershipRequests.length !== 0)
                ? renderCollectionList(myMembershipRequests, ActivitiesCollection.MEMBERSHIP_REQUESTS)
                : !loading && <div>
                  No membership requests yet
                </div>
            }
          </section>
        </div>
      </div>
    </>
  );
}

export default Activities;
