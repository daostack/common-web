import React, { CSSProperties, FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { selectUserStreamsWithNotificationsAmount } from "@/pages/Auth/store/selectors";
import { RoutesV04Provider } from "@/shared/contexts";
import { CommonSidenavLayoutPageContent } from "@/shared/layouts";
import BaseInboxPage from "./BaseInbox";
import { HeaderContent } from "./components";
import styles from "./Inbox_v04.module.scss";

const InboxPage_v04: FC = () => {
  const userStreamsWithNotificationsAmount = useSelector(
    selectUserStreamsWithNotificationsAmount(),
  );

  const renderContentWrapper = (
    children: ReactNode,
    wrapperStyles?: CSSProperties,
  ): ReactNode => (
    <CommonSidenavLayoutPageContent
      className={styles.layoutPageContent}
      headerClassName={styles.layoutHeader}
      headerContent={
        <HeaderContent
          streamsWithNotificationsAmount={
            userStreamsWithNotificationsAmount || 0
          }
        />
      }
      isGlobalLoading={false}
      styles={wrapperStyles}
    >
      {children}
    </CommonSidenavLayoutPageContent>
  );

  return (
    <RoutesV04Provider>
      <BaseInboxPage renderContentWrapper={renderContentWrapper} />
    </RoutesV04Provider>
  );
};

export default InboxPage_v04;
