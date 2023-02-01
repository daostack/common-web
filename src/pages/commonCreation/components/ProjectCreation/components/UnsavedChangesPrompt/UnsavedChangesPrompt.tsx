import React, { FC } from "react";
import {
  Button,
  PreventNavigationPrompt,
  PreventNavigationPromptProps,
} from "@/shared/ui-kit";
import styles from "./UnsavedChangesPrompt.module.scss";

interface UnsavedChangesPromptProps {
  shouldShowPrompt: PreventNavigationPromptProps["shouldPrevent"];
}

const UnsavedChangesPrompt: FC<UnsavedChangesPromptProps> = (props) => {
  const { shouldShowPrompt } = props;

  return (
    <PreventNavigationPrompt
      shouldPrevent={shouldShowPrompt}
      modalProps={{
        className: styles.modal,
        mobileFullScreen: true,
      }}
    >
      {({ confirmNavigation, cancelNavigation }) => (
        <div className={styles.content}>
          <img
            className={styles.image}
            src="/assets/images/floppy-disk.svg"
            alt="Project created"
            aria-hidden
          />
          <h2 className={styles.title}>Unsaved changes</h2>
          <p className={styles.description}>
            You are about to leave this page.
            <br />
            Your changes will not be saved.
          </p>
          <div className={styles.buttonsContainer}>
            <div className={styles.buttonsWrapper}>
              <Button onClick={cancelNavigation}>Continue editing</Button>
              <Button
                className={styles.confirmNavigationButton}
                onClick={confirmNavigation}
              >
                Leave without saving
              </Button>
            </div>
          </div>
        </div>
      )}
    </PreventNavigationPrompt>
  );
};

export default UnsavedChangesPrompt;
