import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';

import { isMobile } from "../../../../../shared/utils";
import { Modal } from "../../../../../shared/components";
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
        return <Introduction setTitle={setBigTitle} onFinish={handleIntroductionFinish} />;
      default:
        return null;
    }
  }, [stage]);

  return (
    <Modal
      isShowing={props.isShowing}
      onClose={props.onClose}
      className="create-common-modal"
    >
      {title && (
        <h2
          className={classNames('create-common-modal__title', {
            'create-common-modal__title--small': !isBigTitle,
          })}
        >
          {title}
        </h2>
      )}
      {content}
    </Modal>
  );
}
