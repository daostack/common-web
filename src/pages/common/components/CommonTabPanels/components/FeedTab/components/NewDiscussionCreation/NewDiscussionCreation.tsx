import React, { FC } from "react";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CommonCard } from "../../../../../CommonCard";
import { NewDiscussionHeader } from "./components";
import styles from "./NewDiscussionCreation.module.scss";

interface NewDiscussionCreationProps {
  data?: string;
}

const NewDiscussionCreation: FC<NewDiscussionCreationProps> = (props) => {
  // const {} = props;
  const isTabletView = useIsTabletView();

  return (
    <CommonCard className={styles.container} hideCardStyles={isTabletView}>
      <NewDiscussionHeader />
    </CommonCard>
  );
};

export default NewDiscussionCreation;
