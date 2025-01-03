import React, { useEffect, useState, useCallback, useMemo, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import SwiperCore, { Pagination } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  CommonListItem,
  FundingProposalListItem,
  MembershipRequestListItem,
} from "@/pages/OldCommon/components";
import { useUserCommons } from "@/pages/OldCommon/hooks";
import { Loader } from "@/shared/components";
import { ProposalsTypes, ROUTE_PATHS, ScreenSize } from "@/shared/constants";
import { Common, Proposal } from "@/shared/models";
import { getScreenSize } from "../../../../shared/store/selectors";
import { selectUser } from "../../../Auth/store/selectors";
import {
  getCommonsList,
  loadUserProposalList,
  getCommonDetail,
  closeCurrentCommon,
} from "../../../OldCommon/store/actions";
import {
  selectCommonList,
  selectUserProposalList,
  selectCurrentProposal,
  selectIsCommonsLoaded,
  selectIsUserProposalsLoaded,
} from "../../../OldCommon/store/selectors";
import { CollectionSummaryCard } from "./CollectionSummaryCard";
import "./index.scss";
import "swiper/components/pagination/pagination.min.css";
import "swiper/swiper.min.css";

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
  const history = useHistory();
  const {
    fetched: areUserCommonsFetched,
    data: myCommons,
    fetchUserCommons,
  } = useUserCommons();
  const user = useSelector(selectUser());
  const commons = useSelector(selectCommonList());
  const isCommonsLoaded = useSelector(selectIsCommonsLoaded());
  const myProposals = useSelector(selectUserProposalList());
  const isUserProposalsLoaded = useSelector(selectIsUserProposalsLoaded());
  const currentProposal = useSelector(selectCurrentProposal());
  const screenSize = useSelector(getScreenSize());
  const myCommonsAmount = myCommons.length;
  const [myFundingProposals, setMyFundingProposals] = useState<
    Proposal[] | null
  >(null);
  const myFundingProposalsAmount = myFundingProposals?.length || 0;
  const [myMembershipRequests, setMyMembershipRequests] = useState<
    Proposal[] | null
  >(null);
  const myMembershipRequestsAmount = myMembershipRequests?.length || 0;
  const [
    {
      showSliderCommonsViewAll,
      showSliderProposalsViewAll,
      showSliderMembershipRequestsViewAll,
    },
    setShowSliderViewAllState,
  ] = useState<ShowSliderViewAllState>(INITIAL_SHOW_SLIDER_VIEWALL_STATE);

  document.documentElement.style.setProperty("--swiper-theme-color", "#000000");

  const isMobileView = useMemo(
    () => screenSize === ScreenSize.Mobile,
    [screenSize],
  );

  const MAX_ROW_ITEMS_AMOUNT = useMemo(
    () => (isMobileView ? 5 : 4),
    [isMobileView],
  );

  const showViewAllButton = useCallback(
    (collectionLength: number) => collectionLength > MAX_ROW_ITEMS_AMOUNT,
    [MAX_ROW_ITEMS_AMOUNT],
  );

  const setShowSliderViewAllButton = useCallback(
    (
      collectionEnum: ActivitiesCollection,
      collectionLength: number,
      showViewAll: boolean,
    ) => {
      switch (collectionEnum) {
        case ActivitiesCollection.COMMONS:
          setShowSliderViewAllState((nextState) => ({
            ...nextState,
            showSliderCommonsViewAll:
              showViewAllButton(collectionLength) && showViewAll,
          }));
          return;
        case ActivitiesCollection.PROPOSALS:
          setShowSliderViewAllState((nextState) => ({
            ...nextState,
            showSliderProposalsViewAll:
              showViewAllButton(collectionLength) && showViewAll,
          }));
          return;
        case ActivitiesCollection.MEMBERSHIP_REQUESTS:
          setShowSliderViewAllState((nextState) => ({
            ...nextState,
            showSliderMembershipRequestsViewAll:
              showViewAllButton(collectionLength) && showViewAll,
          }));
          return;
      }
    },
    [showViewAllButton],
  );

  const getProposalDetail = useCallback(
    (payload: Proposal) =>
      history.push(ROUTE_PATHS.PROPOSAL_DETAIL.replace(":id", payload.id)),
    [],
  );

  const renderCollectionListItem = useCallback(
    (collectionEnum: ActivitiesCollection, item: Common | Proposal) => {
      switch (collectionEnum) {
        case ActivitiesCollection.COMMONS:
          return <CommonListItem common={item as Common} key={item.id} />;
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
    [getProposalDetail],
  );

  const renderCollectionList = useCallback(
    (collection: Common[] | Proposal[], collectionEnum: ActivitiesCollection) =>
      isMobileView ? (
        <div>
          <Swiper
            slidesPerView={"auto"}
            centeredSlides={true}
            spaceBetween={20}
            pagination={{ clickable: true }}
            className={classNames({
              "commons-list": collectionEnum === ActivitiesCollection.COMMONS,
              "proposals-list":
                collectionEnum === ActivitiesCollection.PROPOSALS,
              "membership-requests-list":
                collectionEnum === ActivitiesCollection.MEMBERSHIP_REQUESTS,
            })}
            onReachEnd={() =>
              setShowSliderViewAllButton(
                collectionEnum,
                collection.length,
                true,
              )
            }
            onFromEdge={() =>
              setShowSliderViewAllButton(
                collectionEnum,
                collection.length,
                false,
              )
            }
          >
            {collection
              .slice(0, MAX_ROW_ITEMS_AMOUNT)
              .map((item: Common | Proposal) => (
                <SwiperSlide className="swiper-slide" key={item.id}>
                  {renderCollectionListItem(collectionEnum, item)}
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      ) : (
        <div className="my-account-activities__section-list">
          {collection
            .slice(0, MAX_ROW_ITEMS_AMOUNT)
            .map((item: Common | Proposal) =>
              renderCollectionListItem(collectionEnum, item),
            )}
        </div>
      ),
    [
      isMobileView,
      renderCollectionListItem,
      MAX_ROW_ITEMS_AMOUNT,
      setShowSliderViewAllButton,
    ],
  );

  useEffect(() => {
    if (!currentProposal) return;

    dispatch(
      getCommonDetail.request({
        payload: currentProposal.data.args.commonId,
      }),
    );

    return () => {
      dispatch(closeCurrentCommon());
    };
  }, [dispatch, currentProposal]);

  useEffect(() => {
    if (commons.length === 0) dispatch(getCommonsList.request());
  }, [dispatch, commons]);

  useEffect(() => {
    if (!isUserProposalsLoaded && myProposals.length === 0 && user?.uid)
      dispatch(loadUserProposalList.request(user?.uid));
  }, [isUserProposalsLoaded, dispatch, myProposals, user]);

  useEffect(() => {
    fetchUserCommons();
  }, [fetchUserCommons]);

  useEffect(() => {
    if (isUserProposalsLoaded && Boolean(myProposals.length)) {
      setMyFundingProposals([]);
      setMyMembershipRequests([]);
    }

    const myFundingProposals = myProposals.filter(
      (proposal) => proposal.type === ProposalsTypes.FUNDS_ALLOCATION,
    );

    const myMembershipRequests = myProposals.filter(
      (proposal) => proposal.type === ProposalsTypes.MEMBER_ADMITTANCE,
    );

    setMyFundingProposals(myFundingProposals);
    setMyMembershipRequests(myMembershipRequests);
  }, [setMyFundingProposals, setMyMembershipRequests, myProposals]);

  return (
    <div className="route-content my-account-activities">
      <div className="my-account-activities__header">
        <h2 className="route-title">Activities</h2>
        <div className="my-account-activities__summaries">
          <CollectionSummaryCard
            collectionName="Commons"
            collectionLength={myCommonsAmount}
            iconSrc="/assets/images/common-sign.svg"
            iconAlt="Commons summary icon"
          />
          <CollectionSummaryCard
            collectionName="Proposals"
            collectionLength={myFundingProposalsAmount}
            iconSrc="/assets/images/proposal-sign.svg"
            iconAlt="Proposals summary icon"
          />
        </div>
      </div>
      <div className="my-account-activities__content-wrapper">
        <section className="my-account-activities__commons">
          <div className="my-account-activities__section-header">
            <h3>Commons ({myCommonsAmount})</h3>
            <NavLink
              className={classNames("my-account-activities__section-viewall", {
                hidden:
                  !showViewAllButton(myCommonsAmount) ||
                  (isMobileView && !showSliderCommonsViewAll),
              })}
              to={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES_COMMONS}
            >
              View all
              <img src="/icons/right-arrow.svg" alt="right-arrow" />
            </NavLink>
          </div>
          {isCommonsLoaded && areUserCommonsFetched ? (
            myCommonsAmount !== 0 ? (
              renderCollectionList(myCommons, ActivitiesCollection.COMMONS)
            ) : (
              <div>No commons yet</div>
            )
          ) : (
            <Loader />
          )}
        </section>
        <section className="my-account-activities__proposals">
          <div className="my-account-activities__section-header">
            <h3>Proposals ({myFundingProposalsAmount})</h3>
            <NavLink
              className={classNames("my-account-activities__section-viewall", {
                hidden:
                  !showViewAllButton(myFundingProposalsAmount) ||
                  (isMobileView && !showSliderProposalsViewAll),
              })}
              to={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES_PROPOSALS.replace(
                ":proposalType",
                ProposalsTypes.FUNDS_ALLOCATION,
              )}
            >
              View all
              <img src="/icons/right-arrow.svg" alt="right-arrow" />
            </NavLink>
          </div>
          {myFundingProposals ? (
            myFundingProposalsAmount !== 0 ? (
              renderCollectionList(
                myFundingProposals,
                ActivitiesCollection.PROPOSALS,
              )
            ) : (
              <div>No proposals yet</div>
            )
          ) : (
            <Loader />
          )}
        </section>
        <section className="my-account-activities__membership-requests">
          <div className="my-account-activities__section-header">
            <h3>Membership requests ({myMembershipRequestsAmount})</h3>
            <NavLink
              className={classNames("my-account-activities__section-viewall", {
                hidden:
                  !showViewAllButton(myMembershipRequestsAmount) ||
                  (isMobileView && !showSliderMembershipRequestsViewAll),
              })}
              to={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES_PROPOSALS.replace(
                ":proposalType",
                ProposalsTypes.MEMBER_ADMITTANCE,
              )}
            >
              View all
              <img src="/icons/right-arrow.svg" alt="right-arrow" />
            </NavLink>
          </div>
          {myMembershipRequests ? (
            myMembershipRequestsAmount !== 0 ? (
              renderCollectionList(
                myMembershipRequests,
                ActivitiesCollection.MEMBERSHIP_REQUESTS,
              )
            ) : (
              <div>No membership requests yet</div>
            )
          ) : (
            <Loader />
          )}
        </section>
      </div>
    </div>
  );
};

export default Activities;
