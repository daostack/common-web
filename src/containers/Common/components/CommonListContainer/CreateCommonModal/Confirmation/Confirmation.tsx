import React, { useMemo, useState } from "react";
import { ConfirmationStep } from "./constants";
import { Processing } from "./Processing";
import { Success } from "./Success";
import { Error } from "./Error";

interface ConfirmationProps {
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  setLogoTitle: (shouldShowLogo: boolean) => void;
}

export default function Confirmation(props: ConfirmationProps) {
  const { setShouldShowCloseButton, setLogoTitle } = props;
  const [step, setStep] = useState(ConfirmationStep.Processing);

  const content = useMemo(() => {
    switch (step) {
      case ConfirmationStep.Processing:
        return (
          <Processing setShouldShowCloseButton={setShouldShowCloseButton} />
        );
      case ConfirmationStep.Success:
        return <Success setLogoTitle={setLogoTitle} />;
      case ConfirmationStep.Error:
        return <Error />;
      default:
        return null;
    }
  }, [step, setShouldShowCloseButton, setLogoTitle]);

  return content;
}
