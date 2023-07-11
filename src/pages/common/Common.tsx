import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { InboxItemType } from "@/shared/constants";
import { MainRoutesProvider } from "@/shared/contexts";
import { multipleSpacesLayoutActions } from "@/store/states";
import BaseCommonPage, { CommonRouterParams } from "./BaseCommon";
import { CommonPageSettings } from "./types";
import styles from "./Common.module.scss";

const SETTINGS: CommonPageSettings = {
  pageContentClassName: styles.mainPageContent,
  renderHeaderContent: () => null,
};

const Common = () => {
  const { id: commonId } = useParams<CommonRouterParams>();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      multipleSpacesLayoutActions.configureBreadcrumbsData({
        type: InboxItemType.FeedItemFollow,
        activeCommonId: commonId,
      }),
    );
  }, [commonId]);

  return (
    <MainRoutesProvider>
      <BaseCommonPage settings={SETTINGS} />
    </MainRoutesProvider>
  );
};

export default Common;
