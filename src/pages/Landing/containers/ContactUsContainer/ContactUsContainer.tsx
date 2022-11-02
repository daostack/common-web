import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import classNames from "classnames";
import { ROUTE_PATHS } from "@/shared/constants";
import { useZoomDisabling } from "@/shared/hooks";
import { selectIsRtlLanguage } from "@/shared/store/selectors";
import {
  ContactUsSection,
  InfoSection,
} from "../../components/ContactUsContainer";
import "./index.scss";

const ContactUsContainer = () => {
  const history = useHistory();
  const isRtlLanguage = useSelector(selectIsRtlLanguage());
  useZoomDisabling();

  const moveToHomePage = () => {
    history.push(ROUTE_PATHS.HOME);
  };

  return (
    <div className="contact-us">
      <div
        className={classNames("contact-us__content", {
          "contact-us__content--rtl": isRtlLanguage,
        })}
      >
        <InfoSection onGoBack={moveToHomePage} />
        <ContactUsSection />
      </div>
    </div>
  );
};

export default ContactUsContainer;
