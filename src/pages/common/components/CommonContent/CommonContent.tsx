import React, { FC, useState } from "react";
import { Common, CommonMember, Governance } from "@/shared/models";
import { Container, Loader, LoaderVariant } from "@/shared/ui-kit";
import { CommonTab } from "../../constants";
import { CommonHeader } from "../CommonHeader";
import { CommonTopNavigation } from "../CommonTopNavigation";
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
  const [tab, setTab] = useState(CommonTab.About);

  return (
    <>
      <CommonTopNavigation />
      {!isCommonMemberFetched && <Loader variant={LoaderVariant.Global} />}
      <div className={styles.container}>
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
    </>
  );
};

export default CommonContent;
