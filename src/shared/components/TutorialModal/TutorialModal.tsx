import React, { useState, useRef, ReactElement, useEffect } from 'react';
import { Modal } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import landingVideoPosterSrc from "@/shared/assets/images/landing-video-poster.jpeg";
import landingVideoSrc from "@/shared/assets/videos/landing-video.mp4";
import { useDispatch } from 'react-redux';
import { setTutorialModalState } from '@/shared/store/actions';
import './index.scss';

interface Props {
  isShowing: boolean;
}

export default function TutorialModal({
  isShowing
}: Props): ReactElement {
  const dispatch = useDispatch();

  const [isPlaying, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>();
  const {
    isShowing: isTutorialModalShowing,
    onClose,
    onOpen
  } = useModal(false);


  useEffect(() => {
    if(isShowing) {
      onOpen()
    }
  },[isShowing]);


  const handleClose = () => {
    onClose();
    dispatch(setTutorialModalState({ isShowing: false }))
    setPlaying(false);
  }

  const handleClickPlayButton = () => {
    setPlaying(true);
    videoRef.current?.play();
  }

  return (
    <Modal  isShowing={isTutorialModalShowing} onClose={handleClose}>
      <div className="tutorial-modal">
        <h4 className="tutorial-modal__header">Tutorial</h4>
        <p className="tutorial-modal__text">
        👋 Hi, this is very important video that can help you to understand better the Common world. If you want to see it again please go to the menu and press on your personal tab
        </p>
        <div className="tutorial-modal__container">
          <video
            ref={videoRef as any}
            controls={isPlaying}
            className="tutorial-modal__container__video"
            playsInline
            poster={landingVideoPosterSrc}
            preload="auto"
          >
            <source src={landingVideoSrc} type="video/mp4" />
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
  )
}