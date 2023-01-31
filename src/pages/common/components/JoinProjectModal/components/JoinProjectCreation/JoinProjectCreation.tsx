import React, { FC, useCallback } from "react";
import { Image } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import { Loader } from "@/shared/ui-kit";
import styles from "./JoinProjectCreation.module.scss";

interface JoinProjectCreationProps {
  isLoading: boolean;
  isAssignCircle: boolean;
  errorText?: string;
}

const JoinProjectCreation: FC<JoinProjectCreationProps> = (props) => {
  const { isLoading, isAssignCircle, errorText } = props;

  const ContentEl = useCallback(() => {
    if (errorText) {
      return <ErrorText className={styles.error}>{errorText}</ErrorText>;
    }

    if (isLoading) {
      return <Loader />;
    }

    return (
      <>
        <h2 className={styles.title}>
          {isAssignCircle
            ? "Your request has been successfully received"
            : "Congratulations! You are in"}
        </h2>
        {isAssignCircle && (
          <p className={styles.description}>Please wait for confirmation</p>
        )}
      </>
    );
  }, [errorText, isLoading, isAssignCircle]);

  return (
    <div className={styles.content}>
      <Image
        className={styles.image}
        src="/icons/add-proposal/illustrations-full-page-send.svg"
        alt="Send"
        placeholderElement={null}
        aria-hidden
      />
      <ContentEl />
    </div>
  );
};

export default JoinProjectCreation;
