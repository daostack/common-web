import React, { FC } from "react";
import { useHistory } from "react-router";
import classnames from "classnames";
import { QueryParamKey, ROUTE_PATHS } from "@/shared/constants";
import { useQueryParams, useRemoveQueryParams } from "@/shared/hooks";
import { InboxFilterIcon } from "@/shared/icons";
import { ButtonIcon } from "@/shared/ui-kit";
import styles from "./InboxFilterButton.module.scss";

interface InboxFilterButtonProps {
  className?: string;
}

const InboxFilterButton: FC<InboxFilterButtonProps> = (props) => {
  const { className } = props;
  const history = useHistory();
  const queryParams = useQueryParams();
  const { removeQueryParams } = useRemoveQueryParams();
  const isActiveUnreadInboxItemsQueryParam = queryParams[QueryParamKey.Unread] === "true";

  const handleFilterIconClick = (): void => {
    if (isActiveUnreadInboxItemsQueryParam) {
      removeQueryParams(QueryParamKey.Unread);
    } else {
      history.push(`${ROUTE_PATHS.INBOX}?${QueryParamKey.Unread}=true`);
    }
  }

  return (
    <ButtonIcon
      className={classnames(styles.buttonIcon, className, {
        [styles.unreadFilterActive]: isActiveUnreadInboxItemsQueryParam,
      })}
      onClick={handleFilterIconClick}
    >
      <InboxFilterIcon
        className={classnames(styles.icon, {
          [styles.iconActive]: isActiveUnreadInboxItemsQueryParam,
        })}
      />
    </ButtonIcon>
  );
};

export default InboxFilterButton;