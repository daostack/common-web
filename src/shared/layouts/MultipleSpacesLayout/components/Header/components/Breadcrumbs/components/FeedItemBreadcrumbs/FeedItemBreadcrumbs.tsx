import React, { FC, useMemo } from "react";
import { MultipleSpacesLayoutFeedItemBreadcrumbs } from "@/store/states";
import { ActiveBreadcrumbsItem } from "../ActiveBreadcrumbsItem";
import { BreadcrumbsItem } from "../BreadcrumbsItem";
import { LoadingBreadcrumbsItem } from "../LoadingBreadcrumbsItem";
import { Separator } from "../Separator";
import { getBreadcrumbsData } from "./utils";
import styles from "./FeedItemBreadcrumbs.module.scss";

interface FeedItemBreadcrumbsProps {
  breadcrumbs: MultipleSpacesLayoutFeedItemBreadcrumbs;
}

const FeedItemBreadcrumbs: FC<FeedItemBreadcrumbsProps> = (props) => {
  const { breadcrumbs } = props;
  const { data, projects } = useMemo(
    () => getBreadcrumbsData(breadcrumbs.items, breadcrumbs.activeCommonId),
    [breadcrumbs.items, breadcrumbs.activeCommonId],
  );

  return (
    <ul className={styles.container}>
      {breadcrumbs.areItemsLoading && <LoadingBreadcrumbsItem />}
      {!breadcrumbs.areItemsLoading &&
        data.map((item, index) => (
          <React.Fragment key={item.activeCommonId}>
            {index > 0 && <Separator />}
            <BreadcrumbsItem
              activeItemId={item.activeCommonId}
              items={item.items}
              commonIdToAddProject={item.commonIdToAddProject}
              isMainLevel={index === 0}
            />
          </React.Fragment>
        ))}
      {breadcrumbs.activeItem && (
        <>
          {(breadcrumbs.areItemsLoading || data.length > 0) && <Separator />}
          <ActiveBreadcrumbsItem
            name={breadcrumbs.activeItem.name}
            image={breadcrumbs.activeItem.image}
            items={projects}
            commonIdToAddProject={breadcrumbs.activeCommonId}
          />
        </>
      )}
    </ul>
  );
};

export default FeedItemBreadcrumbs;
