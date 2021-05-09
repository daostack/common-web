import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Loader, Share } from "../../../../shared/components";
import { Modal } from "../../../../shared/components/Modal";
import { useModal } from "../../../../shared/hooks";
import { Discussion, Proposal } from "../../../../shared/models";
import { getLoading, getScreenSize } from "../../../../shared/store/selectors";
import { formatPrice } from "../../../../shared/utils";

import {
  AboutTabComponent,
  PreviewInformationList,
  DiscussionsComponent,
  DiscussionDetailModal,
  ProposalsComponent,
  ProposalsHistory,
  AboutSidebarComponent,
} from "../../components/CommonDetailContainer";
import { ProposalDetailModal } from "../../components/CommonDetailContainer/ProposalDetailModal";
import {
  clearCurrentDiscussion,
  closeCurrentCommon,
  getCommonDetail,
  loadCommonDiscussionList,
  loadDisscussionDetail,
  loadProposalDetail,
  loadProposalList,
} from "../../store/actions";
import {
  selectCommonDetail,
  selectProposals,
  selectDiscussions,
  selectIsDiscussionsLoaded,
  selectCurrentDisscussion,
  selectIsProposalLoaded,
  selectCurrentProposal,
} from "../../store/selectors";
import "./index.scss";
import { Colors, ScreenSize } from "../../../../shared/constants";
import { MobileLinks } from "../../../../shared/components/MobileLinks";
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
  const [tab, setTab] = useState("about");
  const [imageError, setImageError] = useState(false);
  const loading = useSelector(getLoading());
  const common = useSelector(selectCommonDetail());
  const currentDisscussion = useSelector(selectCurrentDisscussion());
  const proposals = useSelector(selectProposals());
  const discussions = useSelector(selectDiscussions());
  const isDiscussionsLoaded = useSelector(selectIsDiscussionsLoaded());
  const isProposalsLoaded = useSelector(selectIsProposalLoaded());
  const currentProposal = useSelector(selectCurrentProposal());
  const screenSize = useSelector(getScreenSize());

  const dispatch = useDispatch();
  const { isShowing, onOpen, onClose } = useModal(false);

  useEffect(() => {
    dispatch(getCommonDetail.request(id));
    return () => {
      dispatch(closeCurrentCommon());
    };
  }, [dispatch, id]);

  const latestDiscussions = useMemo(
    () =>
      [...discussions].splice(0, 5).map((d) => {
        return { id: d.id, value: d.title };
      }),
    [discussions],
  );

  const activeProposals = useMemo(() => [...proposals].filter((d) => d.state === "countdown"), [proposals]);
  const lastestProposals = useMemo(
    () =>
      [...activeProposals].splice(0, 5).map((p) => {
        return { id: p.id, value: p.description.title || p.description.description };
      }),
    [activeProposals],
  );
  const historyProposals = useMemo(() => [...proposals].filter((d) => d.state !== "countdown"), [proposals]);

  const changeTabHandler = useCallback(
    (tab: string) => {
      switch (tab) {
        case "discussions":
          if (!isDiscussionsLoaded) {
            dispatch(loadCommonDiscussionList.request());
          }
          break;
        case "history":
        case "proposals":
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

  const getDisscussionDetail = useCallback(
    (payload: Discussion) => {
      dispatch(loadDisscussionDetail.request(payload));
      onOpen();
    },
    [dispatch, onOpen],
  );

  const getProposalDetail = useCallback(
    (payload: Proposal) => {
      dispatch(loadProposalDetail.request(payload));
      onOpen();
    },
    [dispatch, onOpen],
  );

  const closeModalHandler = useCallback(() => {
    onClose();
    dispatch(clearCurrentDiscussion());
  }, [onClose, dispatch]);

  const clickPreviewDisscusionHandler = useCallback(
    (id: string) => {
      changeTabHandler("discussions");
      const disscussion = discussions.find((f) => f.id === id);
      if (disscussion) {
        getDisscussionDetail(disscussion);
      }
    },
    [discussions, changeTabHandler, getDisscussionDetail],
  );

  const clickPreviewProposalHandler = useCallback(
    (id: string) => {
      changeTabHandler("proposals");
      const proposal = proposals.find((f) => f.id === id);
      if (proposal) {
        getProposalDetail(proposal);
      }
    },
    [proposals, changeTabHandler, getProposalDetail],
  );

  const renderSidebarContent = () => {
    if (!common) return null;
    switch (tab) {
      case "about":
        return (
          <>
            <PreviewInformationList
              title="Latest Discussions"
              data={latestDiscussions}
              vievAllHandler={() => changeTabHandler("discussions")}
              onClickItem={clickPreviewDisscusionHandler}
            />
            <PreviewInformationList
              title="Latest Proposals"
              data={lastestProposals}
              vievAllHandler={() => changeTabHandler("proposals")}
              onClickItem={clickPreviewProposalHandler}
            />
          </>
        );

      case "discussions":
        return (
          <>
            <AboutSidebarComponent title="About" vievAllHandler={() => changeTabHandler("about")} common={common} />
            <PreviewInformationList
              title="Latest Proposals"
              data={lastestProposals}
              vievAllHandler={() => changeTabHandler("proposals")}
              onClickItem={clickPreviewProposalHandler}
            />
          </>
        );
      case "proposals":
        return (
          <>
            <AboutSidebarComponent title="About" vievAllHandler={() => changeTabHandler("about")} common={common} />
            <PreviewInformationList
              title="Latest Discussions"
              data={latestDiscussions}
              vievAllHandler={() => changeTabHandler("discussions")}
              onClickItem={clickPreviewDisscusionHandler}
            />
          </>
        );
      case "history":
        return <ProposalsHistory proposals={historyProposals} common={common} />;
    }
  };

  return loading && !common ? (
    <Loader />
  ) : (
    common && (
      <>
        <Modal
          isShowing={isShowing}
          onClose={closeModalHandler}
          closeColor={screenSize === ScreenSize.Small ? Colors.white : Colors.gray}
        >
          {screenSize === ScreenSize.Large && tab === "discussions" && (
            <DiscussionDetailModal disscussion={currentDisscussion} common={common} />
          )}
          {tab === "proposals" ||
            (tab === "history" && screenSize === ScreenSize.Large && (
              <ProposalDetailModal proposal={currentProposal} common={common} />
            ))}
          {screenSize === ScreenSize.Small && (
            <div className="get-common-app-wrapper">
              <img src="/icons/logo-all-white.svg" alt="logo" className="logo" />
              <span className="text">Download the Common app to participate in discussions and join the community</span>
              <MobileLinks color={Colors.black} detectOS={true} />
            </div>
          )}
        </Modal>
        <div className="common-detail-wrapper">
          <div className="main-information-block">
            <div className="main-information-wrapper">
              <div className="img-wrapper">
                {!imageError ? (
                  <img src={common?.image} alt={common?.name} onError={() => setImageError(true)} />
                ) : (
                  <img src="/icons/logo-white.svg" alt={common.name} />
                )}
              </div>
              <div className="text-information-wrapper">
                <div className="text">
                  <div>
                    <div className="name">{common?.name}</div>
                    <div className="tagline">{common?.metadata.byline}</div>
                  </div>
                  {screenSize === ScreenSize.Small && <Share />}
                </div>
                <div className="numbers">
                  <div className="item" onClick={onOpen}>
                    <div className="value">{formatPrice(common?.balance)}</div>
                    <div className="name">{`Available ${screenSize === ScreenSize.Large ? "Funds" : ""}`}</div>
                  </div>
                  <div className="item">
                    <div className="value">{formatPrice(common?.raised)}</div>
                    <div className="name">{`${screenSize === ScreenSize.Large ? "Total" : ""} Raised`}</div>
                  </div>
                  <div className="item">
                    <div className="value">{common?.members.length}</div>
                    <div className="name">Members</div>
                  </div>
                  <div className="item">
                    <div className="value">{activeProposals.length}</div>
                    <div className="name">{`${screenSize === ScreenSize.Large ? "Active" : ""} Proposals`}</div>
                  </div>
                </div>
              </div>
              <div className="common-content-selector">
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
                <div className="social-wrapper">
                  <button className="button-blue">Join the effort</button>
                  {screenSize === ScreenSize.Large && <Share />}
                </div>
              </div>
            </div>
          </div>
          <div className="main-content-container">
            {tab === "about" ? <div className="tab-title">{tab}</div> : null}
            <div className={tab === "history" ? "inner-main-content-wrapper history" : "inner-main-content-wrapper"}>
              <div className="tab-content-wrapper">
                {tab === "about" && <AboutTabComponent common={common} />}
                {tab === "discussions" &&
                  (isDiscussionsLoaded ? (
                    <DiscussionsComponent discussions={discussions} loadDisscussionDetail={getDisscussionDetail} />
                  ) : (
                    <Loader />
                  ))}

                {tab === "proposals" &&
                  (isProposalsLoaded ? (
                    <ProposalsComponent
                      currentTab={tab}
                      proposals={activeProposals}
                      loadProposalDetail={getProposalDetail}
                    />
                  ) : (
                    <Loader />
                  ))}

                {tab === "history" &&
                  (isProposalsLoaded ? (
                    <ProposalsComponent
                      currentTab={tab}
                      proposals={historyProposals}
                      loadProposalDetail={getProposalDetail}
                    />
                  ) : (
                    <Loader />
                  ))}
              </div>
              <div className="sidebar-wrapper">{renderSidebarContent()}</div>
            </div>
          </div>
        </div>
      </>
    )
  );
}
