import React, { useMemo, FC } from "react";
import { ChangeMonthlyContribution } from "@/containers/Common/components/CommonDetailContainer/MyContributionsModal/ChangeMonthlyContribution";
import {
  MyContributionsContext,
  MyContributionsContextValue,
} from "@/containers/Common/components/CommonDetailContainer/MyContributionsModal/context";
import { Modal } from "@/shared/components";
import { Common, Subscription } from "@/shared/models";
import "./index.scss";

interface ChangeMonthlyContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  common: Common;
  subscription: Subscription;
}

const emptyFunction = () => {
  return;
};

const ChangeMonthlyContributionModal: FC<ChangeMonthlyContributionModalProps> = (
  props
) => {
  const { isOpen, onClose, common, subscription } = props;

  const contextValue = useMemo<MyContributionsContextValue>(
    () => ({
      setTitle: emptyFunction,
      setOnGoBack: emptyFunction,
      onError: emptyFunction,
      setShouldShowClosePrompt: emptyFunction,
    }),
    []
  );

  return (
    <Modal isShowing={isOpen} onClose={onClose}>
      <MyContributionsContext.Provider value={contextValue}>
        <ChangeMonthlyContribution
          currentSubscription={subscription}
          common={common}
          onFinish={() => {}}
          goBack={() => {}}
          styles={{
            amountSelection: {
              container:
                "billing-change-monthly-contribution__amount-selection-container",
            },
          }}
        />
      </MyContributionsContext.Provider>
    </Modal>
  );
};

export default ChangeMonthlyContributionModal;
