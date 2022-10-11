import React, { FC, useState } from "react";
import { DynamicLinkType } from "@/shared/constants";
import { useBuildShareLink } from "@/shared/hooks";
import { Common } from "@/shared/models";
import { Share, ShareProps } from "../Share";

interface SupportShareProps
  extends Omit<ShareProps, "url" | "text" | "isLoading" | "onOpen"> {
  common: Common;
}

const SupportShare: FC<SupportShareProps> = (props) => {
  const { common, ...restProps } = props;
  const [linkURL, setLinkURL] = useState<string | null>(null);
  const { handleOpen } = useBuildShareLink(
    DynamicLinkType.Support,
    common,
    setLinkURL
  );

  return (
    <Share
      {...restProps}
      url={linkURL || ""}
      isLoading={!linkURL}
      onOpen={handleOpen}
    />
  );
};

export default SupportShare;
