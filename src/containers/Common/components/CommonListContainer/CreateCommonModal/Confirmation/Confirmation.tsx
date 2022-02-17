import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectUser } from "@/containers/Auth/store/selectors";
import { ROUTE_PATHS, ScreenSize } from "@/shared/constants";
import { Common } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { getSharingURL } from "@/shared/utils";
import {
  getFileNameForUploading,
  uploadFile,
} from "@/shared/utils/firebaseUploadFile";
import {
  IntermediateCreateCommonPayload,
  PaymentPayload,
} from "../../../../interfaces";
import { createCommon } from "../../../../store/actions";
import { Error } from "./Error";
import { Processing } from "./Processing";
import { Success } from "./Success";
import { ConfirmationStep } from "./constants";
import "./index.scss";

interface ConfirmationProps {
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  setTitle: (title: ReactNode) => void;
  onFinish: () => void;
  creationData: IntermediateCreateCommonPayload;
  paymentData: PaymentPayload;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const {
    setShouldShowCloseButton,
    setTitle,
    onFinish,
    creationData,
    paymentData,
  } = props;
  const [step, setStep] = useState(ConfirmationStep.Processing);
  const [common, setCommon] = useState<Common | null>(null);
  const [error, setError] = useState("");
  const [isCommonCreationStarted, setIsCommonCreationStarted] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser());
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const commonPath = ROUTE_PATHS.COMMON_DETAIL.replace(":id", common?.id || "");
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
    if (isCommonCreationStarted || !user?.id) {
      return;
    }

    setIsCommonCreationStarted(true);

    (async () => {
      if (!creationData.image) {
        return;
      }

      let commonImageURL = "";

      try {
        commonImageURL =
          typeof creationData.image === "string"
            ? creationData.image
            : await uploadFile(
                getFileNameForUploading(creationData.image.name),
                "public_img",
                creationData.image
              );
      } catch (error) {
        console.error("Error during common image uploading");
        return;
      }

      dispatch(
        createCommon.request({
          payload: {
            userId: user.id,
            name: creationData.name,
            image: commonImageURL,
            byline: creationData.byline,
            description: creationData.description,
            contributionAmount: creationData.contributionAmount,
            contributionType: creationData.contributionType,
            rules: creationData.rules,
            links: creationData.links,
            zeroContribution: creationData.zeroContribution,
          },
          callback: (error, common) => {
            if (!common || error) {
              setError("An error occurred");
              return;
            }

            setCommon(common);
          },
        })
      );
    })();
  }, [isCommonCreationStarted, user, dispatch, creationData, paymentData]);

  useEffect(() => {
    if (step !== ConfirmationStep.Processing) {
      return;
    }

    setStep(error || !common ? ConfirmationStep.Error : ConfirmationStep.Success);
  }, [step, common, error]);

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
