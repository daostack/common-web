import React, { useCallback, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DynamicLinksTypes, DYNAMIC_LINK_URI_PREFIX } from "@/shared/constants";
import { Common } from "@/shared/models";
import { buildShareLink } from "@/shared/store/actions";
import {
  selectLoadingShareLinks,
  selectShareLinks,
} from "@/shared/store/selectors";
import { Share, ShareProps } from "../Share";

interface CommonShareProps
  extends Omit<ShareProps, "url" | "text" | "isLoading" | "onOpen"> {
  common: Common;
}

const CommonShare: FC<CommonShareProps> = (props) => {
  const { common, ...restProps } = props;
  const linkKey = `${DynamicLinksTypes.Common}/${common.id}`;
  const dispatch = useDispatch();
  const shareLinks = useSelector(selectShareLinks());
  const loadingShareLinks = useSelector(selectLoadingShareLinks());
  const linkURL = shareLinks[linkKey] || "";
  const isLoading = Boolean(loadingShareLinks[linkKey]);

  const handleOpen = useCallback(() => {
    if (linkURL || isLoading) {
      return;
    }

    dispatch(
      buildShareLink.request({
        payload: {
          key: linkKey,
          linkInfo: {
            link: `${DYNAMIC_LINK_URI_PREFIX}/${DynamicLinksTypes.Common}/${common.id}`,
            domainUriPrefix: DYNAMIC_LINK_URI_PREFIX,
            socialMetaTagInfo: {
              socialTitle: common.name,
              socialDescription: common.metadata.description || "",
              socialImageLink: common.image,
            },
          },
        },
      })
    );
  }, [linkURL, isLoading, dispatch, linkKey, common]);

  return (
    <Share
      {...restProps}
      url={linkURL}
      text=""
      isLoading={!linkURL || isLoading}
      onOpen={handleOpen}
    />
  );
};

export default CommonShare;
