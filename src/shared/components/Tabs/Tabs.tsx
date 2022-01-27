import React, { useMemo, FC } from "react";
import { TabContext, TabContextValue } from "./context";
import "./index.scss";

type TabsProps = TabContextValue;

const Tabs: FC<TabsProps> = (props) => {
  const { value, onChange, panelIdTemplate, children } = props;

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
      <div className="custom-tabs" role="tablist">
        {children}
      </div>
    </TabContext.Provider>
  );
};

export default Tabs;
