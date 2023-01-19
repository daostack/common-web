import React, { cloneElement, FC, isValidElement, ReactNode } from "react";
import { useModal } from "@/shared/hooks";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui-kit";
import { MobileModal, VoterList } from "./components";
import styles from "./Voters.module.scss";

interface VotersProps {
  triggerEl: ReactNode;
  proposalId: string;
  totalVotes: number;
  totalMembersWithVotingRight: number;
  isMobileVersion: boolean;
}

export const Voters: FC<VotersProps> = (props) => {
  const {
    triggerEl,
    proposalId,
    isMobileVersion,
    totalVotes,
    totalMembersWithVotingRight,
  } = props;
  const {
    isShowing: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useModal(false);
  const voterListEl = <VoterList proposalId={proposalId} />;

  if (isMobileVersion && isValidElement(triggerEl)) {
    const clonedTriggerEl = cloneElement(triggerEl, {
      ...triggerEl.props,
      onClick: (...args) => {
        onModalOpen();

        if (triggerEl.props.onClick) {
          triggerEl.props.onClick(...args);
        }
      },
    });

    return (
      <>
        {clonedTriggerEl}
        <MobileModal
          isOpen={isModalOpen}
          onClose={onModalClose}
          totalVotes={totalVotes}
          totalMembersWithVotingRight={totalMembersWithVotingRight}
        >
          {voterListEl}
        </MobileModal>
      </>
    );
  }

  const placement = isMobileVersion ? "bottom" : "bottom-start";

  return (
    <Popover placement={placement} fallbackStrategy="initialPlacement">
      <PopoverTrigger asChild>{triggerEl}</PopoverTrigger>
      <PopoverContent className={styles.popoverContent}>
        {voterListEl}
      </PopoverContent>
    </Popover>
  );
};
