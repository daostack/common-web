import React, { FC } from "react";
import { Proposal } from "@/shared/models";

interface PitchContentContainerProps {
  proposal: Proposal;
}

export const PitchContentContainer: FC<PitchContentContainerProps> = (
  {
    proposal,
  }
) => (
  <div className="pitch-content__wrapper">
    <p className="pitch-content__description">
      {proposal.data.args.description}
    </p>
    {
      proposal.data.args.links.length > 0 && <ul className="pitch-content__links">
        {
          proposal.data.args.links.map(
            link => (
              <li
                key={link.title}
                className="pitch-content__links-item"
              >
                <img
                  src="/icons/link.svg"
                  alt={link.title}
                />
                <a
                  href={link.value}
                  key={link.value}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.title}
                </a>
              </li>
            )
          )
        }
      </ul>
    }
    {
      proposal.data.args.images.length > 0 && <ul className="pitch-content__images">
        {
          proposal.data.args.images.map(
            image => (
              <li
                key={image.title}
                className="pitch-content__images-item"
              >
                <img
                  src={image.value}
                  alt={image.title}
                />
                <span className="title">{image.title}</span>
              </li>
            )
          )
        }
      </ul>
    }
  </div>
);
