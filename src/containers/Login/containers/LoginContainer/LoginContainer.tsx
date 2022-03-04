import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { UserDetails } from "../../components/LoginContainer/UserDetails";
import { Modal } from "../../../../shared/components";
import { Connect } from "../../components/LoginContainer/Connect";
import { PhoneAuth } from "../../components/LoginContainer/PhoneAuth";
import { AuthStage } from "../../components/LoginContainer/constants";
import { selectUser } from "../../../Auth/store/selectors";
import "./index.scss";

interface LoginContainerProps {
  closeModal: () => void;
  isShowing: boolean;
  onClose: () => void;
}

const LoginContainer = ({
  closeModal,
  isShowing,
  onClose,
}: LoginContainerProps) => {
  const [stage, setStage] = useState(AuthStage.AuthMethodSelect);

  const user = useSelector(selectUser());

  useEffect(() => {
    if (!isShowing) setStage(AuthStage.AuthMethodSelect);
  }, [isShowing]);

  const setPhoneAuthStage = () => {
    setStage(AuthStage.PhoneAuth);
  };

  const content = useMemo(() => {
    switch (stage) {
      case AuthStage.AuthMethodSelect:
        return user ? (
          <UserDetails user={user} closeModal={closeModal} />
        ) : (
          <Connect setPhoneAuthStage={setPhoneAuthStage} />
        );
      case AuthStage.PhoneAuth:
        return <PhoneAuth setStage={setStage} />;
      case AuthStage.CompleteAccountDetails:
      // return <UserDetails user={user} closeModal={closeModal} />;
      default:
        return null;
    }
  }, [stage, closeModal, user]);

  return (
    <Modal
      isShowing={isShowing}
      onClose={onClose}
      className="mobile-full-screen"
      mobileFullScreen
    >
      {content}
    </Modal>
  );
};

export default LoginContainer;
