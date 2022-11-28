import React, { FC } from "react";
import { Common, CommonMember, Governance } from "@/shared/models";
import { Loader, LoaderVariant } from "@/shared/ui-kit";
import styles from "./CommonContent.module.scss";

interface CommonContentProps {
  common: Common;
  governance: Governance;
  isCommonMemberFetched: boolean;
  commonMember: CommonMember | null;
}

const CommonContent: FC<CommonContentProps> = (props) => {
  const { common, governance, isCommonMemberFetched, commonMember } = props;

  return (
    <div className={styles.container}>
      {!isCommonMemberFetched && <Loader variant={LoaderVariant.Global} />}
      Content
    </div>
  );
};

export default CommonContent;
