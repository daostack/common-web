import React, {
  useCallback,
  useRef,
  useState,
  ReactElement,
  ReactNode,
} from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperClass from "swiper/types/swiper-class";
import { Button } from "@/shared/components";
import { ModalHeaderContent } from "@/shared/components/Modal";
import { ScreenSize } from "@/shared/constants";
import LeftArrowIcon from "@/shared/icons/leftArrow.icon";
import RightArrowIcon from "@/shared/icons/rightArrow.icon";
import {
  CommonContributionType,
  CommonLink,
  CommonRule,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice } from "@/shared/utils/shared";
import { Separator } from "../../Separator";
import { Progress } from "../Progress";
import { LinkList } from "./LinkList";
import { RuleList } from "./RuleList";
import { SelectFile } from "./SelectFile";
import "./index.scss";

interface ReviewProps {
  currentStep: number;
  onFinish: () => void;
}

export default function Review({
  currentStep,
  onFinish,
}: ReviewProps): ReactElement {
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const swiperRef = useRef<SwiperClass>();
  const [slideNumber, setSlideNumber] = useState(1);
  const defaultSliderImgs = [
    "/assets/images/review-bg-image.jpg",
    "/assets/images/review-bg-image.jpg",
  ];
  const coverImageTitle = "Select or upload cover image";
  const commonName = "Amazon Network";
  const tagline = "If you wanna save the Amazon, own it.";
  const minFeeToJoin = 1000;
  const formattedMinFeeToJoin = formatPrice(minFeeToJoin, {
    shouldRemovePrefixFromZero: false,
  });
  const contributionType: CommonContributionType =
    CommonContributionType.OneTime;
  const about =
    "We aim to ba a global non-profit initiative. Only small percentage of creative directors are women and we want to help change this through mentorship circles, portfolio reviews, talks & creative meetups.";
  const links: CommonLink[] = [
    { title: "Amazon Facebook group", value: "https://www.google.com" },
    { title: "LinkedIn", value: "https://www.linkedin.com" },
  ];
  const rules: CommonRule[] = [
    {
      title: "No promotions or spam",
      value:
        "We created this community to help you along your journey. Links to sponsored content or brands will vote you out.",
    },
    {
      title: "Be courteous and kind to others",
      value:
        "We're all in this together to create a nurturing environment. Let's teat everyone with respect. Healthy debates are natural, but kindness is required.",
    },
    {
      title: "Be courteous and kind to others",
      value:
        "We're all in this together to create a nurturing environment. Let's teat everyone with respect. Healthy debates are natural, but kindness is required.",
    },
  ];
  const handleSwiper = useCallback(
    (swiper: SwiperClass) => {
      swiperRef.current = swiper;
    },
    [swiperRef]
  );

  const handleContinueClick = useCallback(() => {
    onFinish();
  }, [onFinish]);

  const progressEl = <Progress creationStep={currentStep} />;

  const handlePrevSlide = () => {
    if (slideNumber > 1) {
      setSlideNumber((prevState) => prevState - 1);
      swiperRef.current?.slidePrev();
    }
  };
  const handleNextSlide = () => {
    if (slideNumber < defaultSliderImgs.length) {
      setSlideNumber((prevState) => prevState + 1);
      swiperRef.current?.slideNext();
    }
  };

  const getMinimumContributionText = (): ReactNode => {
    let text: ReactNode =
      "Members will be able to join the Common without a personal contribution";

    if (minFeeToJoin || contributionType !== CommonContributionType.OneTime) {
      text = (
        <>
          {formattedMinFeeToJoin}{" "}
          <span className="create-common-review__section-description--bold">
            {contributionType === CommonContributionType.OneTime
              ? "one-time"
              : "monthly"}
          </span>{" "}
          contribution
        </>
      );
    }

    return <p className="create-common-review__section-description">{text}</p>;
  };

  return (
    <>
      {!isMobileView && <ModalHeaderContent>{progressEl}</ModalHeaderContent>}
      <div className="create-common-review">
        {isMobileView && progressEl}
        <div className="create-common-review__slider">
          <Swiper
            navigation
            onSwiper={handleSwiper}
            allowTouchMove={isMobileView ? true : false}
          >
            {defaultSliderImgs.map((slide, index) => (
              <SwiperSlide key={index}>
                <figure className="create-common-review__slide">
                  <img
                    className="create-common-review__slide-img"
                    src={slide}
                    alt={slide}
                  />
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
          <SelectFile className="create-common-review__select-file" />
          <div className="create-common-review__title-and-arrows">
            <span onClick={handlePrevSlide}>
              <LeftArrowIcon
                className={
                  slideNumber > 1
                    ? "create-common-review__arrow-icon"
                    : "create-common-review__arrow-icon-disable"
                }
              />
            </span>
            <span className="create-common-review__cover-image-title">
              {coverImageTitle}
            </span>
            <span onClick={handleNextSlide}>
              <RightArrowIcon
                className={
                  slideNumber === defaultSliderImgs.length
                    ? "create-common-review__arrow-icon-disable"
                    : "create-common-review__arrow-icon"
                }
              />
            </span>
          </div>
        </div>
        <div className="create-common-review__main-info-wrapper">
          <div>
            <h4 className="create-common-review__common-name">{commonName}</h4>
            {tagline && (
              <p className="create-common-review__tagline">{tagline}</p>
            )}
          </div>
          <div className="create-common-review__price-wrapper">
            <span className="create-common-review__minimum-contribution">
              {formattedMinFeeToJoin}
            </span>
            <span className="create-common-review__minimum-contribution-text">
              Min. Contribution
            </span>
          </div>
        </div>
        {!isMobileView && (
          <Separator className="create-common-review__separator" />
        )}
        {about && (
          <div className="create-common-review__section">
            <h5 className="create-common-review__section-title">About</h5>
            <p className="create-common-review__section-description">{about}</p>
          </div>
        )}
        <div className="create-common-review__section">
          <h5 className="create-common-review__links-section-title">Links</h5>
          {links.length > 0 ? (
            <LinkList links={links} />
          ) : (
            <span className="create-common-review__empty-links-text">
              There are no links
            </span>
          )}
        </div>
        <RuleList rules={rules} className="create-common-review__rules" />
        <div className="create-common-review__contribution-container">
          <h5 className="create-common-review__section-title">
            Minimum Contribution
          </h5>
          {getMinimumContributionText()}
        </div>
        <div className="create-common-review__additional-info-container">
          <div className="create-common-review__additional-info-text">
            To publish the Common, add a personal contribution.{" "}
            <span className="create-common-review__additional-info-text--bold">
              Don’t worry, you will be able to make changes
            </span>{" "}
            to the Common info after it is published.
          </div>
        </div>
        <div className="create-common-review__submit-button-wrapper">
          <Button
            key="rules-continue"
            onClick={handleContinueClick}
            shouldUseFullWidth={isMobileView}
          >
            Personal Contribution
          </Button>
        </div>
      </div>
    </>
  );
}
