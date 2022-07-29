import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Tabs, Tab, TabPanel } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { ModalProps } from "@/shared/interfaces";
import { getScreenSize } from "@/shared/store/selectors";
import { VotesModalTab } from "./constants";
import "./index.scss";

interface VotesModalProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  a?: number;
}

const VotesModal: FC<VotesModalProps> = (props) => {
  const { isShowing, onClose } = props;
  const [tab, setTab] = useState<VotesModalTab>(VotesModalTab.All);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleTabChange = (value: unknown) => {
    setTab(value as VotesModalTab);
  };

  return (
    <Modal
      className="proposal-page-votes-modal"
      isShowing={isShowing}
      title={<h3 className="proposal-page-votes-modal__title">Votes</h3>}
      onClose={onClose}
      onGoBack={isMobileView ? onClose : undefined}
      closePrompt={false}
      hideCloseButton={isMobileView}
      mobileFullScreen
      fullHeight
      styles={{
        content: "proposal-page-votes-modal__content-wrapper",
        headerWrapper: "proposal-page-votes-modal__header-wrapper",
      }}
    >
      <div className="proposal-page-votes-modal__content">
        <Tabs
          className="proposal-page-votes-modal__tabs-wrapper"
          value={tab}
          onChange={handleTabChange}
        >
          <Tab
            className="proposal-page-votes-modal__tab"
            label="All (75)"
            value={VotesModalTab.All}
          />
          <Tab
            className="proposal-page-votes-modal__tab"
            label="Approved (42)"
            value={VotesModalTab.Approved}
          />
          <Tab
            className="proposal-page-votes-modal__tab"
            label="Abstained (17)"
            value={VotesModalTab.Abstained}
          />
          <Tab
            className="proposal-page-votes-modal__tab"
            label="Rejected (28)"
            value={VotesModalTab.Rejected}
          />
        </Tabs>
      </div>
    </Modal>
  );
};

export default VotesModal;
