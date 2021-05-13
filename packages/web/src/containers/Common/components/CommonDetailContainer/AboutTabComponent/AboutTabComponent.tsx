import React from "react";
import { formatPrice } from "../../../../../shared/utils";
import { Common } from "../../../../../graphql";
import "./index.scss";

interface AboutTabComponentProps {
  common: Common;
}

export default function AboutTabComponent({ common }: AboutTabComponentProps) {
  return (
    <div className="about-name-wrapper">
      <div className="description">{common.description}</div>
      {common?.links?.length > 0 && (
        <div className="links">
          <div className="title">Links</div>
          {common.links.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
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
          {formatPrice(common.fundingMinimumAmount) + " " + common.fundingType + " contribution"}
        </div>
        <div className="button-blue">Join the effort</div>
      </div>
    </div>
  );
}
