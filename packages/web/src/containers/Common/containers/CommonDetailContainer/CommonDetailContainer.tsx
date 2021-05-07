import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Loader } from "../../../../shared/components";
import { Modal } from "../../../../shared/components/Modal";
import { useModal } from "../../../../shared/hooks";
import { Discussion } from "../../../../shared/models";
import { getLoading } from "../../../../shared/store/selectors";
import { formatPrice } from "../../../../shared/utils";
import {
  AboutTabComponent,
  PreviewInformationList,
  DiscussionsComponent,
  DiscussionDetailModal,
} from "../../components/CommonDetailContainer";
import {
  clearCurrentDiscussion,
  closeCurrentCommon,
  getCommonDetail,
  loadCommonDiscussionList,
  loadDisscussionDetail,
} from "../../store/actions";
import {
  selectCommonDetail,
  selectProposals,
  selectDiscussions,
  selectIsDiscussionsLoaded,
  selectCurrentDisscussion,
} from "../../store/selectors";
import { useGetCommonProposals, useGetCommonDiscussions, useGetCommonById } from '../../../../graphql';

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
  const loading = useSelector(getLoading());
  // const common = useSelector(selectCommonDetail());
  const currentDisscussion = useSelector(selectCurrentDisscussion());
  const proposals = useSelector(selectProposals());
  const isDiscussionsLoaded = useSelector(selectIsDiscussionsLoaded());

  const {data} = useGetCommonProposals({variables: {
    where: {
      commonId: id
    },
  }});

  const {data: discussionsData} = useGetCommonDiscussions({variables: {
    where: {
      commonId: id
    },
  }})

  const {data: commonData, error} = useGetCommonById({variables: {
    where: {
      id,
    },
  }})

  const common = commonData?.common;
  console.log('proposals',data, discussionsData?.discussions, commonData);
  console.log('error',error)

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
      [...(discussionsData?.discussions || [])].splice(0, 5).map((d) => {
        return { id: d.id, value: d.title };
      }),
    [discussionsData?.discussions],
  );

  const changeTabHandler = useCallback(
    (tab: string) => {
      switch (tab) {
        case "discussions":
          if (!isDiscussionsLoaded) {
            dispatch(loadCommonDiscussionList.request());
          }
          break;

        default:
          break;
      }
      setTab(tab);
    },
    [dispatch, isDiscussionsLoaded],
  );

  const getDisscussionDetail = useCallback(
    (payload: Discussion) => {
      dispatch(loadDisscussionDetail.request(payload));
      onOpen();
    },
    [dispatch, onOpen],
  );

  const closeModalHandler = useCallback(() => {
    onClose();
    dispatch(clearCurrentDiscussion());
  }, [onClose, dispatch]);

  console.log('common',common)

  return loading && !common ? (
    <Loader />
  ) : (
    common && (
      <>
        <Modal isShowing={isShowing} onClose={closeModalHandler}>
          <DiscussionDetailModal disscussion={currentDisscussion} common={common} />
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
                    <DiscussionsComponent discussions={discussionsData?.discussions as any} loadDisscussionDetail={getDisscussionDetail} />
                  ) : (
                    <Loader />
                  ))}
              </div>
              <div className="sidebar-wrapper">
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
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
}
