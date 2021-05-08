import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../../../../shared/constants";
import { Common } from "../../../../../shared/models";
import { formatPrice } from "../../../../../shared/utils";
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
          {!imageError ? (
            <img src={common.image} alt={common.name} onError={() => setImageError(true)} />
          ) : (
            <img src="/icons/default-image.svg" alt={common.name} />
          )}
          <div className="common-information">
            <div className="name"> {common.name}</div>
            {common.metadata?.byline && <div className="description">{common.metadata?.byline}</div>}
          </div>
        </div>
        <div className="additional-information">
          <div className="item">
            <div className="title">Raised</div>
            <div className="value">{formatPrice(common.raised)}</div>
          </div>
          <div className="item">
            <div className="title">Members</div>
            <div className="value">{common.members.length}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
