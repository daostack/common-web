import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import classNames from "classnames";
import { Loader, NotFound, CommonShare, UserAvatar } from "@/shared/components";
import { Modal } from "@/shared/components/Modal";
import { useAuthorizedModal, useModal, useViewPortHook } from "@/shared/hooks";
import PurpleCheckIcon from "@/shared/icons/purpleCheck.icon";
import ShareIcon from "@/shared/icons/share.icon";
import {
  Discussion,
  DiscussionWithHighlightedMessage,
  Proposal,
  ProposalState,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice, getUserName } from "@/shared/utils";
import { LoginModalType } from "../../../Auth/interface";
import {
  AboutTabComponent,
  PreviewInformationList,
  DiscussionsComponent,
  DiscussionDetailModal,
  CommonMenu,
  ProposalsComponent,
  ProposalsHistory,
  AboutSidebarComponent,
  AddDiscussionComponent,
} from "../../components/CommonDetailContainer";
import { MembershipRequestModal } from "../../components/CommonDetailContainer/MembershipRequestModal";
import { ProposalDetailModal } from "../../components/CommonDetailContainer/ProposalDetailModal";
import {
  Colors,
  ScreenSize,
  ShareViewType,
  DynamicLinkType,
  ProposalsTypes,
  ROUTE_PATHS,
} from "@/shared/constants";
import {
  selectCommonDetail,
  selectCurrentDisscussion,
  selectCurrentProposal,
  selectDiscussions,
  selectGovernance,
  selectIsDiscussionsLoaded,
  selectIsProposalLoaded,
  selectProposals,
  selectCards,
  selectCommonActiveTab,
} from "../../store/selectors";
import {
  clearCurrentDiscussion,
  clearCurrentProposal,
  closeCurrentCommon,
  getCommonDetail,
  loadCommonDiscussionList,
  loadDisscussionDetail,
  loadProposalDetail,
  loadProposalList,
  createDiscussion,
  createFundingProposal,
  loadUserCards,
  setCommonActiveTab,
  clearCommonActiveTab,
} from "../../store/actions";
import CheckIcon from "../../../../shared/icons/check.icon";
import { selectUser } from "../../../Auth/store/selectors";
import {
  AddProposalComponent,
  AddProposalSteps,
  CreateFundsAllocationData,
} from "@/containers/Common/components/CommonDetailContainer/AddProposalComponent";
import { useCommonMember } from "../../hooks";
import "./index.scss";


interface CommonDetailRouterParams {
  id: string;
}

interface CommonDetailProps {
  commonId?: string;
  tab?: Tabs;
  activeModalElement?: Proposal | Discussion | DiscussionWithHighlightedMessage;
  linkType?: DynamicLinkType;
}

export enum Tabs {
  About = "about",
  Discussions = "discussions",
  Proposals = "proposals",
  History = "history",
}

const tabs = [
  {
    name: "Agenda",
    key: Tabs.About,
  },
  {
    name: "Discussions",
    key: Tabs.Discussions,
  },
  {
    name: "Proposals",
    key: Tabs.Proposals,
  },
  {
    name: "History",
    key: Tabs.History,
  },
];

export default function CommonDetail(props: CommonDetailProps = {}) {
  const { id: routeCommonId } = useParams<CommonDetailRouterParams>();
  const id = props.commonId || routeCommonId;

  const [joinEffortRef, setJoinEffortRef] = useState<HTMLDivElement | null>(
    null
  );
  const inViewport = useViewPortHook(joinEffortRef, "-50px");
  const inViewPortFooter = useViewPortHook(
    document.querySelector(".footer-wrapper"),
    "0px"
  );
  const [stickyClass, setStickyClass] = useState("");
  const [footerClass, setFooterClass] = useState("");
  const [tab, setTab] = useState(Tabs.About);
  const [imageError, setImageError] = useState(false);
  const [isCreationStageReached, setIsCreationStageReached] = useState(false);
  const [isCommonFetched, setIsCommonFetched] = useState(false);

  const common = useSelector(selectCommonDetail());
  const governance = useSelector(selectGovernance());
  const currentDisscussion = useSelector(selectCurrentDisscussion());
  const proposals = useSelector(selectProposals());
  const discussions = useSelector(selectDiscussions());
  const cards = useSelector(selectCards());
  const isDiscussionsLoaded = useSelector(selectIsDiscussionsLoaded());
  const isProposalsLoaded = useSelector(selectIsProposalLoaded());
  const currentProposal = useSelector(selectCurrentProposal());
  const screenSize = useSelector(getScreenSize());
  const user = useSelector(selectUser());
  const activeTab = useSelector(selectCommonActiveTab());
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember();

  const fundingProposals = useMemo(
    () =>
      proposals.filter(
        (proposal) => proposal.type === ProposalsTypes.FUNDS_ALLOCATION
      ),
    [proposals]
  );

  const activeProposals = useMemo(
    () => fundingProposals.filter((d) => d.state === ProposalState.COUNTDOWN),
    [fundingProposals]
  );

  const historyProposals = useMemo(
    () => fundingProposals.filter((d) => d.state !== ProposalState.COUNTDOWN),
    [fundingProposals]
  );

  const hasPaymentMethod = useMemo(() => !!cards && !!cards.length, [cards]);

  const isCommonMember = Boolean(commonMember);
  const isJoiningPending = proposals.some(
    (proposal) =>
      proposal.state === ProposalState.COUNTDOWN &&
      proposal.data.args.proposerId === user?.uid
  );
  const shouldAllowJoiningToCommon =
    !isCommonMember && (isCreationStageReached || !isJoiningPending);
  const shouldShowStickyJoinEffortButton =
    screenSize === ScreenSize.Mobile &&
    ((tab === Tabs.Discussions && discussions?.length > 0) ||
      (tab === Tabs.Proposals && activeProposals.length > 0) ||
      (tab === Tabs.History && historyProposals.length > 0)) &&
    !isCommonMember &&
    !isJoiningPending &&
    !inViewport &&
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
    isModalOpen: showJoinModal,
    onOpen: onOpenJoinModal,
    onClose: onCloseJoinModal,
  } = useAuthorizedModal();
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleOpen = useCallback(() => {
    onOpenJoinModal(LoginModalType.RequestToJoin);
  }, [onOpenJoinModal]);

  const changeTabHandler = useCallback(
    (tab: Tabs) => {
      switch (tab) {
        case Tabs.Discussions:
          if (!isDiscussionsLoaded) {
            dispatch(loadCommonDiscussionList.request());
          }
          break;
        case Tabs.History:
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
    [dispatch, isDiscussionsLoaded, isProposalsLoaded]
  );

  useEffect(() => {
    if (!activeTab || !isCommonFetched)
      return;

    changeTabHandler(activeTab);

    if (!props.commonId) {
      return (
        () => {
          dispatch(clearCommonActiveTab())
        }
      );
    }
  }, [
    dispatch,
    activeTab,
    props.commonId,
    changeTabHandler,
    isCommonFetched
  ]);

  useEffect(() => {
    dispatch(loadUserCards.request({ callback: () => true }));
    dispatch(
      getCommonDetail.request({
        payload: id,
        callback: () => {
          setIsCommonFetched(true);
        },
      })
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
      dispatch(loadDisscussionDetail.request(payload));
      onOpen();
    },
    [dispatch, onOpen]
  );

  const getProposalDetail = useCallback(
    (payload: Proposal) => {
      dispatch(loadProposalDetail.request(payload));
      onOpen();
    },
    [dispatch, onOpen]
  );

  useEffect(() => {
    if (!props.commonId)
      return;

    const {
      tab,
      activeModalElement,
      linkType
    } = props;

    if (
      !tab
      || !activeModalElement
      || !linkType
    ) return;

    setTab(tab);

    switch (linkType) {
      case DynamicLinkType.Proposal:
        getProposalDetail(activeModalElement as Proposal);
        break;
      case DynamicLinkType.Discussion:
        getDisscussionDetail(activeModalElement as Discussion);
        break;
      case DynamicLinkType.DiscussionMessage:
        getDisscussionDetail(activeModalElement as DiscussionWithHighlightedMessage);
        break;
    }
    // eslint-disable-next-line
  }, []);

  const closeModalHandler = useCallback(() => {
    onClose();
    dispatch(clearCurrentDiscussion());
    dispatch(clearCurrentProposal());

    if (props.commonId) {
      dispatch(setCommonActiveTab(tab));

      history.push(
        ROUTE_PATHS.COMMON_DETAIL.replace(":id", props.commonId)
      );
    } else {
      dispatch(loadCommonDiscussionList.request());
    }
  }, [
    onClose,
    dispatch,
    history,
    tab,
    props.commonId
  ]);

  const clickPreviewDisscusionHandler = useCallback(
    (id: string) => {
      changeTabHandler(Tabs.Discussions);
      const disscussion = discussions.find((f) => f.id === id);
      if (disscussion) {
        getDisscussionDetail(disscussion);
      }
    },
    [discussions, changeTabHandler, getDisscussionDetail]
  );

  const clickPreviewProposalHandler = useCallback(
    (id: string) => {
      changeTabHandler(Tabs.Proposals);
      const proposal = proposals.find((f) => f.id === id);
      if (proposal) {
        getProposalDetail(proposal);
      }
    },
    [proposals, changeTabHandler, getProposalDetail]
  );

  const addDiscussion = useCallback(
    (payload) => {
      dispatch(
        createDiscussion.request({
          payload: {
            ...payload,
            createTime: new Date(),
            lastMessage: new Date(),
            ownerId: user?.uid,
            commonId: common?.id,
          },
          callback: (discussion: Discussion) => {
            onCloseNewD();
            setTimeout(() => {
              getDisscussionDetail(discussion);
            }, 0);
          },
        })
      );
    },
    [dispatch, user, common, onCloseNewD, getDisscussionDetail]
  );

  const addProposal = useCallback(
    (
      payload: CreateFundsAllocationData,
      callback: (step: AddProposalSteps) => void
    ) => {
      dispatch(createFundingProposal.request({ payload, callback }));
    },
    [dispatch]
  );

  const openJoinModal = useCallback(() => {
    onClose();
    setTimeout(handleOpen, 0);
  }, [handleOpen, onClose]);

  const closeJoinModal = useCallback(() => {
    onCloseJoinModal();
    if (currentDisscussion || currentProposal) {
      setTimeout(onOpen, 0);
    }
  }, [onOpen, currentProposal, currentDisscussion, onCloseJoinModal]);

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
              discussions={discussions}
              vievAllHandler={() => changeTabHandler(Tabs.Discussions)}
              onClickItem={clickPreviewDisscusionHandler}
              type="discussions"
              isCommonMember={isCommonMember}
            />
            <PreviewInformationList
              title="Latest Proposals"
              proposals={activeProposals}
              vievAllHandler={() => changeTabHandler(Tabs.Proposals)}
              onClickItem={clickPreviewProposalHandler}
              type="proposals"
              isCommonMember={isCommonMember}
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
              isCommonMember={isCommonMember}
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
              discussions={discussions}
              vievAllHandler={() => changeTabHandler(Tabs.Discussions)}
              onClickItem={clickPreviewDisscusionHandler}
              type="discussions"
              isCommonMember={isCommonMember}
            />
          </>
        );
      case Tabs.History:
        return (
          <ProposalsHistory proposals={historyProposals} common={common} />
        );
    }
  };

  useEffect(() => {
    if (inViewport) {
      setStickyClass("");
    } else {
      if (joinEffortRef && joinEffortRef.offsetTop < window.scrollY) {
        if (tab === Tabs.Discussions && discussions?.length) {
          setStickyClass("sticky");
        } else if (tab === Tabs.Proposals && activeProposals.length) {
          setStickyClass("sticky");
        } else if (tab === Tabs.History || tab === Tabs.About) {
          setStickyClass("sticky");
        }
      }
    }
  }, [
    inViewport,
    activeProposals,
    tab,
    discussions,
    setStickyClass,
    joinEffortRef,
  ]);

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

  if (!common || !governance || !isCommonMemberFetched) {
    return isCommonFetched && isCommonMemberFetched ? <NotFound /> : <Loader />;
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
          {tab === Tabs.Discussions && (
            <DiscussionDetailModal
              disscussion={currentDisscussion}
              common={common}
              onOpenJoinModal={openJoinModal}
              isCommonMember={isCommonMember}
              isJoiningPending={isJoiningPending}
            />
          )}
          {(tab === Tabs.Proposals || tab === Tabs.History) && (
            <ProposalDetailModal
              proposal={currentProposal}
              common={common}
              onOpenJoinModal={openJoinModal}
              isCommonMember={isCommonMember}
              isJoiningPending={isJoiningPending}
            />
          )}
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
          onDiscussionAdd={addDiscussion}
        />
      )}
      {isShowingNewP && (
        <AddProposalComponent
          isShowing={isShowingNewP}
          onClose={onCloseNewP}
          onProposalAdd={addProposal}
          common={common}
          hasPaymentMethod={hasPaymentMethod}
          proposals={proposals}
          getProposalDetail={getProposalDetail}
        />
      )}
      <div className="common-detail-wrapper">
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
                            currentCommonMember={commonMember}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="tagline">{common.byline}</div>
                </div>
              </div>
              <div className="numbers">
                <div className="item">
                  <div className="value">{formatPrice(common?.balance)}</div>
                  <div className="name">{`Available ${screenSize === ScreenSize.Desktop ? "Funds" : ""
                    }`}</div>
                  {Boolean(common.reservedBalance) && (
                    <div className="text-information-wrapper__secondary-text">
                      In process: {formatPrice(common.reservedBalance)}
                    </div>
                  )}
                </div>
                <div className="item">
                  <div className="value">{formatPrice(common?.raised)}</div>
                  <div className="name">{`${screenSize === ScreenSize.Desktop ? "Total" : ""
                    } Raised`}</div>
                </div>
                <div className="item">
                  <div className="value">{common.memberCount}</div>
                  <div className="name">Members</div>
                </div>
                <div className="item">
                  <div className="value">{activeProposals.length}</div>
                  <div className="name">{`${screenSize === ScreenSize.Desktop ? "Active" : ""
                    } Proposals`}</div>
                </div>
              </div>
            </div>
            <div className="common-content-selector">
              <div className="content-element tabs-container">
                <div className="tabs-wrapper">
                  {tabs.map((t) => (
                    <div
                      key={t.key}
                      className={`tab-item ${tab === t.key ? "active" : ""}`}
                      onClick={() => changeTabHandler(t.key)}
                    >
                      {t.name}
                    </div>
                  ))}
                </div>
                <div className="social-wrapper" ref={setJoinEffortRef}>
                  {!isCommonMember && (
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
                      currentCommonMember={commonMember}
                      withBorder
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
        <div className="main-content-container">
          <div
            className={
              tab === Tabs.History
                ? "content-element inner-main-content-wrapper history"
                : "content-element inner-main-content-wrapper"
            }
          >
            <div className="tab-content-wrapper">
              {tab === Tabs.About && (
                <>
                  <div className="about-title">About</div>
                  <AboutTabComponent
                    common={common}
                    screenSize={screenSize}
                    onOpenJoinModal={handleOpen}
                    isCommonMember={isCommonMember}
                    isJoiningPending={isJoiningPending}
                  />
                </>
              )}
              {tab === Tabs.Discussions && (
                <DiscussionsComponent
                  onAddNewPost={addPost}
                  common={common}
                  governance={governance}
                  discussions={discussions || []}
                  loadDisscussionDetail={getDisscussionDetail}
                  isCommonMember={isCommonMember}
                  isJoiningPending={isJoiningPending}
                />
              )}

              {tab === Tabs.Proposals && (
                <ProposalsComponent
                  onAddNewProposal={addNewProposal}
                  common={common}
                  governance={governance}
                  currentTab={tab}
                  proposals={activeProposals}
                  loadProposalDetail={getProposalDetail}
                  isCommonMember={isCommonMember}
                  isJoiningPending={isJoiningPending}
                />
              )}

              {tab === Tabs.History && (
                <ProposalsComponent
                  onAddNewProposal={addNewProposal}
                  common={common}
                  governance={governance}
                  currentTab={tab}
                  proposals={historyProposals}
                  loadProposalDetail={getProposalDetail}
                  isCommonMember={isCommonMember}
                  isJoiningPending={isJoiningPending}
                />
              )}
            </div>
            {shouldShowStickyJoinEffortButton && (
              <button
                className={`button-blue join-the-effort-btn ${stickyClass} ${footerClass}`}
                onClick={handleOpen}
              >
                Join the effort
              </button>
            )}
            {(screenSize === ScreenSize.Desktop || tab !== Tabs.About) && (
              <div className="sidebar-wrapper">{renderSidebarContent()}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
