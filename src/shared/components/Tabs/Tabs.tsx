import React, { useCallback, useMemo, FC } from "react";
import { scroller } from "react-scroll";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { TabContext, TabContextValue } from "./context";
import "./index.scss";

interface TabsProps extends TabContextValue {
  className?: string;
}

const Tabs: FC<TabsProps> = (props) => {
  const { className, value, onChange, panelIdTemplate, children } = props;
  const tabListId = useMemo(() => `tab-list-${uuidv4()}`, []);

  const handleChange = useCallback(
    (value: unknown, itemId: string) => {
      onChange(value, itemId);

      scroller.scrollTo(itemId, {
        containerId: tabListId,
        delay: 0,
        duration: 300,
        horizontal: true,
        offset: -20,
        smooth: true,
      });
    },
    [onChange, tabListId]
  );

  const contextValue = useMemo<TabContextValue>(
    () => ({
      value,
      panelIdTemplate,
      onChange: handleChange,
    }),
    [value, handleChange, panelIdTemplate]
  );

  return (
    <TabContext.Provider value={contextValue}>
      <div
        id={tabListId}
        className={classNames("custom-tabs", className)}
        role="tablist"
      >
        {children}
      </div>
    </TabContext.Provider>
  );
};

export default Tabs;
