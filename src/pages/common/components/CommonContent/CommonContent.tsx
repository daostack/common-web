import React, { FC, useState } from "react";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Common, CommonMember, Governance } from "@/shared/models";
import { Container, Loader, LoaderVariant } from "@/shared/ui-kit";
import { CommonTab } from "../../constants";
import { CommonHeader } from "../CommonHeader";
import { CommonManagement } from "../CommonManagement";
import { CommonTabPanels } from "../CommonTabPanels";
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
  const isTabletView = useIsTabletView();

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
        {!isTabletView && (
          <Container>
            <CommonManagement
              activeTab={tab}
              circles={governance.circles}
              circlesMap={commonMember?.circles.map}
              onTabChange={setTab}
            />
          </Container>
        )}
        <CommonTabPanels
          activeTab={tab}
          common={common}
          governance={governance}
        />
      </div>
    </>
  );
};

export default CommonContent;
