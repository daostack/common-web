import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Discussion,
  GetDiscussionById,
  useGetCommonById,
  useGetCommonDiscussions,
  useGetCommonProposals,
} from "../../../../graphql";
import { useApollo } from "../../../../hooks/useApollo";
import { Loader } from "../../../../shared/components";
import { Modal } from "../../../../shared/components/Modal";
import { useModal } from "../../../../shared/hooks";
import { formatPrice } from "../../../../shared/utils";
import {
  AboutTabComponent,
  DiscussionDetailModal,
  DiscussionsComponent,
  PreviewInformationList,
} from "../../components/CommonDetailContainer";
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
  const apolloClient = useApollo("http://localhost:4000/graphql");
  const [currentDiscussion, setCurrentDiscussion] = useState(null);

  const { data: proposalsData } = useGetCommonProposals({
    variables: {
      where: {
        commonId: id,
      },
    },
  });

  const { data: discussionsData, loading: isDiscussionsLoaded } = useGetCommonDiscussions({
    variables: {
      where: {
        commonId: id,
      },
    },
  });

  const { data: commonData, loading: isCommonLoading } = useGetCommonById({
    variables: {
      where: {
        id,
      },
    },
  });

  const common = commonData?.common;

  const { isShowing, onOpen, onClose } = useModal(false);

  const latestProposals = useMemo(
    () =>
      [...(proposalsData?.proposals || [])].splice(0, 5).map((p) => {
        return { id: p.id, value: p.title };
      }),
    [proposalsData],
  );

  const latestDiscussions = useMemo(
    () =>
      [...(discussionsData?.discussions || [])].splice(0, 5).map((d) => {
        return { id: d.id, value: d.title };
      }),
    [discussionsData],
  );

  const changeTabHandler = (tab: string) => setTab(tab);

  const getDiscussionDetail = useCallback(
    async (payload: Discussion) => {
      try {
        const { data } = await apolloClient.query({
          query: GetDiscussionById,
          variables: {
            id: payload.id,
          },
        });
        setCurrentDiscussion(data.discussion);
        onOpen();
      } catch (error) {
        onClose();
      }
    },
    [onOpen, apolloClient, onClose],
  );

  const closeModalHandler = useCallback(() => {
    onClose();
    setCurrentDiscussion(null);
  }, [onClose]);

  return isCommonLoading && !common ? (
    <Loader />
  ) : (
    <>
      {common && (
        <>
          <Modal isShowing={isShowing} onClose={closeModalHandler}>
            <DiscussionDetailModal discussion={currentDiscussion} common={common} />
          </Modal>
          <div className="common-detail-wrapper">
            <div className="main-information-block">
              <div className="main-information-wrapper">
                <div className="img-wrapper">
                  <img src={common?.image} alt={common?.name} />
                </div>
                <div className="text-information-wrapper">
                  <div className="text">
                    <div className="name">{common?.name}</div>
                    <div className="tagline">{common?.byline}</div>
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
                    (!isDiscussionsLoaded ? (
                      <DiscussionsComponent
                        discussions={discussionsData?.discussions as any}
                        loadDiscussionDetail={getDiscussionDetail}
                      />
                    ) : (
                      <Loader />
                    ))}
                </div>
                <div className="sidebar-wrapper">
                  <PreviewInformationList
                    title="Latest Discussions"
                    data={latestDiscussions}
                    viewAllHandler={() => setTab("discussions")}
                  />
                  <PreviewInformationList
                    title="Latest Proposals"
                    data={latestProposals}
                    viewAllHandler={() => setTab("proposals")}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
