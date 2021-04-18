import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Loader } from "../../../../shared/components";
import { Modal } from "../../../../shared/components/Modal";
import { useModal } from "../../../../shared/hooks";
import { Discussion, Proposal } from "../../../../shared/models";
import { getLoading } from "../../../../shared/store/selectors";
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

  const dispatch = useDispatch();
  const { isShowing, onOpen, onClose } = useModal(false);

  useEffect(() => {
    dispatch(getCommonDetail.request(id));
    return () => {
      dispatch(closeCurrentCommon());
    };
  }, [dispatch, id]);

  const lastestProposals = useMemo(
    () =>
      [...proposals].splice(0, 5).map((p) => {
        return { id: p.id, value: p.description.title };
      }),
    [proposals],
  );
  const latestDiscussions = useMemo(
    () =>
      [...discussions].splice(0, 5).map((d) => {
        return { id: d.id, value: d.title };
      }),
    [discussions],
  );

  const activeProposals = useMemo(() => [...proposals].filter((d) => d.state === "countdown"), [proposals]);
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

  const renderSidebarContent = () => {
    if (!common) return null;
    switch (tab) {
      case "about":
        return (
          <>
            <PreviewInformationList
              title="Latest Discussions"
              data={latestDiscussions}
              vievAllHandler={() => setTab("discussions")}
            />
            <PreviewInformationList
              title="Latest Proposals"
              data={lastestProposals}
              vievAllHandler={() => setTab("proposals")}
            />
          </>
        );

      case "discussions":
        return (
          <>
            <AboutSidebarComponent title="About" vievAllHandler={() => setTab("about")} common={common} />
            <PreviewInformationList
              title="Latest Proposals"
              data={lastestProposals}
              vievAllHandler={() => setTab("proposals")}
            />
          </>
        );
      case "proposals":
        return (
          <>
            <AboutSidebarComponent title="About" vievAllHandler={() => setTab("about")} common={common} />
            <PreviewInformationList
              title="Latest Discussions"
              data={latestDiscussions}
              vievAllHandler={() => setTab("discussions")}
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
        <Modal isShowing={isShowing} onClose={closeModalHandler}>
          {tab === "discussions" && <DiscussionDetailModal disscussion={currentDisscussion} common={common} />}
          {tab === "proposals" && <ProposalDetailModal proposal={currentProposal} common={common} />}
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
                  <div className="name">{common?.name}</div>
                  <div className="tagline">{common?.metadata.byline}</div>
                </div>
                <div className="numbers">
                  <div className="item" onClick={onOpen}>
                    <div className="value">{formatPrice(common?.balance)}</div>
                    <div className="name">Available Funds</div>
                  </div>
                  <div className="item">
                    <div className="value">{formatPrice(common?.raised)}</div>
                    <div className="name">Total Raised</div>
                  </div>
                  <div className="item">
                    <div className="value">{common?.members.length}</div>
                    <div className="name">Members</div>
                  </div>
                  <div className="item">
                    <div className="value">0</div>
                    <div className="name">Active Proposals</div>
                  </div>
                </div>
              </div>
              <div className="line"></div>
              <div className="common-content-selector">
                <div className="tabs-wrapper">
                  {tabs.map((t) => (
                    <div
                      key={t.key}
                      className={`tab-item ${tab === t.key ? "active" : ""}`}
                      onClick={() => changeTabHandler(t.key)}
                    >
                      {t.name}
                      {tab === t.key && <span></span>}
                    </div>
                  ))}
                </div>
                <div className="social-wrapper">
                  <button className="button-blue">Join the effort</button>
                </div>
              </div>
            </div>
          </div>
          <div className="main-content-container">
            <div className="tab-title">{tab}</div>
            <div className="inner-main-content-wrapper">
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
