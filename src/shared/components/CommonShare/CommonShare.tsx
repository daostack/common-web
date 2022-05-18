import React, { FC, useState } from "react";
import { useBuildShareLink } from "@/shared/hooks";
import { DynamicLinkType } from "@/shared/constants";
import { Common } from "@/shared/models";
import { Share, ShareProps } from "../Share";

interface CommonShareProps
  extends Omit<ShareProps, "url" | "text" | "isLoading" | "onOpen"> {
  common: Common;
}

const CommonShare: FC<CommonShareProps> = (props) => {
  const { common, ...restProps } = props;
  const [linkURL, setLinkURL] = useState<string | null>(null);
  const { handleOpen } = useBuildShareLink(DynamicLinkType.Common, common, setLinkURL);

  return (
    <Share
      {...restProps}
      url={linkURL || ""}
      isLoading={!linkURL}
      onOpen={handleOpen}
    />
  );
};

export default CommonShare;
