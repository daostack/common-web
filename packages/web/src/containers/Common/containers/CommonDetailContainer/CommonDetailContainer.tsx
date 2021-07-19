import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Loader, Share } from "../../../../shared/components";
import { Modal } from "../../../../shared/components/Modal";
import { useModal, useViewPortHook } from "../../../../shared/hooks";
import { Discussion, Proposal } from "../../../../shared/models";
import { getScreenSize } from "../../../../shared/store/selectors";
import { formatPrice } from "../../../../shared/utils";
import {
  AboutTabComponent,
  PreviewInformationList,
  DiscussionsComponent,
  DiscussionDetailModal,
  ProposalsComponent,
  ProposalsHistory,
  AboutSidebarComponent,
  JoinTheEffortModal,
} from "../../components/CommonDetailContainer";
import { ProposalDetailModal } from "../../components/CommonDetailContainer/ProposalDetailModal";
import "./index.scss";
import { Colors, ScreenSize } from "../../../../shared/constants";
import { MobileLinks } from "../../../../shared/components/MobileLinks";
import { useGetCommonProposals, useGetCommonDiscussions, useGetCommonById } from "../../../../graphql";
interface CommonDetailRouterParams {
  id: string;
}

const tabs = [
  {
    name: "Agenda",
    key: "about",
  },
  {
    name: "Discussions",
    key: "discussions",
  },
  {
    name: "Proposals",
    key: "proposals",
  },
  {
    name: "History",
    key: "history",
  },
];

export default function CommonDetail() {
  const { id } = useParams<CommonDetailRouterParams>();
  const joinEffort = useRef(null);
  // const contentBottom = useRef(null);
  const inViewport = useViewPortHook(joinEffort.current, "-20px");
  const inViewPortFooter = useViewPortHook(document.querySelector(".copyrights"), "0px");
  const [stickyClass, setStickyClass] = useState("");
  const [footerClass, setFooterClass] = useState("");
  const [tab, setTab] = useState("about");
  const [imageError, setImageError] = useState(false);

  const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null);
  const [currentDisscussion, setCurrentDisscussion] = useState<Discussion | null>(null);

  const screenSize = useSelector(getScreenSize());

  const { isShowing, onOpen, onClose } = useModal(false);
  const { isShowing: showJoinModal, onOpen: onOpenJoinModal, onClose: onCloseJoinModal } = useModal(false);

  const { data: proposalsData } = useGetCommonProposals({
    variables: {
      where: {
        commonId: id,
      },
    },
  });

  const { data: discussionsData } = useGetCommonDiscussions({
    variables: {
      where: {
        commonId: id,
      },
    },
  });

  const { data: commonData } = useGetCommonById({
    variables: {
      where: {
        id,
      },
    },
  });

  const common = commonData?.common;

  const activeProposals = useMemo(() => [...(proposalsData?.proposals || [])].filter((d) => d.state === "countdown"), [
    proposalsData,
  ]);

  const historyProposals = useMemo(() => [...(proposalsData?.proposals || [])].filter((d) => d.state !== "countdown"), [
    proposalsData,
  ]);

  const getDisscussionDetail = useCallback(
    (payload: Discussion) => {
      setCurrentDisscussion(payload);
      onOpen();
    },
    [onOpen],
  );

  const getProposalDetail = useCallback(
    (payload: Proposal) => {
      setCurrentProposal(payload);
      onOpen();
    },
    [onOpen],
  );

  const closeModalHandler = useCallback(() => {
    onClose();
    setCurrentDisscussion(null);
    setCurrentProposal(null);
  }, [onClose]);

  const clickPreviewDisscusionHandler = useCallback(
    (id: string) => {
      setTab("discussions");
      if (discussionsData?.discussions) {
        const disscussion = discussionsData?.discussions.find((f) => f.id === id);
        if (disscussion) {
          getDisscussionDetail(disscussion);
        }
      }
    },
    [discussionsData, getDisscussionDetail],
  );

  const clickPreviewProposalHandler = useCallback(
    (id: string) => {
      if (proposalsData?.proposals) {
        setTab("proposals");
        const proposal = proposalsData?.proposals.find((f) => f.id === id);
        if (proposal) {
          getProposalDetail(proposal);
        }
      }
    },
    [proposalsData, getProposalDetail],
  );

  const openJoinModal = useCallback(() => {
    onClose();
    setTimeout(onOpenJoinModal, 0);
  }, [onOpenJoinModal, onClose]);

  const closeJoinModal = useCallback(() => {
    onCloseJoinModal();
    if (currentDisscussion || currentProposal) {
      setTimeout(onOpen, 0);
    }
  }, [onOpen, currentProposal, currentDisscussion, onCloseJoinModal]);

  const renderSidebarContent = () => {
    if (!common) return null;
    switch (tab) {
      case "about":
        return (
          <>
            <PreviewInformationList
              title="Latest Discussions"
              discussions={discussionsData?.discussions || []}
              vievAllHandler={() => setTab("discussions")}
              onClickItem={clickPreviewDisscusionHandler}
              type="discussions"
            />
            <PreviewInformationList
              title="Latest Proposals"
              proposals={activeProposals}
              vievAllHandler={() => setTab("proposals")}
              onClickItem={clickPreviewProposalHandler}
              type="proposals"
            />
          </>
        );

      case "discussions":
        return (
          <>
            <AboutSidebarComponent title="About" vievAllHandler={() => setTab("about")} common={common} />
            <PreviewInformationList
              title="Latest Proposals"
              proposals={activeProposals}
              vievAllHandler={() => setTab("proposals")}
              onClickItem={clickPreviewProposalHandler}
              type="proposals"
            />
          </>
        );
      case "proposals":
        return (
          <>
            <AboutSidebarComponent title="About" vievAllHandler={() => setTab("about")} common={common} />
            <PreviewInformationList
              title="Latest Discussions"
              discussions={discussionsData?.discussions || []}
              vievAllHandler={() => setTab("discussions")}
              onClickItem={clickPreviewDisscusionHandler}
              type="discussions"
            />
          </>
        );
      case "history":
        return <ProposalsHistory proposals={historyProposals} common={common} />;
    }
  };

  useEffect(() => {
    if (inViewport) {
      setStickyClass("");
    } else {
      if (tab === "discussions" && discussionsData?.discussions?.length) {
        setStickyClass("sticky");
      } else if (tab === "proposals" && activeProposals.length) {
        setStickyClass("sticky");
      } else if (tab === "history" || tab === "about") {
        setStickyClass("sticky");
      }
    }
  }, [inViewport, activeProposals, tab, discussionsData, setStickyClass]);

  useEffect(() => {
    if (inViewPortFooter) {
      setFooterClass("footer-sticky");
    } else {
      setFooterClass("");
    }
  }, [inViewPortFooter, setFooterClass]);

  return !common ? (
    <Loader />
  ) : common ? (
    <>
      <Modal
        isShowing={isShowing}
        onClose={closeModalHandler}
        closeColor={screenSize === ScreenSize.Mobile ? Colors.white : Colors.gray}
        className={tab}
      >
        {screenSize === ScreenSize.Desktop && tab === "discussions" && (
          <DiscussionDetailModal disscussion={currentDisscussion} onOpenJoinModal={openJoinModal} />
        )}
        {screenSize === ScreenSize.Desktop && (tab === "proposals" || tab === "history") && (
          <ProposalDetailModal proposal={currentProposal} onOpenJoinModal={openJoinModal} />
        )}
        {screenSize === ScreenSize.Mobile && (
          <div className="get-common-app-wrapper">
            <img src="/icons/logo-all-white.svg" alt="logo" className="logo" />
            <span className="text">Download the Common app to participate in discussions and join the community</span>
            <MobileLinks color={Colors.black} detectOS={true} />
          </div>
        )}
      </Modal>
      <Modal isShowing={showJoinModal} onClose={closeJoinModal} closeColor={Colors.white} className="join-effort">
        <JoinTheEffortModal />
      </Modal>
      <div className="common-detail-wrapper">
        <div className="main-information-block">
          <div className="main-information-wrapper">
            <div className="content-element img-wrapper">
              {!imageError ? (
                <img src={common?.image} alt={common?.name} onError={() => setImageError(true)} />
              ) : (
                <img src="/icons/logo-white.svg" alt={common.name} />
              )}
            </div>
            <div className="content-element text-information-wrapper">
              <div className="text">
                <div>
                  <div className="name">{common?.name}</div>
                  <div className="tagline">{common?.byline}</div>
                </div>
                {screenSize === ScreenSize.Mobile && <Share type="modal" color={Colors.transparent} />}
              </div>
              <div className="numbers">
                <div className="item">
                  <div className="value">{formatPrice(common?.balance)}</div>
                  <div className="name">{`Available ${screenSize === ScreenSize.Desktop ? "Funds" : ""}`}</div>
                </div>
                <div className="item">
                  <div className="value">{formatPrice(common?.raised)}</div>
                  <div className="name">{`${screenSize === ScreenSize.Desktop ? "Total" : ""} Raised`}</div>
                </div>
                <div className="item">
                  <div className="value">{common?.members.length}</div>
                  <div className="name">Members</div>
                </div>
                <div className="item">
                  <div className="value">{activeProposals.length}</div>
                  <div className="name">{`${screenSize === ScreenSize.Desktop ? "Active" : ""} Proposals`}</div>
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
                      onClick={() => setTab(t.key)}
                    >
                      {t.name}
                    </div>
                  ))}
                </div>
                <div className="social-wrapper" ref={joinEffort}>
                  <button
                    className={`button-blue join-the-effort-btn ${stickyClass} ${footerClass}`}
                    onClick={onOpenJoinModal}
                  >
                    Join the effort
                  </button>
                  {screenSize === ScreenSize.Desktop && <Share type="popup" color={Colors.lightPurple} />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main-content-container">
          <div
            className={
              tab === "history"
                ? "content-element inner-main-content-wrapper history"
                : "content-element inner-main-content-wrapper"
            }
          >
            <div className="tab-content-wrapper">
              {tab === "about" && (
                <>
                  <div className="about-title">About</div>
                  <AboutTabComponent common={common} screenSize={screenSize} onOpenJoinModal={onOpenJoinModal} />
                </>
              )}
              {tab === "discussions" && (
                <DiscussionsComponent
                  discussions={discussionsData?.discussions || []}
                  loadDisscussionDetail={getDisscussionDetail}
                />
              )}

              {tab === "proposals" && (
                <ProposalsComponent
                  currentTab={tab}
                  proposals={activeProposals}
                  loadProposalDetail={getProposalDetail}
                />
              )}

              {tab === "history" && (
                <ProposalsComponent
                  currentTab={tab}
                  proposals={historyProposals}
                  loadProposalDetail={getProposalDetail}
                />
              )}
            </div>
            {(screenSize === ScreenSize.Desktop || tab !== "about") && (
              <div className="sidebar-wrapper">{renderSidebarContent()}</div>
            )}
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loader />
  );
}
