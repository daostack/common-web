import React, { FC } from "react";
import { ButtonLink } from "@/shared/components";
import LinkIcon from "@/shared/icons/link.icon";
import { Proposal } from "@/shared/models";

interface PitchContentContainerProps {
  proposal: Proposal;
}

export const PitchContentContainer: FC<PitchContentContainerProps> = ({
  proposal,
}) => {
  const descriptionParts = proposal.data.args.description.split("\n");

  return (
    <div className="pitch-content__wrapper">
      <div className="pitch-content__description-wrapper">
        <h3 className="pitch-content__description-title">Description</h3>
        {descriptionParts.map((text, index) =>
          text ? (
            <p className="pitch-content__description" key={index}>
              {text}
            </p>
          ) : (
            <br key={index} />
          ),
        )}
      </div>
      {proposal.data.args.links.length > 0 && (
        <ul className="pitch-content__links">
          {proposal.data.args.links.map((link) => (
            <li key={link.title} className="pitch-content__links-item">
              <ButtonLink
                className="pitch-content__links-item-button"
                href={link.value}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon className="pitch-content__links-item-icon" />
                {link.title}
              </ButtonLink>
            </li>
          ))}
        </ul>
      )}
      {proposal.data.args.images.length > 0 && (
        <ul className="pitch-content__images">
          {proposal.data.args.images.map((image) => (
            <li key={image.title} className="pitch-content__images-item">
              <img src={image.value} alt={image.title} />
              <span className="title">{image.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
