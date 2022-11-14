import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import classNames from "classnames";
import peopleOnCubesImageSrc from "@/shared/assets/images/peolpe-on-cubes.svg";
import { selectIsRtlLanguage } from "@/shared/store/selectors";
import "./index.scss";

interface Description {
  title: string;
  parts: string[];
}

const ImagineSection: FC = () => {
  const isRtlLanguage = useSelector(selectIsRtlLanguage());
  const { t } = useTranslation("translation", {
    keyPrefix: "landing.imagineSection",
  });
  const description1: Description = t("description1", {
    returnObjects: true,
    defaultValue: null,
  });
  const description2: Description = t("description2", {
    returnObjects: true,
    defaultValue: null,
  });
  const descriptions = [description1, description2].filter(Boolean);

  return (
    <section className="landing-imagine-section">
      <div
        className={classNames("landing-imagine-section__content", {
          "landing-imagine-section__content--rtl": isRtlLanguage,
        })}
      >
        <img
          className="landing-imagine-section__image"
          src={peopleOnCubesImageSrc}
          alt={t("imageAlt")}
        />
        <div>
          {descriptions.map((description, index) => (
            <div key={index} className="landing-imagine-section__info-wrapper">
              <h2 className="landing-imagine-section__title">
                {description.title}
              </h2>
              {description.parts.map((part, partIndex) => (
                <p
                  key={partIndex}
                  className="landing-imagine-section__description"
                >
                  {part}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImagineSection;
