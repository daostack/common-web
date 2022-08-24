import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/shared/constants";
import { Common } from "@/shared/models";
import { Tabs } from "./constants";

export const getInitialTab = (defaultTab: string): Tabs => {
  const isCorrectTab = Object.values(Tabs).includes(defaultTab as Tabs);

  return isCorrectTab ? (defaultTab as Tabs) : Tabs.About;
};

export const getCommonSubtitle = (
  parentCommon: Common | null,
  subCommons: Common[]
): ReactNode | null => {
  if (parentCommon) {
    return (
      <>
        Parent:{" "}
        <Link to={ROUTE_PATHS.COMMON_DETAIL.replace(":id", parentCommon.id)}>
          {parentCommon.name}
        </Link>
      </>
    );
  }
  if (subCommons.length > 0) {
    return (
      <>
        Sub Commons:{" "}
        {subCommons.reduce<ReactNode[]>((acc, common, index) => {
          const nextItems = [
            <Link
              key={common.id}
              to={ROUTE_PATHS.COMMON_DETAIL.replace(":id", common.id)}
            >
              {common.name}
            </Link>,
          ];

          if (index !== subCommons.length - 1) {
            nextItems.push(
              <React.Fragment key={`separator-${index}`}>, </React.Fragment>
            );
          }

          return acc.concat(...nextItems);
        }, [])}
      </>
    );
  }

  return null;
};
