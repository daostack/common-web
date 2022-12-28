import React, { ChangeEventHandler, FC, useEffect, useState } from "react";
import { Editor } from "slate";
import { Input } from "@/shared/components/Form/Input";
import { Modal } from "@/shared/components/Modal";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { ElementType } from "../../../../constants";
import { LinkElement } from "../../../../types";
import {
  getElementsByType,
  insertLink,
  isElementActive,
  unwrapLink,
} from "../../../../utils";
import styles from "./LinkModal.module.scss";

interface LinkModalProps {
  editor: Editor;
  isShowing: boolean;
  onClose: () => void;
}

const LinkModal: FC<LinkModalProps> = (props) => {
  const { editor, isShowing, onClose } = props;
  const [url, setUrl] = useState("");
  const isLinkActive = isElementActive(editor, ElementType.Link);
  const isSaveDisabled = !url;

  const handleURLChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setUrl(event.target.value);
  };

  const handleLinkUpdate = () => {
    if (url) {
      insertLink(editor, url);
    }
    onClose();
  };

  const handleLinkRemove = () => {
    if (isLinkActive) {
      unwrapLink(editor);
    }
    onClose();
  };

  useEffect(() => {
    if (!isShowing || !editor.selection) {
      setUrl("");
      return;
    }

    const nodeEntries = getElementsByType<LinkElement>(
      editor,
      ElementType.Link,
      {
        at: Editor.unhangRange(editor, editor.selection),
      },
    );
    const firstLink = nodeEntries[0]?.[0];

    if (firstLink?.url) {
      setUrl(firstLink.url);
    }
  }, [isShowing]);

  return (
    <Modal isShowing={isShowing} onClose={onClose} className={styles.modal}>
      <form className={styles.form} onSubmit={handleLinkUpdate}>
        <Input
          id="textEditorURL"
          name="textEditorURL"
          label="Enter the URL:"
          autoFocus
          value={url}
          onChange={handleURLChange}
        />
        <div className={styles.buttonsContainer}>
          <div className={styles.buttonsWrapper}>
            <Button variant={ButtonVariant.PrimaryGray} onClick={onClose}>
              Cancel
            </Button>
            {isLinkActive && (
              <Button
                variant={ButtonVariant.OutlineBlue}
                onClick={handleLinkRemove}
              >
                Remove
              </Button>
            )}
            <Button
              type="submit"
              variant={ButtonVariant.PrimaryPurple}
              disabled={isSaveDisabled}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default LinkModal;
