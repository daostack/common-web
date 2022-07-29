import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useVotesWithUserInfo } from "@/containers/Common/hooks";
import { Loader, Modal, Tabs, Tab, TabPanel } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { ModalProps } from "@/shared/interfaces";
import { getScreenSize } from "@/shared/store/selectors";
import { VotesModalTab } from "./constants";
import "./index.scss";

interface VotesModalProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  proposalId: string;
}

const VotesModal: FC<VotesModalProps> = (props) => {
  const { isShowing, onClose, proposalId } = props;
  const [tab, setTab] = useState<VotesModalTab>(VotesModalTab.All);
  const { loading, votes, fetchVotes } = useVotesWithUserInfo();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleTabChange = (value: unknown) => {
    setTab(value as VotesModalTab);
  };

  useEffect(() => {
    fetchVotes(proposalId, true);
  }, [proposalId]);

  const renderContent = () => (
    <>
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
      <div className="proposal-page-votes-modal__tab-panels-wrapper">
        <TabPanel value={tab} panelValue={VotesModalTab.All}></TabPanel>
        <TabPanel value={tab} panelValue={VotesModalTab.Approved}></TabPanel>
        <TabPanel value={tab} panelValue={VotesModalTab.Abstained}></TabPanel>
        <TabPanel value={tab} panelValue={VotesModalTab.Rejected}></TabPanel>
      </div>
    </>
  );

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
        {!loading ? (
          renderContent()
        ) : (
          <div>
            <Loader />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default VotesModal;
