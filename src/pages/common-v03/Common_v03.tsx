import React, { useMemo } from "react";
import { getCommonPagePath_v03 } from "@/shared/utils";
import { CommonPage, CommonPageSettings } from "../common";

const Common = () => {
  const settings = useMemo<CommonPageSettings>(
    () => ({
      renderHeaderContent: () => null,
      generatePagePath: (commonId) => getCommonPagePath_v03(commonId),
    }),
    [],
  );

  return <CommonPage settings={settings} />;
};

export default Common;
