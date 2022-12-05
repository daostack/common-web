import React, { FC } from "react";
import { ROUTE_PATHS, ViewportBreakpointVariant } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { PlusIcon } from "@/shared/icons";
import { Common } from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { CommonCard } from "../../../../../CommonCard";
import { Project } from "./components";
import styles from "./CommonProjects.module.scss";

interface CommonProjectsProps {
  subCommons: Common[];
}

const CommonProjects: FC<CommonProjectsProps> = (props) => {
  const { subCommons } = props;
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
        <h3 className={styles.title}>Projects</h3>
        <ul className={styles.projectsWrapper}>
          {subCommons.map((subCommon) => (
            <li key={subCommon.id} className={styles.projectsItem}>
              <Project
                title={subCommon.name}
                description={subCommon.byline}
                url={ROUTE_PATHS.COMMON.replace(":id", subCommon.id)}
                imageURL={subCommon.image}
                imageAlt={`${subCommon.name}'s image`}
              />
            </li>
          ))}
          {!isTabletView && (
            <li className={styles.projectsItem}>
              <Project
                title="Add new project"
                icon={<PlusIcon className={styles.plusIcon} />}
              />
            </li>
          )}
        </ul>
      </CommonCard>
    </Container>
  );
};

export default CommonProjects;
