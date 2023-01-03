import React, { FC } from "react";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { CommonCard } from "../../../../../CommonCard";
import { NewDiscussionHeader } from "./components";
import styles from "./NewDiscussionCreation.module.scss";

interface NewDiscussionCreationProps {
  governanceCircles: Governance["circles"];
  commonMember: (CommonMember & CirclesPermissions) | null;
}

const NewDiscussionCreation: FC<NewDiscussionCreationProps> = (props) => {
  const { governanceCircles, commonMember } = props;
  const isTabletView = useIsTabletView();
  const userCircleIds = commonMember
    ? Object.values(commonMember.circles.map)
    : [];

  return (
    <CommonCard className={styles.container} hideCardStyles={isTabletView}>
      <NewDiscussionHeader
        governanceCircles={governanceCircles}
        userCircleIds={userCircleIds}
      />
    </CommonCard>
  );
};

export default NewDiscussionCreation;
