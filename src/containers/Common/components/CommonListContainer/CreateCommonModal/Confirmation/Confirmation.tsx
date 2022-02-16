import React, { useEffect, useMemo, useState, FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { Error } from "./Error";
import { Processing } from "./Processing";
import { Success } from "./Success";
import { ConfirmationStep } from "./constants";
import "./index.scss";

interface ConfirmationProps {
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  setTitle: (title: ReactNode) => void;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const { setShouldShowCloseButton, setTitle } = props;
  const [step, setStep] = useState(ConfirmationStep.Processing);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

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

  const content = useMemo(() => {
    switch (step) {
      case ConfirmationStep.Processing:
        return <Processing />;
      case ConfirmationStep.Success:
        return <Success />;
      case ConfirmationStep.Error:
        return <Error />;
      default:
        return null;
    }
  }, [step]);

  return content;
};

export default Confirmation;
