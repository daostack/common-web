import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { Image } from "@/shared/components";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Common } from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { CommonCard } from "../../../../../CommonCard";
import styles from "./CommonParent.module.scss";

interface CommonParentProps {
  parentCommon: Common;
  projectsAmountInParentCommon: number;
}

const CommonParent: FC<CommonParentProps> = (props) => {
  const { parentCommon, projectsAmountInParentCommon } = props;
  const { getCommonPagePath } = useRoutesContext();
  const isTabletView = useIsTabletView();

  return (
    <Container
      viewports={[
        ViewportBreakpointVariant.Tablet,
        ViewportBreakpointVariant.PhoneOriented,
        ViewportBreakpointVariant.Phone,
      ]}
    >
      <CommonCard className={styles.container} hideCardStyles={isTabletView}>
        <h3 className={styles.title}>Common</h3>
        <div className={styles.contentWrapper}>
          <Image
            className={styles.commonImage}
            src={parentCommon.image}
            alt={`${parentCommon.name}'s image`}
            placeholderElement={null}
          />
          <div className={styles.commonInfo}>
            <p className={styles.commonName}>{parentCommon.name}</p>
            {styles.commonDescription && (
              <p className={styles.commonDescription}>{parentCommon.byline}</p>
            )}
            <NavLink
              className={styles.commonLink}
              to={getCommonPagePath(parentCommon.id)}
            >
              {projectsAmountInParentCommon} Space
              {projectsAmountInParentCommon === 1 ? "" : "s"}
            </NavLink>
          </div>
        </div>
      </CommonCard>
    </Container>
  );
};

export default CommonParent;
