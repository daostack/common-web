import React, { useCallback, ReactElement } from "react";

import { isMobile } from "@/shared/utils";
import { ButtonLink } from "@/shared/components";
import { ModalFooter, ModalHeaderContent } from "@/shared/components/Modal";
import LinkIcon from "@/shared/icons/link.icon";
import { Separator } from "../../Separator";
import { Progress } from "../Progress";
import "./index.scss";

interface ReviewProps {
  currentStep: number;
  onFinish: () => void;
}

export default function Review({ currentStep, onFinish }: ReviewProps): ReactElement {
  const isMobileView = isMobile();
  const commonName = "Amazon Network";
  const tagline = "If you wanna save the Amazon, own it.";
  const minimumContribution = 10;
  const about = "We aim to ba a global non-profit initiative. Only small percentage of creative directors are women and we want to help change this through mentorship circles, portfolio reviews, talks & creative meetups.";
  const links = [
    { title: "Amazon Facebook group", link: "https://www.google.com" },
    { title: "LinkedIn", link: "https://www.linkedin.com" },
  ];

  const handleContinueClick = useCallback(() => {
    onFinish();
  }, [onFinish]);

  const progressEl = <Progress creationStep={currentStep} />;

  return (
    <>
      {!isMobileView && (
        <ModalHeaderContent>
          {progressEl}
        </ModalHeaderContent>
      )}
      <div className="create-common-review">
        {isMobileView && progressEl}
        <div className="create-common-review__main-info-wrapper">
          <div>
            <h4 className="create-common-review__common-name">{commonName}</h4>
            {tagline && <p className="create-common-review__tagline">{tagline}</p>}
          </div>
          <div className="create-common-review__price-wrapper">
            <span className="create-common-review__minimum-contribution">${minimumContribution}</span>
            <span className="create-common-review__minimum-contribution-text">Min. Contribution</span>
          </div>
        </div>
        <Separator className="create-common-review__separator" />
        {about && (
          <div className="create-common-review__section">
            <h5 className="create-common-review__section-title">About</h5>
            <p className="create-common-review__section-description">{about}</p>
          </div>
        )}
        <div className="create-common-review__section">
          <h5 className="create-common-review__section-title">Links</h5>
          {links.map((link, index) => (
            <ButtonLink
              key={index}
              className="create-common-review__link"
              href={link.link}
              target="_blank"
            >
              <LinkIcon className="create-common-review__link-icon" />{link.title}
            </ButtonLink>
          ))}
        </div>
        <ModalFooter sticky>
          <div className="create-common-review__modal-footer">
            <button
              key="rules-continue"
              className="button-blue"
              onClick={handleContinueClick}
            >
              Personal Contribution
            </button>
          </div>
        </ModalFooter>
      </div>
    </>
  );
}
