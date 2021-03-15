import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { formatPrice } from "../../../../shared/utils";
import { getCommonDetail } from "../../store/actions";
import { selectCommonDetail } from "../../store/selectors";
import "./index.scss";
interface CommonDetailRouterParams {
  id: string;
}

export default function CommonDetail() {
  const { id } = useParams<CommonDetailRouterParams>();
  const common = useSelector(selectCommonDetail);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCommonDetail.request(id));
    return () => {
      dispatch(getCommonDetail.success(null));
    };
  }, [dispatch, id]);

  return (
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
              <div className="tab-item active">
                Agenda
                <span></span>
              </div>
              <div className="tab-item">Discussions</div>
              <div className="tab-item">Proposals</div>
              <div className="tab-item">History</div>
            </div>
            <div className="social-wrapper">
              <button className="button-blue">Join the effort</button>
            </div>
          </div>
        </div>
      </div>
      <pre>{JSON.stringify(common, null, 2)}</pre>
    </div>
  );
}
