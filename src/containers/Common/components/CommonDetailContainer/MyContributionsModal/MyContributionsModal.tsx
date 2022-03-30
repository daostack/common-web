import React, { FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectUser } from "@/containers/Auth/store/selectors";
import { Modal } from "@/shared/components";
import { ModalProps } from "@/shared/interfaces";
import { Common } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

interface MyContributionsModalProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  common: Common;
}

const MyContributionsModal: FC<MyContributionsModalProps> = (props) => {
  const { isShowing, onClose, common } = props;
  const screenSize = useSelector(getScreenSize());
  const user = useSelector(selectUser());

  return (
    <Modal
      className="my-contribution-modal"
      isShowing={isShowing}
      title={common.name}
      onClose={onClose}
      onGoBack={onClose}
      mobileFullScreen
    >
      <div className="my-contribution-modal__content">Content</div>
    </Modal>
  );
};

export default MyContributionsModal;
