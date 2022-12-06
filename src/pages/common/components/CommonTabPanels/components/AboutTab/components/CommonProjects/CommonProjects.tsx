import React, { FC } from "react";
import classNames from "classnames";
import { ROUTE_PATHS, ViewportBreakpointVariant } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { PlusIcon } from "@/shared/icons";
import { Common } from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { CommonCard } from "../../../../../CommonCard";
import { Project } from "./components";
import styles from "./CommonProjects.module.scss";

interface CommonProjectsStyles {
  projectsWrapper?: string;
}

interface CommonProjectsProps {
  className?: string;
  subCommons: Common[];
  styles?: CommonProjectsStyles;
}

const CommonProjects: FC<CommonProjectsProps> = (props) => {
  const { className, subCommons, styles: outerStyles } = props;
  const isTabletView = useIsTabletView();

  return (
    <CommonCard
      className={classNames(styles.container, className)}
      hideCardStyles={isTabletView}
    >
      <Container
        className={styles.title}
        tag="h3"
        viewports={[
          ViewportBreakpointVariant.Tablet,
          ViewportBreakpointVariant.PhoneOriented,
          ViewportBreakpointVariant.Phone,
        ]}
      >
        Projects
      </Container>
      <ul
        className={classNames(
          styles.projectsWrapper,
          outerStyles?.projectsWrapper,
        )}
      >
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
  );
};

export default CommonProjects;
