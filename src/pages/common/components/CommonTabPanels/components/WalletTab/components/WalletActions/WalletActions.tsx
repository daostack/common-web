import React, { FC } from "react";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { WalletAction } from "../../constants";
import { NewContributionButton } from "../NewContributionButton";
import styles from "./WalletActions.module.scss";

interface WalletActionsProps {
  allowedActions?: WalletAction[];
  commonId: string;
}

const WalletActions: FC<WalletActionsProps> = (props) => {
  const { allowedActions = [], commonId } = props;
  const isMobileVersion = useIsTabletView();

  if (allowedActions.length === 0) {
    return null;
  }

  return (
    <div>
      <div className={styles.container}>
        {allowedActions.includes(WalletAction.NewContribution) && (
          <NewContributionButton
            isMobileVersion={isMobileVersion}
            commonId={commonId}
          />
        )}
      </div>
    </div>
  );
};

export default WalletActions;
