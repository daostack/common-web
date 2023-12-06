import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { InternalLinkData } from "../components";
import { QueryParamKey, ROUTE_PATHS } from "../constants";
import { useRoutesContext } from "../contexts";
import { getParamsFromOneOfRoutes } from "../utils";

const useOnInternalLinkClick = () => {
  const { getCommonPagePath } = useRoutesContext();
  const history = useHistory();

  const onInternalLinkClick = useCallback((data: InternalLinkData) => {
    const feedPageParams = getParamsFromOneOfRoutes<{ id: string }>(
      data.pathname,
      [ROUTE_PATHS.COMMON, ROUTE_PATHS.V04_COMMON],
    );

    if (!feedPageParams) {
      return;
    }

    const itemId = data.params[QueryParamKey.Item];
    const messageId = data.params[QueryParamKey.Message];

    // if (itemId) {
    //   console.log("ITEM ID!")
    //   // handleFeedItemClick(itemId, {
    //   //   commonId: feedPageParams.id,
    //   //   messageId,
    //   // });
    //   // return;
    // }

    history.push(
      getCommonPagePath(feedPageParams.id, {
        item: itemId,
        message: messageId,
      }),
    );
  }, []);

  return { onInternalLinkClick };
};

export default useOnInternalLinkClick;
