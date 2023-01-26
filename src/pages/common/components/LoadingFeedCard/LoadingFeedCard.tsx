import React, { FC } from "react";
import { Loader } from "@/shared/ui-kit";
import { FeedCard } from "../FeedCard";
import styles from "./LoadingFeedCard.module.scss";

export const LoadingFeedCard: FC = () => {
  return (
    <FeedCard className={styles.card}>
      <Loader />
    </FeedCard>
  );
};
