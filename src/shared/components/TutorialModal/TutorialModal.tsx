import React, { useState, useRef, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import tutorialVideoSrc from "@/shared/assets/videos/tutorial-video.mp4";
import { Modal } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { setTutorialModalState } from "@/shared/store/actions";
import { isRTL } from "@/shared/utils";
import "./index.scss";

interface Props {
  isShowing: boolean;
}

export default function TutorialModal({ isShowing }: Props): ReactElement {
  const dispatch = useDispatch();
  const { t } = useTranslation("translation", {
    keyPrefix: "tutorial",
  });

  const [isPlaying, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>();
  const {
    isShowing: isTutorialModalShowing,
    onClose,
    onOpen,
  } = useModal(false);

  useEffect(() => {
    if (isShowing) {
      onOpen();
    }
  }, [isShowing]);

  const handleClose = () => {
    onClose();
    dispatch(setTutorialModalState({ isShowing: false }));
    setPlaying(false);
  };

  const handleClickPlayButton = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

  return (
    <Modal isShowing={isTutorialModalShowing} onClose={handleClose}>
      <div className="tutorial-modal">
        <h4 className="tutorial-modal__header">App tour</h4>
        <p
          className={classNames("tutorial-modal__text", {
            "tutorial-modal__text--rtl": isRTL(t("welcome")),
          })}
        >
          {t("welcome")}
        </p>
        <div className="tutorial-modal__container">
          <video
            ref={videoRef as any}
            controls={isPlaying}
            className="tutorial-modal__container__video"
            playsInline
            preload="auto"
          >
            <source src={tutorialVideoSrc} type="video/mp4" />
          </video>
          {!isPlaying && (
            <div
              onClick={handleClickPlayButton}
              className="tutorial-modal__container__play-button-container"
            >
              <img
                className="tutorial-modal__container__play-button-container__icon"
                src="/icons/play-button.svg"
                alt="play-button"
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
