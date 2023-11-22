import React, { FC } from "react";
import ContentLoader from "react-content-loader";
import { useSelector } from "react-redux";
import { Theme } from "@/shared/constants";
import { selectTheme } from "@/shared/store/selectors";
import { Separator } from "../Separator";
import styles from "./LoadingBreadcrumbsItem.module.scss";

const LoadingBreadcrumbsItem: FC = (props) => {
  const theme = useSelector(selectTheme);

  const backgroundColor = theme === Theme.Light ? "#f3f3f3" : "#1f2535";
  const foregroundColor = theme === Theme.Light ? "#ecebeb" : "#2e3452";

  return (
    <li className={styles.container}>
      <ContentLoader
        speed={2}
        width={296}
        height={22}
        viewBox="0 0 296 22"
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
        {...props}
      >
        <rect x="0" y="0" rx="4" ry="4" width="120" height="22" />
        <rect x="176" y="0" rx="4" ry="4" width="120" height="22" />
      </ContentLoader>
      <Separator className={styles.separator} withoutContainer />
    </li>
  );
};

export default LoadingBreadcrumbsItem;
