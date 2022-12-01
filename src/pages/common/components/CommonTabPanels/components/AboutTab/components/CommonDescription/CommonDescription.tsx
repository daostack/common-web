import React, { FC } from "react";
import classNames from "classnames";
import { Linkify } from "@/shared/components";
import { Common } from "@/shared/models";
import { Tags } from "@/shared/ui-kit";
import { isRTL } from "@/shared/utils";
import { CommonCard } from "../../../../../CommonCard";
import styles from "./CommonDescription.module.scss";

interface CommonDescriptionProps {
  common: Common;
}

const CommonDescription: FC<CommonDescriptionProps> = (props) => {
  const { common } = props;
  const tags = common.tags || [];

  return (
    <CommonCard className={styles.container}>
      <p
        className={classNames(styles.description, {
          [styles.descriptionRTL]: isRTL(common.description),
        })}
      >
        <Linkify>{common.description}</Linkify>
      </p>
      {tags.length > 0 && (
        <div className={styles.tagsWrapper}>
          <Tags tags={tags} />
        </div>
      )}
    </CommonCard>
  );
};

export default CommonDescription;
