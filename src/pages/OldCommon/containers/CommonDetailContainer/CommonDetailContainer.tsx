import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import { setLoginModalState } from "@/pages/Auth/store/actions";
import {
  GlobalLoader,
  Loader,
  NotFound,
  CommonShare,
  UserAvatar,
} from "@/shared/components";
import { Modal } from "@/shared/components/Modal";
import {
  Colors,
  ScreenSize,
  ShareViewType,
  DynamicLinkType,
  ProposalsTypes,
  ROUTE_PATHS,
} from "@/shared/constants";
import {
  useAuthorizedModal,
  useModal,
  useQueryParams,
  useViewPortHook,
} from "@/shared/hooks";
import { useCommon, useSubCommons } from "@/shared/hooks/useCases";
import PurpleCheckIcon from "@/shared/icons/purpleCheck.icon";
import ShareIcon from "@/shared/icons/share.icon";
import {
  Discussion,
  DiscussionWithHighlightedMessage,
  Proposal,
  ProposalWithHighlightedComment,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import {
  checkIsCountdownState,
  formatPrice,
  getUserName,
} from "@/shared/utils";
import CheckIcon from "../../../../shared/icons/check.icon";
import { LoginModalType } from "../../../Auth/interface";
import { authentificated, selectUser } from "../../../Auth/store/selectors";
import {
  AboutTabComponent,
  PreviewInformationList,
  DiscussionsComponent,
  DiscussionDetailModal,
  CommonMenu,
  CreateProposalModal,
  ProposalsComponent,
  AboutSidebarComponent,
  AddDiscussionComponent,
  WalletComponent,
} from "../../components/CommonDetailContainer";
import { MembersComponent } from "../../components/CommonDetailContainer/MembersComponent";
import { MembershipRequestModal } from "../../components/CommonDetailContainer/MembershipRequestModal";
import { useCommonMember } from "../../hooks";
import {
  clearCurrentDiscussion,
  closeCurrentCommon,
  getCommonDetail,
  loadCommonDiscussionList,
  loadDiscussionDetail,
  loadProposalList,
  loadUserCards,
  setCommonActiveTab,
  clearCommonActiveTab,
} from "../../store/actions";
import {
  selectCommonDetail,
  selectCurrentDisscussion,
  selectDiscussions,
  selectGovernance,
  selectIsDiscussionsLoaded,
  selectIsProposalLoaded,
  selectProposals,
  selectCommonActiveTab,
} from "../../store/selectors";
import { COMMON_DETAILS_PAGE_TAB_QUERY_PARAM, Tabs } from "./constants";
import { getInitialTab, getCommonSubtitle } from "./helpers";
import "./index.scss";

interface CommonDetailRouterParams {
  id: string;
}

interface CommonDetailProps {
  commonId?: string;
  tab?: Tabs;
  activeModalElement?:
    | Proposal
    | ProposalWithHighlightedComment
    | Discussion
    | DiscussionWithHighlightedMessage;
  linkType?: DynamicLinkType;
}

const tabs = [
  {
    name: "About",
    key: Tabs.About,
    icon: Tabs.About,
  },
  {
    name: "Proposals",
    key: Tabs.Proposals,
    icon: Tabs.Proposals,
  },
  {
    name: "Discussions",
    key: Tabs.Discussions,
    icon: Tabs.Discussions,
  },

  {
    name: "Wallet",
    key: Tabs.Wallet,
    icon: Tabs.Wallet,
  },
  {
    name: "Members",
    key: Tabs.Members,
    icon: Tabs.Members,
  },
  // {
  //   name: "Notifications",
  //   key: Tabs.Notifications,
  //   icon: Tabs.Notifications,
  // },
];

export default function CommonDetail(props: CommonDetailProps = {}) {
  const { id: routeCommonId } = useParams<CommonDetailRouterParams>();
  const queryParams = useQueryParams();
  const id = props.commonId || routeCommonId;
  const {
    data: parentCommon,
    fetched: isParentCommonFetched,
    fetchCommon: fetchParentCommon,
    setCommon: setParentCommon,
  } = useCommon();
  const {
    data: subCommons,
    fetched: areSubCommonsFetched,
    fetchSubCommons,
    addSubCommon,
  } = useSubCommons();

  const [joinEffortRef, setJoinEffortRef] = useState<HTMLDivElement | null>(
    null,
  );
  const inViewport = useViewPortHook(joinEffortRef, "-50px");
  const inViewPortFooter = useViewPortHook(
    document.querySelector(".footer-wrapper"),
    "0px",
  );
  const [stickyClass, setStickyClass] = useState("");
  const [footerClass, setFooterClass] = useState("");
  const [tab, setTab] = useState(() => {
    const defaultTab = queryParams[COMMON_DETAILS_PAGE_TAB_QUERY_PARAM];

    return getInitialTab(typeof defaultTab === "string" ? defaultTab : "");
  });
  const [imageError, setImageError] = useState(false);
  const [isCreationStageReached, setIsCreationStageReached] = useState(false);
  const [isCommonFetched, setIsCommonFetched] = useState(false);
  const [initialProposalTypeForCreation, setInitialProposalTypeForCreation] =
    useState<ProposalsTypes | null>(null);

  const common = useSelector(selectCommonDetail());
  const governance = useSelector(selectGovernance());
  const currentDiscussion = useSelector(selectCurrentDisscussion());
  const proposals = useSelector(selectProposals());
  const discussions = useSelector(selectDiscussions());
  const isDiscussionsLoaded = useSelector(selectIsDiscussionsLoaded());
  const isProposalsLoaded = useSelector(selectIsProposalLoaded());
  const screenSize = useSelector(getScreenSize());
  const isAuthenticated = useSelector(authentificated());
  const user = useSelector(selectUser());
  const activeTab = useSelector(selectCommonActiveTab());
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember();
  const commonSubtitle = getCommonSubtitle(parentCommon, subCommons);

  const userDiscussions = useMemo(() => {
    const circleIds = new Set(
      commonMember ? Object.values(commonMember.circles.map) : [],
    );
    return discussions.filter(({ circleVisibility }) => {
      if (!circleVisibility?.length) {
        return true;
      }
      return circleVisibility?.some((discussionCircleId) =>
        circleIds.has(discussionCircleId),
      );
    });
  }, [discussions, commonMember]);

  const activeProposals = useMemo(
    () => proposals.filter((d) => checkIsCountdownState(d)),
    [proposals],
  );

  const isSubCommon = Boolean(common?.directParent);
  const isCommonMember = Boolean(commonMember);
  const isJoiningPending = proposals.some(
    (proposal) =>
      proposal.type === ProposalsTypes.MEMBER_ADMITTANCE &&
      checkIsCountdownState(proposal) &&
      proposal.data.args.proposerId === user?.uid,
  );
  const shouldAllowJoiningToCommon =
    !isCommonMember && (isCreationStageReached || !isJoiningPending);
  const shouldShowStickyJoinEffortButton =
    screenSize === ScreenSize.Mobile &&
    ((tab === Tabs.Discussions && userDiscussions?.length > 0) ||
      (tab === Tabs.Proposals && activeProposals.length > 0)) &&
    !isCommonMember &&
    !isJoiningPending &&
    !inViewport &&
    !isSubCommon &&
    (stickyClass || footerClass);

  const dispatch = useDispatch();
  const history = useHistory();

  const { isShowing, onOpen, onClose } = useModal(false);
  const {
    isShowing: isShowingNewD,
    onOpen: onOpenNewD,
    onClose: onCloseNewD,
  } = useModal(false);

  const {
    isShowing: isShowingNewP,
    onOpen: onOpenNewP,
    onClose: onCloseNewP,
  } = useModal(false);

  const {
    isModalOpen: isJoinModalOpen,
    onOpen: onOpenJoinModal,
    onClose: onCloseJoinModal,
  } = useAuthorizedModal();
  const showJoinModal = isJoinModalOpen && isCommonMemberFetched;
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleOpen = useCallback(() => {
    onOpenJoinModal(LoginModalType.RequestToJoin);
  }, [onOpenJoinModal]);

  const handleProposalCreationModalClose = () => {
    onCloseNewP();
    setInitialProposalTypeForCreation(null);
  };

  const changeTabHandler = useCallback(
    (tab: Tabs) => {
      switch (tab) {
        case Tabs.Discussions:
          if (!isDiscussionsLoaded) {
            dispatch(loadCommonDiscussionList.request());
          }
          break;

        case Tabs.Proposals:
          if (!isProposalsLoaded) {
            dispatch(loadProposalList.request());
          }
          break;
        default:
          break;
      }

      setTab(tab);
    },
    [dispatch, isDiscussionsLoaded, isProposalsLoaded],
  );

  const handleCommonDelete = () => {
    setInitialProposalTypeForCreation(ProposalsTypes.DELETE_COMMON);
    onOpenNewP();
  };

  useEffect(() => {
    if (!activeTab || !isCommonFetched) return;

    changeTabHandler(activeTab);

    if (!props.commonId) {
      return () => {
        dispatch(clearCommonActiveTab());
      };
    }
  }, [dispatch, activeTab, props.commonId, changeTabHandler, isCommonFetched]);

  useEffect(() => {
    dispatch(loadUserCards.request({ callback: () => true }));
    dispatch(
      getCommonDetail.request({
        payload: id,
        callback: () => {
          setIsCommonFetched(true);
        },
      }),
    );
    return () => {
      dispatch(closeCurrentCommon());
    };
  }, [dispatch, id]);

  useEffect(() => {
    fetchCommonMember(id);
  }, [fetchCommonMember, id]);

  const getDisscussionDetail = useCallback(
    (payload: Discussion | DiscussionWithHighlightedMessage) => {
      dispatch(loadDiscussionDetail.request(payload));
      onOpen();
    },
    [dispatch, onOpen],
  );

  const getProposalDetail = useCallback(
    (payload: Proposal | ProposalWithHighlightedComment) => {
      history.push({
        pathname: ROUTE_PATHS.PROPOSAL_DETAIL.replace(":id", payload.id),
        state: {
          highlightedCommentId: (payload as ProposalWithHighlightedComment)
            ?.highlightedCommentId,
        },
      });
    },
    [],
  );

  useEffect(() => {
    if (!props.commonId) return;

    const { tab, activeModalElement, linkType } = props;

    if (!tab || !activeModalElement || !linkType) return;

    setTab(tab);

    switch (linkType) {
      case DynamicLinkType.Proposal:
        getProposalDetail(activeModalElement as Proposal);
        break;
      case DynamicLinkType.ProposalComment:
        getProposalDetail(activeModalElement as ProposalWithHighlightedComment);
        break;
      case DynamicLinkType.Discussion:
        getDisscussionDetail(activeModalElement as Discussion);
        break;
      case DynamicLinkType.DiscussionMessage:
        getDisscussionDetail(
          activeModalElement as DiscussionWithHighlightedMessage,
        );
        break;
    }
    // eslint-disable-next-line
  }, []);

  const closeModalHandler = useCallback(() => {
    onClose();
    dispatch(clearCurrentDiscussion());

    if (props.commonId) {
      dispatch(setCommonActiveTab(tab));

      history.push(ROUTE_PATHS.COMMON_DETAIL.replace(":id", props.commonId));
    } else {
      dispatch(loadCommonDiscussionList.request());
    }
  }, [onClose, dispatch, history, tab, props.commonId]);

  const clickPreviewDisscusionHandler = useCallback(
    (id: string) => {
      changeTabHandler(Tabs.Discussions);
      const disscussion = userDiscussions.find((f) => f.id === id);
      if (disscussion) {
        getDisscussionDetail(disscussion);
      }
    },
    [userDiscussions, changeTabHandler, getDisscussionDetail],
  );

  const clickPreviewProposalHandler = useCallback(
    (id: string) => {
      changeTabHandler(Tabs.Proposals);
      const proposal = proposals.find((f) => f.id === id);
      if (proposal) {
        getProposalDetail(proposal);
      }
    },
    [proposals, changeTabHandler, getProposalDetail],
  );

  // const addProposal = useCallback(
  //   (
  //     payload: CreateFundsAllocationData,
  //     callback: (error: string | null) => void
  //   ) => {
  //     dispatch(createFundingProposal.request({ payload, callback }));
  //   },
  //   [dispatch]
  // );

  const openJoinModal = useCallback(() => {
    onClose();
    setTimeout(handleOpen, 0);
  }, [handleOpen, onClose]);

  const closeJoinModal = useCallback(() => {
    onCloseJoinModal();
    if (currentDiscussion) {
      setTimeout(onOpen, 0);
    }
  }, [onOpen, currentDiscussion, onCloseJoinModal]);

  const addPost = useCallback(() => {
    if (!user) return setTimeout(onOpenJoinModal, 0);
    onOpenNewD();
  }, [onOpenJoinModal, onOpenNewD, user]);

  const addNewProposal = useCallback(() => {
    if (!user) return setTimeout(onOpenJoinModal, 0);
    onOpenNewP();
  }, [onOpenJoinModal, onOpenNewP, user]);

  const renderSidebarContent = () => {
    if (!common) return null;
    switch (tab) {
      case Tabs.About:
        return (
          <>
            <PreviewInformationList
              title="Latest Discussions"
              discussions={userDiscussions}
              vievAllHandler={() => changeTabHandler(Tabs.Discussions)}
              onClickItem={clickPreviewDisscusionHandler}
              type="discussions"
              commonMember={commonMember}
            />
            <PreviewInformationList
              title="Latest Proposals"
              proposals={activeProposals}
              vievAllHandler={() => changeTabHandler(Tabs.Proposals)}
              onClickItem={clickPreviewProposalHandler}
              type="proposals"
              commonMember={commonMember}
            />
          </>
        );

      case Tabs.Discussions:
        return (
          <>
            <AboutSidebarComponent
              title="About"
              vievAllHandler={() => changeTabHandler(Tabs.About)}
              common={common}
            />
            <PreviewInformationList
              title="Latest Proposals"
              proposals={activeProposals}
              vievAllHandler={() => changeTabHandler(Tabs.Proposals)}
              onClickItem={clickPreviewProposalHandler}
              type="proposals"
              commonMember={commonMember}
            />
          </>
        );
      case Tabs.Proposals:
        return (
          <>
            <AboutSidebarComponent
              title="About"
              vievAllHandler={() => changeTabHandler(Tabs.About)}
              common={common}
            />
            <PreviewInformationList
              title="Latest Discussions"
              discussions={userDiscussions}
              vievAllHandler={() => changeTabHandler(Tabs.Discussions)}
              onClickItem={clickPreviewDisscusionHandler}
              type="discussions"
              commonMember={commonMember}
            />
          </>
        );
      case Tabs.Members:
        return (
          <>
            <PreviewInformationList
              title="Latest Proposals"
              proposals={activeProposals}
              vievAllHandler={() => changeTabHandler(Tabs.Proposals)}
              onClickItem={clickPreviewProposalHandler}
              type="proposals"
              commonMember={commonMember}
            />
            <PreviewInformationList
              title="Latest Discussions"
              discussions={userDiscussions}
              vievAllHandler={() => changeTabHandler(Tabs.Discussions)}
              onClickItem={clickPreviewDisscusionHandler}
              type="discussions"
              commonMember={commonMember}
            />
          </>
        );
      case Tabs.Notifications:
        return <div>Coming soon</div>;
      case Tabs.Wallet:
        return <div>Coming soon</div>;
    }
  };

  useEffect(() => {
    if (!common) {
      return;
    }

    if (common.directParent) {
      fetchParentCommon(common.directParent.commonId);
    } else {
      setParentCommon(null);
    }
  }, [common, fetchParentCommon, setParentCommon]);

  useEffect(() => {
    fetchSubCommons(id);
  }, [fetchSubCommons, id]);

  useEffect(() => {
    if (inViewport) {
      setStickyClass("");
    } else {
      if (joinEffortRef && joinEffortRef.offsetTop < window.scrollY) {
        if (tab === Tabs.Discussions && userDiscussions?.length) {
          setStickyClass("sticky");
        } else if (tab === Tabs.Proposals && activeProposals.length) {
          setStickyClass("sticky");
        } else if (tab === Tabs.About) {
          setStickyClass("sticky");
        }
      }
    }
  }, [
    inViewport,
    activeProposals,
    tab,
    userDiscussions,
    setStickyClass,
    joinEffortRef,
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(
        setLoginModalState({
          isShowing: true,
          canCloseModal: false,
        }),
      );
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (inViewPortFooter) {
      if (inViewport) {
        setStickyClass("sticky");
      }
      setFooterClass("footer-sticky");
    } else {
      setFooterClass("");
    }
  }, [inViewPortFooter, setFooterClass, inViewport]);

  useEffect(() => {
    if (showJoinModal && !shouldAllowJoiningToCommon) {
      closeJoinModal();
    }
  }, [showJoinModal, shouldAllowJoiningToCommon, closeJoinModal]);

  if (
    !common ||
    !governance ||
    !isParentCommonFetched ||
    !areSubCommonsFetched
  ) {
    return isCommonFetched && isParentCommonFetched && areSubCommonsFetched ? (
      <NotFound />
    ) : (
      <Loader />
    );
  }

  return (
    <>
      {isShowing && (
        <Modal
          isShowing={isShowing}
          onClose={closeModalHandler}
          mobileFullScreen
          className={classNames(tab, {
            "mobile-full-screen": isMobileView,
          })}
          isHeaderSticky
          shouldShowHeaderShadow={false}
          styles={{
            headerWrapper:
              "common-detail-container__detail-modal-header-wrapper",
            header: "common-detail-container__detail-modal-header",
            closeWrapper: "common-detail-container__detail-modal-close-wrapper",
            content: "common-detail-container__detail-modal-content",
          }}
        >
          <DiscussionDetailModal
            discussion={currentDiscussion}
            userDiscussions={userDiscussions}
            common={common}
            onOpenJoinModal={openJoinModal}
            commonMember={commonMember}
            isCommonMemberFetched={isCommonMemberFetched}
            isJoiningPending={isJoiningPending}
            governance={governance}
          />
        </Modal>
      )}
      {showJoinModal && (
        <MembershipRequestModal
          isShowing={showJoinModal}
          onClose={closeJoinModal}
          common={common}
          governance={governance}
          onCreationStageReach={setIsCreationStageReached}
        />
      )}
      {isShowingNewD && (
        <AddDiscussionComponent
          isShowing={isShowingNewD}
          onClose={onCloseNewD}
          onSuccess={(discussion: Discussion) => {
            onCloseNewD();
            getDisscussionDetail(discussion);
          }}
          uid={user?.uid!}
          commonId={common.id}
          governanceId={governance.id}
          userCircleIds={
            commonMember ? Object.values(commonMember.circles.map) : []
          }
        />
      )}
      {isShowingNewP && commonMember && (
        <CreateProposalModal
          isShowing={isShowingNewP}
          onClose={handleProposalCreationModalClose}
          common={common}
          governance={governance}
          commonMember={commonMember}
          activeProposalsExist={activeProposals.length > 0}
          redirectToProposal={getProposalDetail}
          initialProposalType={initialProposalTypeForCreation}
        />
      )}
      <div className="common-detail-wrapper">
        {!isCommonMemberFetched && <GlobalLoader />}
        <div className="main-information-block">
          <div className="main-information-wrapper">
            <div className="content-element img-wrapper">
              {!imageError ? (
                <img
                  src={common?.image}
                  alt={common?.name}
                  onError={() => setImageError(true)}
                />
              ) : (
                <img
                  className="default-image"
                  src="/icons/logo-white.svg"
                  alt={common.name}
                />
              )}
            </div>
            <div className="content-element text-information-wrapper">
              <div className="text">
                <div className="text-information-wrapper__info-wrapper">
                  <div className="name">
                    {common?.name}
                    {isMobileView && (
                      <div className="text-information-wrapper__menu-buttons">
                        {isCommonMember ? (
                          <div className="text-information-wrapper__connected-user-avatar-wrapper">
                            <UserAvatar
                              className="text-information-wrapper__user-avatar"
                              photoURL={user?.photoURL}
                              nameForRandomAvatar={user?.email}
                              userName={getUserName(user)}
                            />
                            <PurpleCheckIcon className="text-information-wrapper__connected-user-avatar-icon" />
                          </div>
                        ) : (
                          <CommonShare
                            common={common}
                            type={ShareViewType.ModalMobile}
                            color={Colors.lightGray4}
                          />
                        )}
                        {isCommonMember && (
                          <CommonMenu
                            className="common-detail-wrapper__common-menu"
                            menuButtonClassName="common-detail-wrapper__menu-button--small"
                            common={common}
                            governance={governance}
                            subCommons={subCommons}
                            isSubCommon={isSubCommon}
                            currentCommonMember={commonMember}
                            onSubCommonCreate={addSubCommon}
                            onCommonDelete={handleCommonDelete}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="tagline">
                    {commonSubtitle || common.byline}
                  </div>
                </div>
              </div>
              <div className="numbers">
                <div className="item">
                  <div className="value">{formatPrice(common?.balance)}</div>
                  <div className="name">{`Available ${
                    screenSize === ScreenSize.Desktop ? "Funds" : ""
                  }`}</div>
                  {Boolean(common.reservedBalance) && (
                    <div className="text-information-wrapper__secondary-text">
                      In process: {formatPrice(common.reservedBalance)}
                    </div>
                  )}
                </div>
                <div className="item">
                  <div className="value">{formatPrice(common?.raised)}</div>
                  <div className="name">{`${
                    screenSize === ScreenSize.Desktop ? "Total" : ""
                  } Raised`}</div>
                </div>
                <div className="item">
                  <div className="value">{common.memberCount}</div>
                  <div className="name">Members</div>
                </div>
                <div className="item">
                  <div className="value">{activeProposals.length}</div>
                  <div className="name">{`${
                    screenSize === ScreenSize.Desktop ? "Active" : ""
                  } Proposals`}</div>
                </div>
              </div>
            </div>
            <div className="common-content-selector">
              <div className={`content-element tabs-container ${footerClass}`}>
                <div className="tabs-wrapper">
                  {tabs.map((t) => (
                    <div
                      key={t.key}
                      className={`tab-item ${tab === t.key ? "active" : ""}`}
                      onClick={() => changeTabHandler(t.key)}
                    >
                      <img
                        src={`/icons/common-icons/${t.icon}${
                          tab === t.key ? "-active" : ""
                        }.svg`}
                        alt={t.name}
                      />
                      {t.name}
                    </div>
                  ))}
                </div>
                <div className="social-wrapper" ref={setJoinEffortRef}>
                  {!isCommonMember && !isSubCommon && (
                    <button
                      className={`button-blue join-the-effort-btn`}
                      onClick={handleOpen}
                      disabled={isJoiningPending}
                    >
                      {isJoiningPending
                        ? "Pending approval"
                        : "Join the effort"}
                    </button>
                  )}

                  {isCommonMember && screenSize === ScreenSize.Desktop && (
                    <div className="member-label">
                      <CheckIcon className="member-label__icon" />
                      You are a member
                    </div>
                  )}

                  {screenSize === ScreenSize.Desktop && (
                    <CommonShare
                      shareButtonClassName="common-detail-wrapper__menu-button--big"
                      common={common}
                      type={ShareViewType.ModalDesktop}
                      color={Colors.lightGray4}
                      withBorder
                    />
                  )}
                  {!isMobileView && isCommonMember && (
                    <CommonMenu
                      className="common-detail-wrapper__common-menu"
                      menuButtonClassName="common-detail-wrapper__menu-button--big"
                      common={common}
                      governance={governance}
                      subCommons={subCommons}
                      isSubCommon={isSubCommon}
                      currentCommonMember={commonMember}
                      withBorder
                      onSubCommonCreate={addSubCommon}
                      onCommonDelete={handleCommonDelete}
                    />
                  )}
                </div>
                {isCommonMember && isMobileView && (
                  <CommonShare
                    common={common}
                    type={ShareViewType.ModalMobile}
                    color={Colors.transparent}
                  >
                    <button className="button-blue common-content-selector__long-share-button">
                      <ShareIcon className="common-content-selector__share-icon" />
                      Share Common
                    </button>
                  </CommonShare>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className={classNames("main-content-container", {
            wallet: tab === Tabs.Wallet,
          })}
        >
          <div
            className={classNames(
              "content-element inner-main-content-wrapper",
              {
                wallet: tab === Tabs.Wallet,
              },
            )}
          >
            <div className="tab-content-wrapper">
              {tab === Tabs.About && (
                <AboutTabComponent
                  common={common}
                  unstructuredRules={governance.unstructuredRules}
                  screenSize={screenSize}
                  onOpenJoinModal={handleOpen}
                  isCommonMember={isCommonMember}
                  isJoiningPending={isJoiningPending}
                />
              )}
              {tab === Tabs.Discussions && (
                <DiscussionsComponent
                  onAddNewPost={addPost}
                  common={common}
                  governance={governance}
                  discussions={userDiscussions || []}
                  loadDiscussionDetail={getDisscussionDetail}
                  isCommonMember={isCommonMember}
                  isCommonMemberFetched={isCommonMemberFetched}
                  isJoiningPending={isJoiningPending}
                />
              )}

              {tab === Tabs.Proposals && (
                <ProposalsComponent
                  onAddNewProposal={addNewProposal}
                  common={common}
                  governance={governance}
                  currentTab={tab}
                  proposals={proposals}
                  loadProposalDetail={getProposalDetail}
                  commonMember={commonMember}
                  isCommonMemberFetched={isCommonMemberFetched}
                  isJoiningPending={isJoiningPending}
                />
              )}
              {tab === Tabs.Wallet && <WalletComponent common={common} />}
              {tab === Tabs.Members && <MembersComponent common={common} />}
            </div>
            {isMobileView && (
              <div
                className={`tabs-container bottom ${stickyClass} ${footerClass}`}
              >
                <div className="tabs-wrapper">
                  {tabs.map((t) => (
                    <div
                      key={t.key}
                      className={`tab-item ${tab === t.key ? "active" : ""}`}
                      onClick={() => changeTabHandler(t.key)}
                    >
                      <img
                        src={`/icons/common-icons/${t.icon}${
                          tab === t.key ? "-active" : ""
                        }.svg`}
                        alt={t.name}
                      />
                      {t.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {shouldShowStickyJoinEffortButton && (
              <>
                <button
                  className={`button-blue join-the-effort-btn ${stickyClass} ${footerClass}`}
                  onClick={handleOpen}
                >
                  Join the effort
                </button>
              </>
            )}
            {(screenSize === ScreenSize.Desktop || tab !== Tabs.About) &&
              tab !== Tabs.Wallet && (
                <div className="sidebar-wrapper">{renderSidebarContent()}</div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
