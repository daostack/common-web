import React, { useEffect, useMemo, useState, FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ScreenSize, ROUTE_PATHS } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { getSharingURL } from "@/shared/utils";
import { Error } from "./Error";
import { Processing } from "./Processing";
import { Success } from "./Success";
import { ConfirmationStep } from "./constants";
import "./index.scss";

interface ConfirmationProps {
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  setTitle: (title: ReactNode) => void;
  onFinish: () => void;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const { setShouldShowCloseButton, setTitle, onFinish } = props;
  const [step, setStep] = useState(ConfirmationStep.Processing);
  const history = useHistory();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const commonId = "commonId";
  const commonPath = ROUTE_PATHS.COMMON_DETAIL.replace(":id", commonId);
  const sharingURL = getSharingURL(commonPath);

  const handleGoToCommon = () => {
    history.push(commonPath);
  };

  const title = useMemo((): ReactNode => {
    if (!isMobileView || step !== ConfirmationStep.Success) {
      return null;
    }

    return (
      <img
        className="create-common-confirmation__title-logo"
        src="/icons/logo.svg"
        alt="Common Logo"
      />
    );
  }, [isMobileView, step]);

  useEffect(() => {
    setShouldShowCloseButton(step !== ConfirmationStep.Processing);
  }, [setShouldShowCloseButton, step]);

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  const renderContent = () => {
    switch (step) {
      case ConfirmationStep.Processing:
        return <Processing />;
      case ConfirmationStep.Success:
        return (
          <Success sharingURL={sharingURL} onGoToCommon={handleGoToCommon} />
        );
      case ConfirmationStep.Error:
        return <Error onFinish={onFinish} />;
      default:
        return null;
    }
  };

  return renderContent();
};

export default Confirmation;
