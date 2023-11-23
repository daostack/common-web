import React, { FC } from "react";
import ContentLoader from "react-content-loader";
import { ThemeColors } from "@/shared/constants";
import useThemeColor from "@/shared/hooks/useThemeColor";
import { Separator } from "../Separator";
import styles from "./LoadingBreadcrumbsItem.module.scss";

const LoadingBreadcrumbsItem: FC = (props) => {
  const { getThemeColor } = useThemeColor();

  return (
    <li className={styles.container}>
      <ContentLoader
        speed={2}
        width={296}
        height={22}
        viewBox="0 0 296 22"
        backgroundColor={getThemeColor(ThemeColors.primaryBackground)}
        foregroundColor={getThemeColor(ThemeColors.secondaryBackground)}
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
