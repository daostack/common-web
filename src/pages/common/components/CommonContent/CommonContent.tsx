import React, { FC } from "react";
import { Common, CommonMember, Governance } from "@/shared/models";
import { Container, Loader, LoaderVariant } from "@/shared/ui-kit";
import { CommonHeader } from "../CommonHeader";
import { getMainCommonDetails } from "./utils";
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
      <Container>
        <CommonHeader
          commonImageSrc={common.image}
          commonName={common.name}
          description={common.byline}
          details={getMainCommonDetails(common)}
          isProject={Boolean(common.directParent)}
          withJoin={false}
        />
      </Container>
    </div>
  );
};

export default CommonContent;
