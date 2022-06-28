import React from "react";
import { useHistory } from "react-router";
import { ROUTE_PATHS } from "@/shared/constants";
import { useZoomDisabling } from "@/shared/hooks";
import {
  ContactUsSection,
  InfoSection,
} from "../../components/ContactUsContainer";
import "./index.scss";

const ContactUsContainer = () => {
  const history = useHistory();
  useZoomDisabling();

  const moveToHomePage = () => {
    history.push(ROUTE_PATHS.HOME);
  };

  return (
    <div className="contact-us">
      <div className="contact-us__content">
        <InfoSection onGoBack={moveToHomePage} />
        <ContactUsSection />
      </div>
    </div>
  );
};

export default ContactUsContainer;
