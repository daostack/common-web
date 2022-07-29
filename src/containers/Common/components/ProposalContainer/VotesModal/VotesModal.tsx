import React, { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useVotesWithUserInfo } from "@/containers/Common/hooks";
import { Loader, Modal, Tab, TabPanel, Tabs } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { ModalProps } from "@/shared/interfaces";
import { VoteOutcome, VoteWithUserInfo } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { VoteItem } from "./VoteItem";
import { VotesModalTab } from "./constants";
import "./index.scss";

interface VotesModalProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  proposalId: string;
}

const filterVotes = (
  votes: VoteWithUserInfo[],
  outcome: VoteOutcome
): VoteWithUserInfo[] => votes.filter((vote) => vote.outcome === outcome);

const VotesModal: FC<VotesModalProps> = (props) => {
  const { isShowing, onClose, proposalId } = props;
  const [tab, setTab] = useState<VotesModalTab>(VotesModalTab.All);
  const { loading, votes, fetchVotes } = useVotesWithUserInfo();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const approvedVotes = useMemo(
    () => filterVotes(votes, VoteOutcome.Approved),
    [votes]
  );
  const abstainedVotes = useMemo(
    () => filterVotes(votes, VoteOutcome.Abstained),
    [votes]
  );
  const rejectedVotes = useMemo(
    () => filterVotes(votes, VoteOutcome.Rejected),
    [votes]
  );

  const handleTabChange = (value: unknown) => {
    setTab(value as VotesModalTab);
  };

  useEffect(() => {
    fetchVotes(proposalId, true);
  }, [proposalId]);

  const renderVoteList = (data: VoteWithUserInfo[]) =>
    data.length > 0 ? (
      <ul className="proposal-page-votes-modal__vote-list">
        {data.map((item) => (
          <VoteItem key={item.id} vote={item} />
        ))}
      </ul>
    ) : (
      <p className="proposal-page-votes-modal__no-votes-text">
        There are no votes for selected outcome
      </p>
    );

  const renderContent = () => (
    <>
      <Tabs
        className="proposal-page-votes-modal__tabs-wrapper"
        value={tab}
        onChange={handleTabChange}
      >
        <Tab
          className="proposal-page-votes-modal__tab"
          label={`All (${votes.length})`}
          value={VotesModalTab.All}
        />
        <Tab
          className="proposal-page-votes-modal__tab"
          label={`Approved (${approvedVotes.length})`}
          value={VotesModalTab.Approved}
        />
        <Tab
          className="proposal-page-votes-modal__tab"
          label={`Abstained (${abstainedVotes.length})`}
          value={VotesModalTab.Abstained}
        />
        <Tab
          className="proposal-page-votes-modal__tab"
          label={`Rejected (${rejectedVotes.length})`}
          value={VotesModalTab.Rejected}
        />
      </Tabs>
      <div className="proposal-page-votes-modal__tab-panels-wrapper">
        <TabPanel value={tab} panelValue={VotesModalTab.All}>
          {renderVoteList(votes)}
        </TabPanel>
        <TabPanel value={tab} panelValue={VotesModalTab.Approved}>
          {renderVoteList(approvedVotes)}
        </TabPanel>
        <TabPanel value={tab} panelValue={VotesModalTab.Abstained}>
          {renderVoteList(abstainedVotes)}
        </TabPanel>
        <TabPanel value={tab} panelValue={VotesModalTab.Rejected}>
          {renderVoteList(rejectedVotes)}
        </TabPanel>
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
      isHeaderSticky
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
