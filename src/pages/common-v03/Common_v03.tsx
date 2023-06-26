import React, { useMemo } from "react";
import { RoutesV03Provider } from "@/shared/contexts";
import { BaseCommonPage, CommonPageSettings } from "../common";

const Common = () => {
  const settings = useMemo<CommonPageSettings>(
    () => ({
      renderHeaderContent: () => null,
      withFeedTab: true,
    }),
    [],
  );

  return (
    <RoutesV03Provider>
      <BaseCommonPage settings={settings} />
    </RoutesV03Provider>
  );
};

export default Common;
