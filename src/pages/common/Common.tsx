import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { MainRoutesProvider, useRoutesContext } from "@/shared/contexts";
import { CirclesPermissions, CommonMember } from "@/shared/models";
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
  const { getCommonPagePath } = useRoutesContext();

  const handleCommonMemberChange = useCallback(
    (commonMember: (CommonMember & CirclesPermissions) | null) => {
      dispatch(
        multipleSpacesLayoutActions.setBackUrl(
          commonMember && getCommonPagePath(commonId),
        ),
      );
    },
    [commonId, getCommonPagePath],
  );

  useEffect(() => {
    dispatch(multipleSpacesLayoutActions.resetMultipleSpacesLayout());

    return () => {
      dispatch(multipleSpacesLayoutActions.setBackUrl(null));
    };
  }, []);

  return (
    <MainRoutesProvider>
      <BaseCommonPage
        settings={SETTINGS}
        onCommonMemberChange={handleCommonMemberChange}
      />
    </MainRoutesProvider>
  );
};

export default Common;
