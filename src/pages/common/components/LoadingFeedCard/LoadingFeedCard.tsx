import React, { FC } from "react";
import { Loader } from "@/shared/ui-kit";
import { FeedCard } from "../FeedCard";
import styles from "./LoadingFeedCard.module.scss";

export const LoadingFeedCard: FC = () => {
  return (
    <FeedCard
      canBeExpanded={false}
      className={styles.card}
      isPreviewMode={false}
    >
      <Loader />
    </FeedCard>
  );
};
