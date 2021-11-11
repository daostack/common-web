import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from "react-redux";
import classNames from 'classnames';

import { Modal } from "../../../../../shared/components";
import { getScreenSize } from "../../../../../shared/store/selectors";
import { ScreenSize } from "../../../../../shared/constants";
import { Introduction } from "./Introduction";
import "./index.scss";

enum CreateCommonStages {
  Introduction,
}

interface CreateCommonModalProps {
  isShowing: boolean;
  onClose: () => void;
}

export default function CreateCommonModal(props: CreateCommonModalProps) {
  const [stage, setStage] = useState(CreateCommonStages.Introduction);
  const [title, setTitle] = useState('');
  const [isBigTitle, setIsBigTitle] = useState(true);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const setBigTitle = useCallback((title: string) => {
    setTitle(title);
    setIsBigTitle(true);
  }, []);
  const setSmallTitle = useCallback((title: string) => {
    setTitle(title);
    setIsBigTitle(false);
  }, []);

  const handleIntroductionFinish = useCallback(() => {
    setStage(stage => stage + 1);
  }, []);

  const content = useMemo(() => {
    switch (stage) {
      case CreateCommonStages.Introduction:
        return (
          <Introduction
            setTitle={isMobileView ? setSmallTitle : setBigTitle}
            onFinish={handleIntroductionFinish}
          />
        );
      default:
        return null;
    }
  }, [stage, isMobileView]);

  useEffect(() => {
    if (!props.isShowing) {
      setStage(CreateCommonStages.Introduction);
    }
  }, [props.isShowing]);

  return (
    <Modal
      isShowing={props.isShowing}
      onClose={props.onClose}
      className={classNames("create-common-modal", {
        "mobile-full-screen": isMobileView,
      })}
      mobileFullScreen={isMobileView}
    >
      {title && (
        <h2
          className={classNames("create-common-modal__title", {
            "create-common-modal__title--small": !isBigTitle,
          })}
        >
          {title}
        </h2>
      )}
      {content}
    </Modal>
  );
}
