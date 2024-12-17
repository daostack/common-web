import React, { FC, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CancelTokenSource } from "axios";
import classNames from "classnames";
import { isError } from "lodash";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  CommonFeedService,
  Logger,
  getCancelTokenSource,
  isRequestCancelled,
} from "@/services";
import { Modal } from "@/shared/components";
import { useNotification } from "@/shared/hooks";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import styles from "./UnlinkStreamModal.module.scss";

interface UnlinkStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedItemId: string;
  title: string;
  commonId: string;
  commonName: string;
}

const UnlinkStreamModal: FC<UnlinkStreamModalProps> = (props) => {
  const { isOpen, onClose, feedItemId, title, commonId, commonName } = props;
  const { notify } = useNotification();
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [errorText, setErrorText] = useState("");
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const handleSubmit = async () => {
    if (!userId) {
      return;
    }

    setErrorText("");
    setIsUnlinking(true);

    try {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }

      cancelTokenRef.current = getCancelTokenSource();

      await CommonFeedService.unlinkStream(
        {
          feedObjectId: feedItemId,
          commonId: commonId,
          userId: userId,
        },
        {
          cancelToken: cancelTokenRef.current.token,
        },
      );

      cancelTokenRef.current = null;

      notify("Stream is successfully unlinked");
      setIsUnlinking(false);
      onClose();
    } catch (error) {
      if (!isRequestCancelled(error)) {
        Logger.error(error);
        cancelTokenRef.current = null;
      }
      setIsUnlinking(false);
      setErrorText(isError(error) ? error.message : "Something went wrong...");
    }
  };

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={isUnlinking ? emptyFunction : onClose}
      title={`Unlink “${title}“ from “${commonName}“`}
      isHeaderSticky
      mobileFullScreen
      hideCloseButton
    >
      <div>
        This stream is linked in multiple spaces. <br />
        If you proceed, it will be removed from "{commonName}" only and will
        remain in other locations. Do you want to continue?
        <div className={styles.buttonsWrapper}>
          <Button
            className={classNames(styles.button)}
            variant={ButtonVariant.OutlineDarkPink}
            onClick={onClose}
            disabled={isUnlinking}
          >
            Cancel
          </Button>
          <Button
            className={classNames(styles.button, styles.unlinkButton)}
            onClick={handleSubmit}
            variant={ButtonVariant.Warning}
            disabled={isUnlinking}
          >
            Unlink
          </Button>
        </div>
        {errorText && <span className={styles.errorText}>{errorText}</span>}
      </div>
    </Modal>
  );
};

export default React.memo(UnlinkStreamModal);
