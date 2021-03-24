import React from "react";
import { Link } from "react-router-dom";
import { Common } from "../../../../../shared/models";
import { formatPrice } from "../../../../../shared/utils";
import "./index.scss";

interface CommonListItemInterface {
  common: Common;
}

export default function CommonListItem({ common }: CommonListItemInterface) {
  return (
    <div className="common-item">
      <Link to={`/commons/` + common.id}>
        <div className="image-wrapper">
          <img src={common.image} alt={common.name} />
          <div className="common-information">
            <div className="name"> {common.name}</div>
            {common.metadata?.description && <div className="description">{common.metadata?.description}</div>}
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
