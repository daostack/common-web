import React, { useMemo } from "react";
import { CommonPage, CommonPageSettings } from "../common";

const Common = () => {
  const settings = useMemo<CommonPageSettings>(
    () => ({
      renderHeaderContent: () => null,
    }),
    [],
  );

  return <CommonPage settings={settings} />;
};

export default Common;
