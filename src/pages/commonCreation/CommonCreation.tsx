import React, { FC } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "@/shared/ui-kit";
import styles from "./CommonCreation.module.scss";

interface CommonCreationRouterParams {
  id?: string;
}

const CommonCreation: FC = () => {
  const { id: commonId } = useParams<CommonCreationRouterParams>();
  const isProjectCreation = Boolean(commonId);
  const isLoading = false;

  if (isLoading) {
    return (
      <div className={styles.centerWrapper}>
        <Loader />
      </div>
    );
  }

  return null;
};

export default CommonCreation;
