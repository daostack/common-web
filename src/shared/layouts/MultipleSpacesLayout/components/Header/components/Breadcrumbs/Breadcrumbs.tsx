import React, { FC } from "react";
import { useSelector } from "react-redux";
import { InboxItemType } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { selectMultipleSpacesLayoutBreadcrumbs } from "@/store/states";
import { ChatChannelBreadcrumbs, FeedItemBreadcrumbs } from "./components";

interface BreadcrumbsProps {
  itemsWithMenus?: boolean;
}

const Breadcrumbs: FC<BreadcrumbsProps> = (props) => {
  const { itemsWithMenus = true } = props;
  const breadcrumbs = useSelector(selectMultipleSpacesLayoutBreadcrumbs);
  const isMobileView = useIsTabletView();

  if (breadcrumbs?.type === InboxItemType.ChatChannel) {
    return <ChatChannelBreadcrumbs breadcrumbs={breadcrumbs} />;
  }
  if (breadcrumbs?.type === InboxItemType.FeedItemFollow) {
    const truncate = isMobileView && breadcrumbs.items.length >= 3;
    return (
      <FeedItemBreadcrumbs
        breadcrumbs={breadcrumbs}
        itemsWithMenus={itemsWithMenus}
        truncate={truncate}
      />
    );
  }

  return null;
};

export default Breadcrumbs;
