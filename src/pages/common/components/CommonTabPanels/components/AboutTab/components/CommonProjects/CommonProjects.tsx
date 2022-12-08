import React, { FC } from "react";
import classNames from "classnames";
import {
  GovernanceActions,
  ROUTE_PATHS,
  ViewportBreakpointVariant,
} from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Common, Governance } from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { getCirclesWithLowestTier } from "@/shared/utils";
import { CommonCard } from "../../../../../CommonCard";
import { AddProjectButton, Project } from "./components";
import styles from "./CommonProjects.module.scss";

interface CommonProjectsStyles {
  projectsWrapper?: string;
}

interface CommonProjectsProps {
  className?: string;
  subCommons: Common[];
  circles: Governance["circles"];
  styles?: CommonProjectsStyles;
}

const CommonProjects: FC<CommonProjectsProps> = (props) => {
  const { className, subCommons, circles, styles: outerStyles } = props;
  const isTabletView = useIsTabletView();
  const circlesWithPermissionToAddNewProject = getCirclesWithLowestTier(
    Object.values(circles).filter(
      (circle) => circle.allowedActions[GovernanceActions.CREATE_SUBCOMMON],
    ),
  );
  const circleNames = circlesWithPermissionToAddNewProject
    .map((circle) => circle.name)
    .join(", ");
  const isAddingNewProjectAllowed = false;

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
            <AddProjectButton
              visuallyDisabled={!isAddingNewProjectAllowed}
              tooltipContent={
                !isAddingNewProjectAllowed && circleNames ? (
                  <>
                    Adding a new project is reserved for members of the{" "}
                    {circleNames} circle
                    {circlesWithPermissionToAddNewProject.length > 1 ? "s" : ""}
                    .
                    <br />
                    You can check the Governance page to learn more about the
                    structure and permissions in this common.
                  </>
                ) : null
              }
            />
          </li>
        )}
      </ul>
    </CommonCard>
  );
};

export default CommonProjects;
