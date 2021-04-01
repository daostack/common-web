import React from "react";
import { Common } from "../../../../../shared/models";
import { formatPrice } from "../../../../../shared/utils";
import "./index.scss";

interface AboutTabComponentProps {
  common: Common;
}

export default function AboutTabComponent({ common }: AboutTabComponentProps) {
  return (
    <div className="about-name-wrapper">
      <div className="description">{common.metadata.description}</div>
      {common?.links?.length > 0 && (
        <div className="links">
          <div className="title">Links</div>
          {common.links.map((link) => (
            <a href={link.value} target="_blank" rel="noopener noreferrer">
              {link.title}
            </a>
          ))}
        </div>
      )}
      <div className="line"></div>
      <div className="join-wrapper">
        <div className="title">Join this Common</div>
        <div className="contribution">
          Minimum contribution for new members:
          <br />
          {formatPrice(common.metadata.minFeeToJoin) + " " + common.metadata.contributionType + " contribution"}
        </div>
        <div className="button-blue">Join the effort</div>
      </div>
    </div>
  );
}
