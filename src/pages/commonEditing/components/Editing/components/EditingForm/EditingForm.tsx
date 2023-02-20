import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { useCommonUpdate } from "@/pages/OldCommon/components/CommonListContainer/EditCommonModal/useCases";
import {
  generateCreationForm,
  CreationFormRef,
  UnsavedChangesPrompt,
} from "@/pages/commonCreation/components";
import {
  CONFIGURATION,
  styles,
} from "@/pages/commonCreation/components/ProjectCreation/components/ProjectCreationForm";
import { usePreventReload } from "@/shared/hooks";
import { Common } from "@/shared/models";
import {
  Loader,
  LoaderVariant,
  parseStringToTextEditorValue,
} from "@/shared/ui-kit";
import { convertLinksToUploadFiles } from "@/shared/utils";
import { projectsActions } from "@/store/states";
import { EditingFormValues } from "./types";

const CreationForm = generateCreationForm<EditingFormValues>();

interface EditingFormProps {
  common: Common;
  onFinish: (updatedCommon: Common) => void;
  onCancel: () => void;
}

const getInitialValues = (common: Common): EditingFormValues => {
  return {
    projectImages: [
      {
        id: "common_image",
        title: "common_image",
        file: common.image,
      },
    ],
    projectName: common.name,
    byline: common.byline || "",
    description: parseStringToTextEditorValue(common.description),
    videoUrl: common.video?.value || "",
    gallery: common.gallery ? convertLinksToUploadFiles(common.gallery) : [],
    links: common.links || [{ title: "", value: "" }],
  };
};

const EditingForm: FC<EditingFormProps> = (props) => {
  const { common, onFinish, onCancel } = props;
  const dispatch = useDispatch();
  const formRef = useRef<CreationFormRef>(null);
  const {
    isCommonUpdateLoading: isLoading,
    common: updatedCommon,
    error,
    updateCommon,
  } = useCommonUpdate(common.id);
  const initialValues = useMemo(() => getInitialValues(common), []);

  const shouldPreventReload = useCallback(
    () => (!updatedCommon && formRef.current?.isDirty()) ?? true,
    [formRef, updatedCommon],
  );

  const handleUpdate = (values: EditingFormValues) => {
    if (!formRef.current?.isDirty()) {
      onCancel();
      return;
    }

    const [image] = values.projectImages;

    if (!image) {
      return;
    }

    updateCommon({
      ...values,
      image,
      name: values.projectName,
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
    if (updatedCommon) {
      onFinish(updatedCommon);
    }
  }, [updatedCommon]);

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
        onSubmit={handleUpdate}
        items={CONFIGURATION}
        submitButtonText="Save changes"
        disabled={isLoading}
        error={error}
      />
      <UnsavedChangesPrompt shouldShowPrompt={shouldPreventReload} />
    </>
  );
};

export default EditingForm;
