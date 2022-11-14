import React, { ReactNode } from "react";
import { ROUTE_PATHS } from "@/shared/constants";
import { Common } from "@/shared/models";
import { Tabs } from "./constants";

export const getInitialTab = (defaultTab: string): Tabs => {
  const isCorrectTab = Object.values(Tabs).includes(defaultTab as Tabs);

  return isCorrectTab ? (defaultTab as Tabs) : Tabs.About;
};

// I intentionally used anchor element for links to refresh the page
export const getCommonSubtitle = (
  parentCommon: Common | null,
  subCommons: Common[],
): ReactNode | null => {
  if (parentCommon) {
    return (
      <>
        Parent:{" "}
        <a href={ROUTE_PATHS.COMMON_DETAIL.replace(":id", parentCommon.id)}>
          {parentCommon.name}
        </a>
      </>
    );
  }
  if (subCommons.length > 0) {
    return (
      <>
        Projects:{" "}
        {subCommons.reduce<ReactNode[]>((acc, common, index) => {
          const nextItems = [
            <a
              key={common.id}
              href={ROUTE_PATHS.COMMON_DETAIL.replace(":id", common.id)}
            >
              {common.name}
            </a>,
          ];

          if (index !== subCommons.length - 1) {
            nextItems.push(
              <React.Fragment key={`separator-${index}`}>, </React.Fragment>,
            );
          }

          return acc.concat(...nextItems);
        }, [])}
      </>
    );
  }

  return null;
};
