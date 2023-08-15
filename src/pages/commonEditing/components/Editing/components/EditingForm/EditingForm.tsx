import React, { FC, useCallback, useEffect, useRef } from "react";
import { useCommonUpdate } from "@/pages/OldCommon/components/CommonListContainer/EditCommonModal/useCases";
import {
  generateCreationForm,
  CreationFormRef,
  UnsavedChangesPrompt,
} from "@/pages/commonCreation/components";
import { CommonFormValues } from "@/pages/commonCreation/components/CommonCreation";
import { styles } from "@/pages/commonCreation/components/ProjectCreation/components/ProjectCreationForm";
import { useCommonForm } from "@/pages/commonCreation/hooks";
import { usePreventReload } from "@/shared/hooks";
import { Common } from "@/shared/models";
import { Loader, LoaderVariant } from "@/shared/ui-kit";

const CreationForm = generateCreationForm<CommonFormValues>();

interface EditingFormProps {
  common: Common;
  onFinish: (updatedCommon: Common) => void;
  onCancel: () => void;
}

const EditingForm: FC<EditingFormProps> = (props) => {
  const { common, onFinish, onCancel } = props;
  const formRef = useRef<CreationFormRef>(null);
  const {
    isCommonUpdateLoading: isLoading,
    common: updatedCommon,
    error,
    updateCommon,
  } = useCommonUpdate(common.id);
  const { initialValues, formItems, onSubmit } = useCommonForm(
    updateCommon,
    common,
  );

  const shouldPreventReload = useCallback(
    () => (!updatedCommon && formRef.current?.isDirty()) ?? true,
    [formRef, updatedCommon],
  );

  const handleUpdate = (values: CommonFormValues) => {
    if (!formRef.current?.isDirty()) {
      onCancel();
      return;
    }

    onSubmit(values);
  };

  usePreventReload(shouldPreventReload);

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
        items={formItems}
        submitButtonText="Save changes"
        disabled={isLoading}
        error={error}
      />
      <UnsavedChangesPrompt shouldShowPrompt={shouldPreventReload} />
    </>
  );
};

export default EditingForm;
