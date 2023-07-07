import React, { FC, useMemo } from "react";
import { useHistory } from "react-router";
import { CreateCommonModal } from "@/pages/OldCommon/components";
import { useRoutesContext } from "@/shared/contexts";
import { useModal } from "@/shared/hooks";
import { Common } from "@/shared/models";
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
  const history = useHistory();
  const { getCommonPagePath } = useRoutesContext();
  const {
    isShowing: isCommonCreationModalOpen,
    onOpen: onCommonCreationModalOpen,
    onClose: onCommonCreationModalClose,
  } = useModal(false);
  const { data, projects } = useMemo(
    () => getBreadcrumbsData(breadcrumbs.items, breadcrumbs.activeCommonId),
    [breadcrumbs.items, breadcrumbs.activeCommonId],
  );

  const handleGoToCommon = (common: Common) => {
    onCommonCreationModalClose();
    history.push(getCommonPagePath(common.id));
  };

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
              onCommonCreate={onCommonCreationModalOpen}
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
      {isCommonCreationModalOpen && (
        <CreateCommonModal
          isShowing
          onClose={onCommonCreationModalClose}
          isSubCommonCreation={false}
          onGoToCommon={handleGoToCommon}
        />
      )}
    </ul>
  );
};

export default FeedItemBreadcrumbs;
