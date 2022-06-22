import React from "react";
import { useHistory } from "react-router";
import { ROUTE_PATHS } from "@/shared/constants";
import {
  CollectiveActionSection,
  CommonInfoSection,
  ImagineSection,
  StructureInfoSection,
  VideoSection,
} from "../../components/LandingContainer";
import "./index.scss";

const LandingContainer = () => {
  const history = useHistory();

  const moveToContactUsPage = () => {
    history.push(ROUTE_PATHS.CONTACT_US);
  };

  return (
    <div className="landing">
      <VideoSection onLaunchClick={moveToContactUsPage} />
      <StructureInfoSection />
      <CommonInfoSection />
      <ImagineSection />
      <CollectiveActionSection onLaunchClick={moveToContactUsPage} />
    </div>
  );
};

export default LandingContainer;
