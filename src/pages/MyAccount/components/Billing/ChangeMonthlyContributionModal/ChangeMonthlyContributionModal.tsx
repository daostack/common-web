import React, { useMemo, useState, FC } from "react";
import { ChangeMonthlyContribution } from "@/pages/OldCommon/components/CommonDetailContainer/MyContributionsModal/ChangeMonthlyContribution";
import {
  MyContributionsContext,
  MyContributionsContextValue,
} from "@/pages/OldCommon/components/CommonDetailContainer/MyContributionsModal/context";
import { Modal } from "@/shared/components";
import { Common, Subscription } from "@/shared/models";
import "./index.scss";

interface ChangeMonthlyContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  common: Common;
  subscription: Subscription;
  onFinish: (subscription: Subscription) => void;
}

const emptyFunction = () => {
  return;
};

const ChangeMonthlyContributionModal: FC<
  ChangeMonthlyContributionModalProps
> = (props) => {
  const { isOpen, onClose, common, subscription, onFinish } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingStateToggle = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  const contextValue = useMemo<MyContributionsContextValue>(
    () => ({
      setTitle: emptyFunction,
      setOnGoBack: emptyFunction,
      onError: emptyFunction,
      setShouldShowClosePrompt: emptyFunction,
    }),
    [],
  );

  return (
    <Modal
      isShowing={isOpen}
      onClose={onClose}
      mobileFullScreen
      closePrompt={isLoading}
    >
      <MyContributionsContext.Provider value={contextValue}>
        <ChangeMonthlyContribution
          currentSubscription={subscription}
          common={common}
          onFinish={onFinish}
          goBack={() => {}}
          onLoadingToggle={handleLoadingStateToggle}
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
