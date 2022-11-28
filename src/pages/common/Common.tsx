import React, { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFullCommonData } from "@/shared/hooks/useCases";
import styles from "./Common.module.scss";

interface CommonRouterParams {
  id: string;
}

const Common: FC = () => {
  const { id: commonId } = useParams<CommonRouterParams>();
  const { data, loading, fetched, fetchCommonData, resetCommonData } =
    useFullCommonData();
  const isDataEmpty = data === null;

  useEffect(() => {
    if (!isDataEmpty) {
      resetCommonData();
    }

    fetchCommonData(commonId);
  }, [commonId]);

  return <div>Common</div>;
};

export default Common;
