import React, { CSSProperties, FC, ReactElement, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import {
  selectIsAuthenticated,
  selectUser,
  selectUserStreamsWithNotificationsAmount,
} from "@/pages/Auth/store/selectors";
import { Tab, Tabs } from "@/shared/components";
import { useRoutesContext } from "@/shared/contexts";
import { useModal } from "@/shared/hooks";
import {
  useLastVisitedCommon,
  useUserCommonIds,
} from "@/shared/hooks/useCases";
import { Avatar2Icon, Blocks2Icon, InboxIcon } from "@/shared/icons";
import { CreateCommonPrompt } from "@/shared/layouts/MultipleSpacesLayout/components/Header/components/Navigation/components";
import { LayoutTab } from "../../constants";
import { getActiveLayoutTab } from "./utils";
import styles from "./LayoutTabs.module.scss";

interface LayoutTabsProps {
  className?: string;
  activeTab?: LayoutTab;
  renderLayoutTabs?: () => ReactElement | null;
}

interface TabConfiguration {
  label?: string;
  value: LayoutTab;
  icon: ReactNode;
  notificationsAmount?: number | null;
}

const LayoutTabs: FC<LayoutTabsProps> = (props) => {
  const { className, renderLayoutTabs } = props;
  const history = useHistory();
  const { getCommonPagePath, getInboxPagePath, getProfilePagePath } =
    useRoutesContext();
  const isAuthenticated = useSelector(selectIsAuthenticated());
  const userStreamsWithNotificationsAmount = useSelector(
    selectUserStreamsWithNotificationsAmount(),
  );
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const { data: userCommonIds } = useUserCommonIds();
  const { lastVisitedCommon } = useLastVisitedCommon(userId);
  const {
    isShowing: isCreateCommonPromptOpen,
    onOpen: onCreateCommonPromptOpen,
    onClose: onCreateCommonPromptClose,
  } = useModal(false);
  const finalUserStreamsWithNotificationsAmount =
    userStreamsWithNotificationsAmount &&
    userStreamsWithNotificationsAmount > 99
      ? 99
      : userStreamsWithNotificationsAmount;
  const activeTab =
    props.activeTab || getActiveLayoutTab(history.location.pathname);
  const tabs: TabConfiguration[] = [
    {
      value: LayoutTab.Spaces,
      icon: <Blocks2Icon active={activeTab === LayoutTab.Spaces} />,
    },
    {
      value: LayoutTab.Profile,
      icon: <Avatar2Icon active={activeTab === LayoutTab.Profile} />,
    },
  ];

  if (isAuthenticated) {
    tabs.unshift({
      value: LayoutTab.Inbox,
      icon: <InboxIcon active={activeTab === LayoutTab.Inbox} />,
      notificationsAmount: finalUserStreamsWithNotificationsAmount || null,
    });
  } else {
    return renderLayoutTabs ? renderLayoutTabs() : null;
  }

  const itemStyles = {
    "--items-amount": tabs.length,
  } as CSSProperties;

  const handleSpacesClick = () => {
    const commonForRedirectId = lastVisitedCommon?.id || userCommonIds[0];

    if (commonForRedirectId) {
      history.push(getCommonPagePath(commonForRedirectId));
    } else {
      onCreateCommonPromptOpen();
    }
  };

  const handleTabChange = (value: unknown) => {
    if (activeTab === value) {
      return;
    }

    switch (value) {
      case LayoutTab.Spaces:
        handleSpacesClick();
        break;
      case LayoutTab.Inbox:
        history.push(getInboxPagePath());
        break;
      case LayoutTab.Profile:
        history.push(getProfilePagePath());
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Tabs
        className={classNames(styles.tabs, className)}
        style={itemStyles}
        value={activeTab}
        withIcons
        onChange={handleTabChange}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            className={styles.tab}
            label={tab?.label}
            value={tab.value}
            icon={
              <div className={styles.iconWrapper}>
                {tab.icon}
                {typeof tab.notificationsAmount === "number" && (
                  <span className={styles.iconBadge}>
                    {tab.notificationsAmount}
                  </span>
                )}
              </div>
            }
            includeDefaultMobileStyles={false}
          />
        ))}
      </Tabs>
      {isCreateCommonPromptOpen && (
        <CreateCommonPrompt isOpen onClose={onCreateCommonPromptClose} />
      )}
    </>
  );
};

export default LayoutTabs;
