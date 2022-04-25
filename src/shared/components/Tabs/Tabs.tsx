import React, { useMemo, FC } from "react";
import classNames from "classnames";
import { TabContext, TabContextValue } from "./context";
import "./index.scss";

interface TabsProps extends TabContextValue {
  className?: string;
}

const Tabs: FC<TabsProps> = (props) => {
  const { className, value, onChange, panelIdTemplate, children } = props;

  const contextValue = useMemo<TabContextValue>(
    () => ({
      value,
      onChange,
      panelIdTemplate,
    }),
    [value, onChange, panelIdTemplate]
  );

  return (
    <TabContext.Provider value={contextValue}>
      <div className={classNames("custom-tabs", className)} role="tablist">
        {children}
      </div>
    </TabContext.Provider>
  );
};

export default Tabs;
