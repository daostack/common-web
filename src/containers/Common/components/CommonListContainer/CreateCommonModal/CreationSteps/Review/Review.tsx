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
  const coverImageTitle = "Select or upload cover image"
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
        <div className="create-common-review__upload-cover-image">
          <label htmlFor="cover-image" className="create-common-review__input-bg-image-label">
            <img src="assets/images/create-common-review__add-bg-image.jpg"alt=""/></label>
          <input type="file" className="create-common-review__input-bg-image-input" id="cover-image" accept=".jpg, .jpeg, .png"/>
          <div className="create-common-review__title-and-arrows">
            <button className="create-common-review__arrow"><img
                src="assets/images/icons-general-left-arrow.svg" alt="arrow-to-left"/></button>
            <span className="create-common-review__upload-cover-image__title">{coverImageTitle}</span>
            <button className="create-common-review__arrow"><img
                src="assets/images/icons-general-right-arrow.svg" alt="arrow-to-right"/></button>
          </div>
        </div>
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
        <div className="create-common-review__rules">
          <div className="create-common-review__rule">
              <p className="create-common-review__rule-number">
            Rule #1
          </p>
            <h5 className="create-common-review__rule-title">
              No promotions or spam
            </h5>
            <p className="create-common-review__rule-description">
              We created this community to help you along your journey. Links to sponsored content or
              brands will vote you out.
            </p>
          </div>
          <div className="create-common-review__rule">
              <p className="create-common-review__rule-number">
            Rule #1
          </p>
            <h5 className="create-common-review__rule-title">
              Be courteous and kind to others
            </h5>
            <p className="create-common-review__rule-description">
              We're all in this together to create a nurturing enviroment. Let's teat everyone with resprct. Healthy debates are natural, but kindness is required.
            </p>
            <h5 className="create-common-review__rule__contribution-title">Minimum Contribution</h5>
            <p className="create-common-review__rule__contribution-description">
                $10 <span>one-time</span> contribution
            </p>
          </div>
          <div className="create-common-review__additional-info-container">
            <div className="create-common-review__additional-info-text">To publish the Common, add a personal contribution. <span>Don't worry, you will be able to make
            changes</span> to the Common info after it is published.
            </div>
          </div>
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
