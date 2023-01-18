import React, { FC, ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui-kit";
import { VoterList } from "./components";
import styles from "./Voters.module.scss";

interface VotersProps {
  triggerEl: ReactNode;
  proposalId: string;
  isMobileVersion: boolean;
}

export const Voters: FC<VotersProps> = (props) => {
  const { triggerEl, proposalId, isMobileVersion } = props;

  if (isMobileVersion) {
    return <>{triggerEl}</>;
  }

  return (
    <Popover placement="bottom-start" fallbackStrategy="initialPlacement">
      <PopoverTrigger asChild>{triggerEl}</PopoverTrigger>
      <PopoverContent className={styles.popoverContent}>
        <VoterList proposalId={proposalId} />
      </PopoverContent>
    </Popover>
  );
};
