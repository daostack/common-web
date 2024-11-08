import React, { FC, useMemo } from "react";
import classNames from "classnames";
import { useCommonDataContext } from "@/pages/common/providers";
import {
  GovernanceActions,
  ViewportBreakpointVariant,
} from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { useProjectsData } from "@/shared/hooks/useProjectsData";
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
  const { getCommonPagePath } = useRoutesContext();
  const { onProjectCreate } = useCommonDataContext();
  const { data: projectsWithAdditionalData } = useProjectsData({
    commons: subCommons,
  });
  const isTabletView = useIsTabletView();
  const isAddingNewProjectAllowed = Boolean(
    commonMember &&
      hasPermission({
        commonMember,
        governance: { circles },
        action: GovernanceActions.CREATE_PROJECT,
      }),
  );

  const availableProjects = useMemo(
    () =>
      projectsWithAdditionalData?.filter((project) => project.hasAccessToSpace),
    [projectsWithAdditionalData],
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
        Spaces
      </Container>
      <ul
        className={classNames(
          styles.projectsWrapper,
          outerStyles?.projectsWrapper,
        )}
      >
        {availableProjects?.map((subCommon) => (
          <li key={subCommon.id} className={styles.projectsItem}>
            <Project
              title={subCommon.name}
              url={getCommonPagePath(subCommon.id)}
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
