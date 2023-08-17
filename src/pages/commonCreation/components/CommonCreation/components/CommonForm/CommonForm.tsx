import React, { FC, useCallback, useEffect, useRef } from "react";
import { useCommonCreation } from "@/pages/OldCommon/components/CommonListContainer/CreateCommonModal/useCases";
import { usePreventReload } from "@/shared/hooks";
import { Common, Governance } from "@/shared/models";
import { Loader, LoaderVariant } from "@/shared/ui-kit";
import {
  generateCreationForm,
  CreationFormRef,
  UnsavedChangesPrompt,
} from "../../../../components";
import { useCommonForm } from "../../../../hooks";
import { styles } from "../../../ProjectCreation/components/ProjectCreationForm";
import { CommonFormValues } from "./types";

interface CommonFormProps {
  onFinish: (createdCommon: { common: Common; governance: Governance }) => void;
  onCancel: () => void;
}

const CreationForm = generateCreationForm<CommonFormValues>();

const CommonForm: FC<CommonFormProps> = ({ onFinish, onCancel }) => {
  const formRef = useRef<CreationFormRef>(null);
  const {
    isCommonCreationLoading: isLoading,
    data: createdCommonData,
    error,
    createCommon,
  } = useCommonCreation();
  const { initialValues, formItems, onSubmit } = useCommonForm(createCommon);

  const shouldPreventReload = useCallback(
    () => (!createdCommonData?.common && formRef.current?.isDirty()) ?? true,
    [formRef, createdCommonData?.common],
  );

  const handleCreate = (values: CommonFormValues) => {
    if (!formRef.current?.isDirty()) {
      onCancel();
      return;
    }

    onSubmit(values);
  };

  usePreventReload(shouldPreventReload);

  useEffect(() => {
    if (createdCommonData) {
      onFinish(createdCommonData);
    }
  }, [createdCommonData]);

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
        onSubmit={handleCreate}
        items={formItems}
        submitButtonText="Create a common"
        disabled={isLoading}
        error={error}
        isCommonCreation
      />
      <UnsavedChangesPrompt shouldShowPrompt={shouldPreventReload} />
    </>
  );
};

export default CommonForm;
