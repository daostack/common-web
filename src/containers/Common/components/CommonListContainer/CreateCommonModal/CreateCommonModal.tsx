import React, { useCallback, useEffect, useMemo, useState, ReactNode } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";

import { Modal } from "@/shared/components";
import { getScreenSize } from "@/shared/store/selectors";
import { ScreenSize } from "@/shared/constants";
import { CreationSteps } from "./CreationSteps";
import { Introduction } from "./Introduction";
import "./index.scss";

enum CreateCommonStage {
  Introduction,
  CreationSteps,
}

interface CreateCommonModalProps {
  isShowing: boolean;
  onClose: () => void;
}

export default function CreateCommonModal(props: CreateCommonModalProps) {
  const [stage, setStage] = useState(CreateCommonStage.Introduction);
  const [title, setTitle] = useState<ReactNode>('');
  const [isBigTitle, setIsBigTitle] = useState(true);
  const [isHeaderScrolledToTop, setIsHeaderScrolledToTop] = useState(true);
  const [onGoBack, setOnGoBack] = useState<(() => boolean | undefined) | undefined>();
  const [shouldShowCloseButton, setShouldShowCloseButton] = useState(true);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isHeaderSticky = stage === CreateCommonStage.CreationSteps;

  const setBigTitle = useCallback((title: string) => {
    setTitle(title);
    setIsBigTitle(true);
  }, []);
  const setSmallTitle = useCallback((title: ReactNode) => {
    setTitle(title);
    setIsBigTitle(false);
  }, []);

  const setGoBackHandler = useCallback((handler?: (() => boolean | undefined) | null) => {
    setOnGoBack(() => (handler ?? undefined));
  }, []);
  const moveStageBack = useCallback(() => {
    setStage((stage) => (stage === CreateCommonStage.Introduction ? stage : (stage - 1)));
  }, []);
  const moveStageForward = useCallback(() => {
    setStage(stage => stage + 1);
  }, []);
  const handleGoBack = useCallback(() => {
    if (onGoBack && onGoBack()) {
      moveStageBack();
    }
  }, [onGoBack, moveStageBack]);
  const handleCreationStepsFinish = useCallback(() => {
    console.log("handleCreationStepsFinish");
  }, []);

  const renderedTitle = useMemo((): ReactNode => {
    if (!title) {
      return null;
    }
    if (!isBigTitle) {
      return title;
    }

    return <h3 className="create-common-modal__title">{title}</h3>;
  }, [title, isBigTitle]);
  const content = useMemo(() => {
    switch (stage) {
      case CreateCommonStage.Introduction:
        return (
          <Introduction
            setTitle={isMobileView ? setSmallTitle : setBigTitle}
            setGoBackHandler={setGoBackHandler}
            onFinish={moveStageForward}
          />
        );
      case CreateCommonStage.CreationSteps:
        return (
          <CreationSteps
            isHeaderScrolledToTop={isHeaderScrolledToTop}
            setTitle={setSmallTitle}
            setGoBackHandler={setGoBackHandler}
            setShouldShowCloseButton={setShouldShowCloseButton}
            onFinish={handleCreationStepsFinish}
          />
        );
      default:
        return null;
    }
  }, [stage, isMobileView, isHeaderScrolledToTop, setSmallTitle, setBigTitle, setGoBackHandler, moveStageForward, handleCreationStepsFinish]);

  useEffect(() => {
    if (!props.isShowing) {
      setStage(CreateCommonStage.Introduction);
    }
  }, [props.isShowing]);

  return (
    <Modal
      isShowing={props.isShowing}
      onGoBack={onGoBack && handleGoBack}
      onClose={props.onClose}
      className={classNames("create-common-modal", {
        "mobile-full-screen": isMobileView,
      })}
      mobileFullScreen={isMobileView}
      title={renderedTitle}
      hideCloseButton={!shouldShowCloseButton}
      isHeaderSticky={isHeaderSticky}
      onHeaderScrolledToTop={setIsHeaderScrolledToTop}
    >
      {content}
    </Modal>
  );
}
