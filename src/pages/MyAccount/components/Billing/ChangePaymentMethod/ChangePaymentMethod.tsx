import React, { useState, FC } from "react";
import classNames from "classnames";
import { Button, ButtonVariant, IFrame, Loader } from "@/shared/components";
import { ChangePaymentMethodState } from "@/shared/hooks/useCases";
import "./index.scss";

interface ChangePaymentMethodProps {
  className?: string;
  data: ChangePaymentMethodState;
  onCancel?: () => void;
}

const ChangePaymentMethod: FC<ChangePaymentMethodProps> = (props) => {
  const { className, data, onCancel } = props;
  const [isPaymentIframeLoaded, setIsPaymentIframeLoaded] = useState(false);

  const handleIframeLoad = () => {
    setIsPaymentIframeLoaded(true);
  };

  return (
    <div className={classNames("billing-change-payment-method", className)}>
      {(data.isPaymentLoading || !data.payment || !isPaymentIframeLoaded) && (
        <div className="billing-change-payment-method__loader-wrapper">
          <Loader />
        </div>
      )}
      {!data.isPaymentLoading && data.payment && (
        <>
          <IFrame
            src={data.payment.link}
            frameBorder="0"
            title="Payment Details"
            onLoad={handleIframeLoad}
          />
          {onCancel && (
            <div className="billing-change-payment-method__button-wrapper">
              <Button
                onClick={onCancel}
                variant={ButtonVariant.Secondary}
                shouldUseFullWidth
              >
                Cancel
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChangePaymentMethod;
