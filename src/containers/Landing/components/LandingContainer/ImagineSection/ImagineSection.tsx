import React, { FC } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import peopleOnCubesImageSrc from "@/shared/assets/images/peolpe-on-cubes.svg";
import { selectIsRtlLanguage } from "@/shared/store/selectors";
import "./index.scss";

const ImagineSection: FC = () => {
  const isRtlLanguage = useSelector(selectIsRtlLanguage());
  const { t } = useTranslation("translation", {
    keyPrefix: "landing.imagineSection",
  });
  const descriptionPart4 = t("description.part4");
  const descriptionPart5 = t("description.part5");

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
        <div className="landing-imagine-section__info-wrapper">
          <h2 className="landing-imagine-section__title">{t("title")}</h2>
          <p className="landing-imagine-section__description">
            {t("description.part1")}
          </p>
          <p className="landing-imagine-section__description">
            {t("description.part2")}
          </p>
          <p className="landing-imagine-section__description">
            {t("description.part3")}
          </p>
          {descriptionPart4 && (
            <p className="landing-imagine-section__description">
              {descriptionPart4}
            </p>
          )}
          {descriptionPart5 && (
            <p className="landing-imagine-section__description">
              {t("description.part5")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImagineSection;
