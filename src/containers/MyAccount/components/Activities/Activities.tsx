import React, { useEffect, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonListItem } from "../../../Common/components";
import { Common } from "@/shared/models";
import { getCommonsList } from "../../../Common/store/actions";
import {
  selectCommonList,
} from "../../../Common/store/selectors";
import { selectUser } from "../../../Auth/store/selectors";
import "./index.scss";

const Activities: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const commons = useSelector(selectCommonList());
  const [myCommons, setMyCommons] = useState<Common[]>([]);

  useEffect(() => {
    if (commons.length === 0)
        dispatch(getCommonsList.request());
  }, [dispatch, commons]);
  
  useEffect(() => {
    const myCommons = commons.filter((common) =>
      common.members.some((member) => member.userId === user?.uid)
    );

    setMyCommons(myCommons);
  }, [commons, user]);

  return (
    <div className="route-content my-account-activities">
      <header className="my-account-activities__header">
        <h2 className="route-title">Activities</h2>
        <div className="my-account-activities_summaries">
          <div className="my-account-activities_summaries-item">
            <div className="my-account-activities_summary-info">
              <span className="my-account-activities_summary-amount">
                {myCommons.length}
              </span>
              <span className="my-account-activities_summary-title">
                Commons
              </span>
            </div>
            <img
              className="my-account-activities_summary-icon"
              src="/assets/images/my-account-activities-commons-summary.svg"
              alt="Commons summary icon"
            />
          </div>
          <div className="my-account-activities_summaries-item">
            <div className="my-account-activities_summary-info">
              <span className="my-account-activities_summary-amount">
                3
              </span>
              <span className="my-account-activities_summary-title">
                Proposals
              </span>
            </div>
            <img
              className="my-account-activities_summary-icon"
              src="/assets/images/my-account-activities-proposals-summary.svg"
              alt="Proposals summary icon"
            />
          </div>
        </div>
      </header>
      <div className="my-account-activities_content-wrapper">
        <section className="my-account-activities_commons">
          <div className="my-account-activities_section-header">
            <h3>
              Commons ({myCommons.length})
            </h3>
            <span className="test">
              View all
            </span>
          </div>
          
          <div className="my-account-activities_section-list">
            {
              myCommons.map(
                common =>
                  <CommonListItem
                    common={common}
                    key={common.id}
                  />
              ).slice(0, 3)
            }
          </div>
        </section>
        <section className="my-account-activities_proposals">
          
        </section>
        <section className="my-account-activities_membership-requests">
          
        </section>
      </div>
    </div>
  );
}

export default Activities;
