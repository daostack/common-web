import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCommonUpdate } from "@/pages/OldCommon/components/CommonListContainer/EditCommonModal/useCases";
import { ConfirmationModal } from "@/shared/components";
import { FeatureFlags } from "@/shared/constants";
import { usePreventReload } from "@/shared/hooks";
import {
  useGovernanceByCommonId,
  useNotionIntegration,
  useProjectCreation,
} from "@/shared/hooks/useCases";
import { useFeatureFlag } from "@/shared/hooks/useFeatureFlag";
import {
  Circles,
  Common,
  Governance,
  Project,
  Roles,
  SpaceAdvancedSettingsIntermediate,
} from "@/shared/models";
import {
  Loader,
  LoaderVariant,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit";
import {
  convertLinksToUploadFiles,
  getCirclesWithHighestTier,
} from "@/shared/utils";
import { projectsActions, selectCommonLayoutProjects } from "@/store/states";
import { generateCreationForm, CreationFormRef } from "../../../CreationForm";
import { UnsavedChangesPrompt } from "../UnsavedChangesPrompt";
import { getConfiguration } from "./configuration";
import { ProjectCreationFormValues } from "./types";
import styles from "./ProjectCreationForm.module.scss";
import { sortByTierDesc } from "@/shared/utils";

const NOTION_INTEGRATION_TOKEN_MASK = "************";

const CreationForm = generateCreationForm<ProjectCreationFormValues>();

interface ProjectCreationFormProps {
  rootCommonId: string;
  parentCommonId: string;
  parentCommonName?: string;
  parentGovernanceCircles: Circles;
  parentGovernanceId?: string;
  initialCommon?: Project;
  governance?: Governance | null;
  isEditing: boolean;
  onProjectCreated: (project: Common) => void;
  onFinish: (data: { project: Common; governance: Governance }) => void;
  onCancel: () => void;
}

const getInitialValues = (
  governanceCircles: Circles,
  initialCommon?: Project,
  roles?: Roles,
  advancedSettings?: SpaceAdvancedSettingsIntermediate,
): ProjectCreationFormValues => {
  const circlesWithHighestTier = getCirclesWithHighestTier(
    Object.values(governanceCircles),
  );
  const isNotionIntegrationEnabled = Boolean(initialCommon?.notion);

  return {
    projectImages: initialCommon?.image
      ? [
          {
            id: "space_image",
            title: "space_image",
            file: initialCommon.image,
          },
        ]
      : [],
    spaceName: initialCommon?.name || "",
    byline: initialCommon?.byline || "",
    description: parseStringToTextEditorValue(initialCommon?.description),
    videoUrl: initialCommon?.video?.value || "",
    gallery: initialCommon?.gallery
      ? convertLinksToUploadFiles(initialCommon.gallery)
      : [],
    links: initialCommon?.links || [{ title: "", value: "" }],
    highestCircleId:
      initialCommon?.directParent.circleId ||
      circlesWithHighestTier[0]?.id ||
      "",
    roles: roles || [],
    notion: {
      isEnabled: isNotionIntegrationEnabled,
      databaseId: initialCommon?.notion?.databaseId || "",
      token: isNotionIntegrationEnabled ? NOTION_INTEGRATION_TOKEN_MASK : "",
    },
    advancedSettings: advancedSettings,
    initialAdvancedSettings: advancedSettings,
    listVisibility: initialCommon?.listVisibility,
  };
};

const ProjectCreationForm: FC<ProjectCreationFormProps> = (props) => {
  const {
    rootCommonId,
    parentCommonId,
    parentCommonName,
    parentGovernanceCircles,
    parentGovernanceId,
    initialCommon,
    governance,
    isEditing,
    onProjectCreated,
    onFinish,
    onCancel,
  } = props;
  const dispatch = useDispatch();
  const projects = useSelector(selectCommonLayoutProjects);
  const formRef = useRef<CreationFormRef>(null);
  const { data: rootGovernance, fetchGovernance: fetchRootGovernance } =
    useGovernanceByCommonId();
  const isParentIsRoot = initialCommon
    ? initialCommon?.directParent.commonId === initialCommon?.rootCommonId
    : parentCommonId === rootCommonId;
  const {
    isProjectCreationLoading,
    project,
    error: createProjectError,
    createProject,
  } = useProjectCreation();
  const {
    isCommonUpdateLoading,
    common: updatedProject,
    error: updateProjectError,
    updateCommon: updateProject,
  } = useCommonUpdate(initialCommon?.id);
  const {
    data: notionIntegration,
    loading: isNotionIntegrationLoading,
    isNotionIntegrationUpdated,
    notionIntegrationErrorModalState,
    disconnectNotionModalState,
    fetchNotionIntegration,
    setNotionIntegrationFormData,
  } = useNotionIntegration({
    projectId: project?.id || updatedProject?.id,
    isNotionIntegrationEnabled: Boolean(initialCommon?.notion),
  });
  const featureFlags = useFeatureFlag();
  const isAdvancedSettingsEnabled = featureFlags?.get(
    FeatureFlags.AdvancedSettings,
  );
  const isLoading =
    isProjectCreationLoading ||
    (project && !governance) ||
    isCommonUpdateLoading ||
    isNotionIntegrationLoading;
  const error = createProjectError || updateProjectError;

  useEffect(() => {
    if (initialCommon?.id) {
      fetchNotionIntegration(initialCommon.id);
    }
  }, [initialCommon?.id]);

  const parentCommonRoles = useMemo<Roles>(
    () =>
      Object.values(parentGovernanceCircles || {}).map((circle) => ({
        circleId: circle.id,
        circleName: circle.name,
        tier: circle.hierarchy?.tier,
        derivedFrom: circle.derivedFrom,
      })),
    [parentGovernanceCircles],
  );
  const rootCommonRoles = useMemo<Roles>(
    () =>
      isParentIsRoot
        ? parentCommonRoles
        : Object.values(rootGovernance?.circles || {}).map((circle) => ({
            circleId: circle.id,
            circleName: circle.name,
            tier: circle.hierarchy?.tier,
            derivedFrom: circle.derivedFrom,
          })),
    [isParentIsRoot, parentCommonRoles, rootGovernance?.circles],
  );

  const advancedSettings: SpaceAdvancedSettingsIntermediate = useMemo(() => {
    const initialCircles = Object.values(governance?.circles || {});

    const sortedRootCommonRoles = sortByTierDesc(rootCommonRoles);

    const sortedParentCommonRoles = sortByTierDesc(parentCommonRoles);

    const circlesWithInheritRoles = sortedRootCommonRoles.map((rootCommonRole, index) => {
      const initialCircle = initialCircles.find(
        (circle) => circle.derivedFrom?.circleId === rootCommonRole.circleId,
      );

      const isSelected = Boolean(!isEditing || initialCircle);
      const roleForInheritance =
      sortedParentCommonRoles.slice(0,2).find(
          (parentRole) => parentRole.circleId === initialCircle?.inheritFrom?.circleId,
        ) || sortedParentCommonRoles[index];


      return {
        circleId: rootCommonRole.circleId,
        circleName: `${rootCommonRole.circleName}s`,
        selected: isSelected,
        synced: Boolean(
          isEditing ? initialCircle?.inheritGovernanceId : roleForInheritance ? true : false,
        ),
        ...(parentGovernanceId &&
          roleForInheritance && {
            inheritFrom: {
              governanceId: parentGovernanceId,
              circleId: roleForInheritance.circleId,
              circleName: `${roleForInheritance.circleName}s`,
              tier: roleForInheritance.tier,
            },
          }),
      };
    });

    return {
      permissionGovernanceId: isParentIsRoot
        ? parentGovernanceId
        : rootGovernance?.id,
      circles: circlesWithInheritRoles.reverse(),
    };
  }, [
    rootGovernance?.id,
    parentGovernanceId,
    rootCommonRoles,
    isParentIsRoot,
    parentCommonRoles,
    governance?.circles,
    isEditing,
  ]);

  const initialValues = useMemo(
    () =>
      getInitialValues(
        parentGovernanceCircles,
        initialCommon,
        parentCommonRoles,
        advancedSettings,
      ),
    [parentGovernanceCircles, parentCommonRoles, advancedSettings],
  );

  /**
   * Existing projects names under the same direct parent only.
   */
  const existingProjectsNames = projects
    .filter((project) => project.directParent?.commonId === parentCommonId)
    .map((project) => project?.name)
    .filter((spaceName) => spaceName !== initialValues?.spaceName);

  const shouldPreventReload = useCallback(
    () => (!project && !updatedProject && formRef.current?.isDirty()) ?? true,
    [formRef, project, updatedProject],
  );

  const handleProjectCreate = (values: ProjectCreationFormValues) => {
    setNotionIntegrationFormData(values.notion);
    createProject(parentCommonId, values, isAdvancedSettingsEnabled);
  };

  const handleProjectUpdate = (values: ProjectCreationFormValues) => {
    if (!formRef.current?.isDirty()) {
      onCancel();
      return;
    }

    const [image] = values.projectImages;

    setNotionIntegrationFormData(values.notion);
    updateProject({
      ...values,
      image,
      name: values.spaceName,
    });
  };

  usePreventReload(shouldPreventReload);

  useEffect(() => {
    dispatch(projectsActions.setIsCommonCreationDisabled(true));

    return () => {
      dispatch(projectsActions.setIsCommonCreationDisabled(false));
    };
  }, []);

  useEffect(() => {
    if (rootCommonId) {
      fetchRootGovernance(rootCommonId);
    }
  }, [rootCommonId]);

  useEffect(() => {
    if (project) {
      onProjectCreated(project);
    }
  }, [project?.id]);

  useEffect(() => {
    const finalProject = project || updatedProject;

    if (finalProject && governance && isNotionIntegrationUpdated) {
      onFinish({
        project: finalProject,
        governance,
      });
    }
  }, [project, updatedProject, governance, isNotionIntegrationUpdated]);

  return (
    <>
      {isLoading && (
        <Loader
          overlayClassName={styles.globalLoader}
          variant={LoaderVariant.Global}
        />
      )}
      <CreationForm
        ref={formRef}
        initialValues={initialValues}
        onSubmit={isEditing ? handleProjectUpdate : handleProjectCreate}
        items={getConfiguration({
          isProject: true,
          governanceId: initialCommon?.governanceId,
          governanceCircles: governance?.circles,
          roles: parentCommonRoles,
          notionIntegration,
          advancedSettings,
          parentCommonName,
          shouldBeUnique: {
            existingNames: existingProjectsNames,
          },
          isEditing,
          featureFlags,
        })}
        submitButtonText={isEditing ? "Save changes" : "Create Space"}
        disabled={isLoading}
        error={error}
      />
      <UnsavedChangesPrompt shouldShowPrompt={shouldPreventReload} />
      <ConfirmationModal
        isShowing={notionIntegrationErrorModalState.isShowing}
        title="Notion integration error"
        confirmText="Okay"
        onClose={notionIntegrationErrorModalState.onClose}
        onConfirm={notionIntegrationErrorModalState.onConfirm}
      >
        Oops, our attempt to integrate the space with Notion hit a bump. Recheck
        your settings, and don't hesitate to ask for help if needed!
      </ConfirmationModal>
      <ConfirmationModal
        isShowing={disconnectNotionModalState.isShowing}
        title="Disconnect Notion"
        confirmText="Yes, I'm sure"
        closeText="Cancel"
        onClose={disconnectNotionModalState.onClose}
        onConfirm={disconnectNotionModalState.onConfirm}
      >
        Are you sure you want to remove the Notion integration?
      </ConfirmationModal>
    </>
  );
};

export default ProjectCreationForm;
