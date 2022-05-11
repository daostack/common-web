import React, { useState } from "react";
import { Link } from "react-router-dom";

import { ROUTE_PATHS } from "../../../../../shared/constants";
import { Common } from "../../../../../shared/models";
import {
  containsHebrew,
  formatPrice,
  getLastActivity,
} from "../../../../../shared/utils";
import "./index.scss";

interface CommonListItemInterface {
  common: Common;
}

export default function CommonListItem({ common }: CommonListItemInterface) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="common-item">
      <Link to={`${ROUTE_PATHS.COMMON_LIST}/` + common.id}>
        <div className="image-wrapper">
          <div className="overlay"></div>
          {!imageError ? (
            <img
              src={common.image}
              alt={common.name}
              onError={() => setImageError(true)}
            />
          ) : (
            <img src="/icons/default-image.svg" alt={common.name} />
          )}
          <div className="common-information">
            <div
              lang={`${containsHebrew(common.name) ? "he" : "en"}`}
              className="name"
            >
              {common.name}
            </div>
            {common?.metadata.byline && (
              <div
                lang={`${containsHebrew(common.name) ? "he" : "en"}`}
                className="description"
              >
                {common?.metadata.byline}
              </div>
            )}
            <div className="last-activity">
              Active {getLastActivity(common)}
            </div>
          </div>
        </div>
        <div className="additional-information">
          <div className="item">
            <div className="title">Raised</div>
            <div className="value">{formatPrice(common.raised)}</div>
          </div>
          <div className="item">
            <div className="title">Available funds</div>
            <div className="value">{formatPrice(common.balance)}</div>
          </div>
          <div className="item">
            <div className="title">Members</div>
            <div className="value">{common.members.length}</div>
          </div>
        </div>
        <div className="relation-additional-information">
          <div className="item">
            <div className="value">
              <img
                src="/icons/common-icons/proposals.svg"
                alt="proposals-ico"
              />
              {common.proposals?.length}
            </div>
          </div>
          <div className="item">
            <div className="value">
              <img src="/icons/common-icons/disc.svg" alt="disc-ico" />
              {common.discussions?.length}
            </div>
          </div>
          <div className="item">
            <div className="value">
              <img src="/icons/common-icons/messages.svg" alt="messages-ico" />
              {common.messages?.length}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
