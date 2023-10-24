import React, { FC, useMemo } from "react";
import {
  useAllUserCommonMemberInfo,
  useGovernanceListByCommonIds,
} from "@/shared/hooks/useCases";
import { MultipleSpacesLayoutFeedItemBreadcrumbs } from "@/store/states";
import { getPermissionsDataByAllUserCommonMemberInfo } from "@/store/states/commonLayout/saga/utils";
import { useGoToCreateCommon } from "../../../../../../hooks";
import { ActiveBreadcrumbsItem } from "../ActiveBreadcrumbsItem";
import { LoadingBreadcrumbsItem } from "../LoadingBreadcrumbsItem";
import { Separator } from "../Separator";
import { FeedBreadcrumbsItem } from "./components";
import styles from "./FeedItemBreadcrumbs.module.scss";

interface FeedItemBreadcrumbsProps {
  breadcrumbs: MultipleSpacesLayoutFeedItemBreadcrumbs;
  itemsWithMenus: boolean;
}

const FeedItemBreadcrumbs: FC<FeedItemBreadcrumbsProps> = (props) => {
  const { breadcrumbs, itemsWithMenus } = props;
  const goToCreateCommon = useGoToCreateCommon();
  const commonIds = useMemo(
    () => breadcrumbs.items.map((item) => item.id),
    [breadcrumbs.items],
  );
  const { data: allUserCommonMemberInfo } = useAllUserCommonMemberInfo();
  const { data: governanceList } = useGovernanceListByCommonIds(commonIds);
  const userCommonIds = useMemo(
    () => allUserCommonMemberInfo?.map((item) => item.commonId) || [],
    [allUserCommonMemberInfo],
  );
  const permissionsData = useMemo(
    () =>
      allUserCommonMemberInfo && governanceList
        ? getPermissionsDataByAllUserCommonMemberInfo(
            allUserCommonMemberInfo,
            governanceList,
          )
        : [],
    [allUserCommonMemberInfo, governanceList],
  );
  const rootItem = breadcrumbs.items.find((item) => !item.directParent);

  return (
    <ul className={styles.container}>
      {breadcrumbs.areItemsLoading && <LoadingBreadcrumbsItem />}
      {!breadcrumbs.areItemsLoading &&
        breadcrumbs.items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <Separator />}
            <FeedBreadcrumbsItem
              activeItem={item}
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
