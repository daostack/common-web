import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  containsHebrew,
  formatPrice,
  getCommonPagePath,
  getLastActivity,
} from "@/shared/utils";
import { Common } from "../../../../../shared/models";
import "./index.scss";

interface CommonListItemInterface {
  common: Common;
}

export default function CommonListItem({ common }: CommonListItemInterface) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="common-item">
      <Link to={getCommonPagePath(common.id)}>
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
            {common.byline && (
              <div
                lang={`${containsHebrew(common.name) ? "he" : "en"}`}
                className="description"
              >
                {common.byline}
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
            <div className="value">{common.memberCount}</div>
          </div>
        </div>
        <div className="relation-additional-information">
          <div className="item">
            <div className="value">
              <img
                src="/icons/common-icons/proposals.svg"
                alt="proposals-ico"
              />
              {common.proposalCount}
            </div>
          </div>
          <div className="item">
            <div className="value">
              <img src="/icons/common-icons/disc.svg" alt="disc-ico" />
              {common.discussionCount}
            </div>
          </div>
          <div className="item">
            <div className="value">
              <img src="/icons/common-icons/messages.svg" alt="messages-ico" />
              {common.messageCount}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
