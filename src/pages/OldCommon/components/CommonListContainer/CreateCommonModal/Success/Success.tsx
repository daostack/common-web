import React, { useEffect, useMemo, FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Button, ButtonVariant, ShareModal } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import { Common } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import {
  StaticLinkType,
  commonTypeText,
  generateStaticShareLink,
  getCommonPagePath,
} from "@/shared/utils";
import "./index.scss";

interface SuccessProps {
  common: Common;
  isSubCommonCreation: boolean;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onGoToCommon?: (common: Common) => void;
}

const Success: FC<SuccessProps> = (props) => {
  const {
    common,
    isSubCommonCreation,
    setTitle,
    setGoBackHandler,
    setShouldShowCloseButton,
    onGoToCommon,
  } = props;
  const history = useHistory();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const {
    isShowing: isShareModalOpen,
    onOpen: onShareModalOpen,
    onClose: onShareModalClose,
  } = useModal(false);

  const handleGoToCommon = () => {
    if (onGoToCommon) {
      onGoToCommon(common);
      return;
    }

    const commonPath = getCommonPagePath(common.id);

    if (isSubCommonCreation) {
      window.location.href = commonPath;
    } else {
      history.push(commonPath);
    }
  };

  const title = useMemo(
    (): ReactNode =>
      isMobileView ? (
        <img
          className="create-common-confirmation-success__title-logo"
          src="/icons/logo.svg"
          alt="Common Logo"
        />
      ) : null,
    [isMobileView],
  );

  useEffect(() => {
    setGoBackHandler(null);
  }, [setGoBackHandler]);

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  useEffect(() => {
    setShouldShowCloseButton(true);
  }, [setShouldShowCloseButton]);

  return (
    <div className="create-common-confirmation-success">
      <img
        className="create-common-confirmation-success__image"
        src="/assets/images/illustrations-full-page-launch.svg"
        alt="Common Created"
      />
      <h2 className="create-common-confirmation-success__title">
        Your journey starts now
      </h2>
      <p className="create-common-confirmation-success__sub-title">
        Your {commonTypeText(isSubCommonCreation)} is ready. Spread the word and
        invite others to join you. You can always share it later.
      </p>
      <div className="create-common-confirmation-success__buttons">
        <Button
          key="create-common-confirmation-success-share-btn"
          className="create-common-confirmation-success__button"
          variant={
            isMobileView ? ButtonVariant.Primary : ButtonVariant.Secondary
          }
          shouldUseFullWidth
          onClick={onShareModalOpen}
        >
          Share now
        </Button>
        <Button
          key="create-common-confirmation-success-go-to-common-btn"
          className="create-common-confirmation-success__continue-button"
          variant={
            isMobileView ? ButtonVariant.Secondary : ButtonVariant.Primary
          }
          onClick={handleGoToCommon}
          shouldUseFullWidth
        >
          Go to {commonTypeText(isSubCommonCreation)}
        </Button>

        <ShareModal
          isShowing={isShareModalOpen}
          sourceUrl={generateStaticShareLink(StaticLinkType.Common, common)}
          onClose={onShareModalClose}
        />
      </div>
    </div>
  );
};

export default Success;
