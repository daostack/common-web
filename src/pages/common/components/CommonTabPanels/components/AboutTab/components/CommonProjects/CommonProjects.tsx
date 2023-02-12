import React, { FC } from "react";
import classNames from "classnames";
import { useCommonDataContext } from "@/pages/common/providers";
import {
  GovernanceActions,
  ROUTE_PATHS,
  ViewportBreakpointVariant,
} from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { hasPermission } from "@/shared/utils";
import { CommonCard } from "../../../../../CommonCard";
import {
  AddProjectButton,
  AddProjectTooltipContent,
  Project,
  ProjectTooltipContent,
} from "./components";
import styles from "./CommonProjects.module.scss";

interface CommonProjectsStyles {
  projectsWrapper?: string;
}

interface CommonProjectsProps {
  className?: string;
  commonMember: (CommonMember & CirclesPermissions) | null;
  subCommons: Common[];
  circles: Governance["circles"];
  styles?: CommonProjectsStyles;
}

const CommonProjects: FC<CommonProjectsProps> = (props) => {
  const {
    className,
    commonMember,
    subCommons,
    circles,
    styles: outerStyles,
  } = props;
  const { onProjectCreate } = useCommonDataContext();
  const isTabletView = useIsTabletView();
  const isAddingNewProjectAllowed = Boolean(
    commonMember &&
      hasPermission({
        commonMember,
        governance: { circles },
        key: GovernanceActions.CREATE_PROJECT,
      }),
  );

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
              url={ROUTE_PATHS.COMMON.replace(":id", subCommon.id)}
              imageURL={subCommon.image}
              imageAlt={`${subCommon.name}'s image`}
              tooltipContent={
                !isTabletView ? (
                  <ProjectTooltipContent
                    title={subCommon.name}
                    description={subCommon.byline}
                  />
                ) : null
              }
            />
          </li>
        ))}
        {!isTabletView && (
          <li className={styles.projectsItem}>
            <AddProjectButton
              disabled={!isAddingNewProjectAllowed}
              tooltipContent={
                !isAddingNewProjectAllowed ? (
                  <AddProjectTooltipContent circles={circles} />
                ) : null
              }
              onClick={onProjectCreate}
            />
          </li>
        )}
      </ul>
    </CommonCard>
  );
};

export default CommonProjects;
