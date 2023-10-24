import React, { FC } from "react";
import { MultipleSpacesLayoutFeedItemBreadcrumbs } from "@/store/states";
import { useGoToCreateCommon } from "../../../../../../hooks";
import { ActiveBreadcrumbsItem } from "../ActiveBreadcrumbsItem";
import { BreadcrumbsItem } from "../BreadcrumbsItem";
import { LoadingBreadcrumbsItem } from "../LoadingBreadcrumbsItem";
import { Separator } from "../Separator";
import styles from "./FeedItemBreadcrumbs.module.scss";

interface FeedItemBreadcrumbsProps {
  breadcrumbs: MultipleSpacesLayoutFeedItemBreadcrumbs;
  itemsWithMenus: boolean;
}

const FeedItemBreadcrumbs: FC<FeedItemBreadcrumbsProps> = (props) => {
  const { breadcrumbs, itemsWithMenus } = props;
  const goToCreateCommon = useGoToCreateCommon();

  return (
    <ul className={styles.container}>
      {breadcrumbs.areItemsLoading && <LoadingBreadcrumbsItem />}
      {!breadcrumbs.areItemsLoading &&
        breadcrumbs.items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <Separator />}
            <BreadcrumbsItem
              activeItem={item}
              items={[]}
              commonIdToAddProject={item.directParent?.commonId}
              onCommonCreate={index === 0 ? goToCreateCommon : undefined}
              withMenu={itemsWithMenus}
            />
          </React.Fragment>
        ))}
      {breadcrumbs.activeItem && (
        <>
          {(breadcrumbs.areItemsLoading || breadcrumbs.items.length > 0) && (
            <Separator />
          )}
          <ActiveBreadcrumbsItem
            name={breadcrumbs.activeItem.name}
            image={breadcrumbs.activeItem.image}
            items={[]}
            commonIdToAddProject={breadcrumbs.activeCommonId}
            withMenu={itemsWithMenus}
          />
        </>
      )}
    </ul>
  );
};

export default FeedItemBreadcrumbs;
