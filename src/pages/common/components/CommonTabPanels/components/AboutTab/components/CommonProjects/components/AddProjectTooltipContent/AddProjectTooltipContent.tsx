import React, { FC } from "react";
import { GovernanceActions } from "@/shared/constants";
import { Governance } from "@/shared/models";
import { getCirclesWithLowestTier } from "@/shared/utils";

interface AddProjectTooltipContentProps {
  circles: Governance["circles"];
}

const AddProjectTooltipContent: FC<AddProjectTooltipContentProps> = (props) => {
  const { circles } = props;
  const circlesWithPermissionToAddNewProject = getCirclesWithLowestTier(
    Object.values(circles).filter(
      (circle) => circle.allowedActions[GovernanceActions.CREATE_SUBCOMMON],
    ),
  );
  const circleNames = circlesWithPermissionToAddNewProject
    .map((circle) => circle.name)
    .join(", ");

  if (!circleNames) {
    return null;
  }

  return (
    <>
      Adding a new space is reserved for members of the {circleNames} circle
      {circlesWithPermissionToAddNewProject.length > 1 ? "s" : ""}
      .
      <br />
      You can check the Governance page to learn more about the structure and
      permissions in this common.
    </>
  );
};

export default AddProjectTooltipContent;
