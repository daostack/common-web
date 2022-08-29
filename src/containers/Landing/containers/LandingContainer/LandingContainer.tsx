import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Language, ROUTE_PATHS } from "@/shared/constants";
import { selectLanguage } from "@/shared/store/selectors";
import {
  CollectiveActionSection,
  CommonInfoSection,
  ImagineSection,
  StructureInfoSection,
  VideoSection,
} from "../../components/LandingContainer";
import "./index.scss";

const LandingContainer = () => {
  const language = useSelector(selectLanguage());
  const history = useHistory();

  const moveToContactUsPage = () => {
    history.push(ROUTE_PATHS.CONTACT_US);
  };

  return (
    <div className="landing">
      <VideoSection onLaunchClick={moveToContactUsPage} />
      <ImagineSection />
      <StructureInfoSection />
      {language !== Language.Hebrew && <CommonInfoSection />}
      <CollectiveActionSection onLaunchClick={moveToContactUsPage} />
    </div>
  );
};

export default LandingContainer;
