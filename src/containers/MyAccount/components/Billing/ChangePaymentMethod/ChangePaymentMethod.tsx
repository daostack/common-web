import React, { useState, FC } from "react";
import { IFrame, Loader } from "@/shared/components";
import { ChangePaymentMethodState } from "@/shared/hooks/useCases";
import "./index.scss";

interface ChangePaymentMethodProps {
  data: ChangePaymentMethodState;
}

const ChangePaymentMethod: FC<ChangePaymentMethodProps> = (props) => {
  const { data } = props;
  const [isPaymentIframeLoaded, setIsPaymentIframeLoaded] = useState(false);

  const handleIframeLoad = () => {
    setIsPaymentIframeLoaded(true);
  };

  return (
    <div>
      {(data.isPaymentLoading || !data.payment || !isPaymentIframeLoaded) && (
        <Loader />
      )}
      {!data.isPaymentLoading && data.payment && (
        <IFrame
          src={data.payment.link}
          frameBorder="0"
          title="Payment Details"
          onLoad={handleIframeLoad}
        />
      )}
    </div>
  );
};

export default ChangePaymentMethod;
