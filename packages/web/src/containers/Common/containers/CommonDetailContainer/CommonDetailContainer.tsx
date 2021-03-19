import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { formatPrice } from "../../../../shared/utils";
import { AboutTabComponent, PreviewInformationList } from "../../components/CommonDetailContainer";
import { getCommonDetail } from "../../store/actions";
import { selectCommonDetail, selectProposals, selectDiscussions } from "../../store/selectors";
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
  const common = useSelector(selectCommonDetail);
  const proposals = useSelector(selectProposals);
  const discussions = useSelector(selectDiscussions);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCommonDetail.request(id));
    return () => {
      dispatch(getCommonDetail.success(null));
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
        return { id: d.title, value: d.title };
      }),
    [discussions],
  );

  return (
    common && (
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
                <div className="item">
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
                    onClick={() => setTab(t.key)}
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
            <div className="tab-content-wrapper">{tab === "about" && <AboutTabComponent common={common} />}</div>
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
    )
  );
}
