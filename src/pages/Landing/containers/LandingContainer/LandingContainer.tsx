import React from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Language } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import { selectLanguage } from "@/shared/store/selectors";
import { JoinWaitlistModal } from "../../components/JoinWaitlistModal";
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
  const {
    isShowing: isWaitlistModalOpen,
    onOpen: onWaitlistModalOpen,
    onClose: onWaitlistModalClose,
  } = useModal(false);

  return (
    <div
      className={classNames("landing", {
        "hebrew-font": language === Language.Hebrew,
      })}
    >
      <VideoSection onLaunchClick={onWaitlistModalOpen} />
      <ImagineSection />
      <StructureInfoSection />
      {language !== Language.Hebrew && <CommonInfoSection />}
      <CollectiveActionSection onLaunchClick={onWaitlistModalOpen} />
      <JoinWaitlistModal
        isShowing={isWaitlistModalOpen}
        onClose={onWaitlistModalClose}
      />
    </div>
  );
};

export default LandingContainer;
