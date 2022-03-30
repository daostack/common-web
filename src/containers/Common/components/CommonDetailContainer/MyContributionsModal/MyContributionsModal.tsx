import React, { useEffect, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { Loader, Modal } from "@/shared/components";
import { ModalProps } from "@/shared/interfaces";
import { Common, Payment } from "@/shared/models";
import { getUserContributionsToCommon } from "../../../store/actions";
import { General } from "./General";
import "./index.scss";

enum MyContributionsStage {
  General,
}

interface MyContributionsModalProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  common: Common;
}

const MyContributionsModal: FC<MyContributionsModalProps> = (props) => {
  const { isShowing, onClose, common } = props;
  const dispatch = useDispatch();
  const [stage, setStage] = useState<MyContributionsStage>(
    MyContributionsStage.General
  );
  const [
    isUserContributionsFetchStarted,
    setIsUserContributionsFetchStarted,
  ] = useState(false);
  const [userPayments, setUserPayments] = useState<Payment[] | null>(null);
  const user = useSelector(selectUser());
  const isLoading = !userPayments;

  useEffect(() => {
    if (!isShowing || isUserContributionsFetchStarted || !user?.uid) {
      return;
    }

    setIsUserContributionsFetchStarted(true);
    dispatch(
      getUserContributionsToCommon.request({
        payload: {
          userId: user.uid,
          commonId: common.id,
        },
        callback: (error, payments) => {
          if (error || !payments) {
            // Error screen
          } else {
            setUserPayments(payments);
          }
        },
      })
    );
  }, [
    dispatch,
    isShowing,
    isUserContributionsFetchStarted,
    user?.uid,
    common.id,
  ]);

  useEffect(() => {
    if (!isShowing) {
      setUserPayments(null);
      setIsUserContributionsFetchStarted(false);
    }
  }, [isShowing]);

  const renderContent = () => {
    switch (stage) {
      case MyContributionsStage.General:
        return userPayments ? <General payments={userPayments} /> : null;
      default:
        return null;
    }
  };

  return (
    <Modal
      className="my-contribution-modal"
      isShowing={isShowing}
      title={common.name}
      onClose={onClose}
      onGoBack={onClose}
      mobileFullScreen
    >
      <div className="my-contribution-modal__content">
        {isLoading ? <Loader /> : renderContent()}
      </div>
    </Modal>
  );
};

export default MyContributionsModal;
