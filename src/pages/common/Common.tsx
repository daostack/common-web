import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { useFullCommonData } from "@/shared/hooks/useCases";
import { Loader, NotFound } from "@/shared/ui-kit";
import { CommonContent } from "./components";
import styles from "./Common.module.scss";

interface CommonRouterParams {
  id: string;
}

const Common: FC = () => {
  const { id: commonId } = useParams<CommonRouterParams>();
  const {
    data: commonData,
    fetched: isCommonDataFetched,
    fetchCommonData,
  } = useFullCommonData();
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember(false);
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const isDataFetched = isCommonDataFetched;

  const fetchData = () => {
    fetchCommonData(commonId);
    fetchCommonMember(commonId, true);
  };

  useEffect(() => {
    fetchData();
  }, [commonId]);

  useEffect(() => {
    fetchCommonMember(commonId, true);
  }, [userId]);

  if (!isDataFetched) {
    return (
      <div className={styles.centerWrapper}>
        <Loader />
      </div>
    );
  }
  if (!commonData) {
    return (
      <div className={styles.centerWrapper}>
        <NotFound />
      </div>
    );
  }

  return (
    <CommonContent
      common={commonData.common}
      governance={commonData.governance}
      isCommonMemberFetched={isCommonMemberFetched}
      commonMember={commonMember}
    />
  );
};

export default Common;
