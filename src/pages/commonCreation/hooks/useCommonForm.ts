import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  IntermediateCreateCommonData,
  IntermediateUpdateCommonData,
} from "@/pages/OldCommon/interfaces";
import { Common } from "@/shared/models";
import { parseStringToTextEditorValue } from "@/shared/ui-kit";
import { convertLinksToUploadFiles } from "@/shared/utils";
import { projectsActions } from "@/store/states";
import { CommonFormValues, CreationFormItem } from "../components";
import { getConfiguration } from "../components/ProjectCreation/components";

interface Return {
  initialValues: CommonFormValues;
  formItems: CreationFormItem[];
  onSubmit: (values: CommonFormValues) => void;
}

const CONFIGURATION: CreationFormItem[] = getConfiguration(false);
const getInitialValues = (common?: Common): CommonFormValues => {
  return {
    projectImages: common?.image
      ? [
          {
            id: "common_image",
            title: "common_image",
            file: common.image,
          },
        ]
      : [],
    spaceName: common?.name || "",
    byline: common?.byline || "",
    description: parseStringToTextEditorValue(common?.description),
    videoUrl: common?.video?.value || "",
    gallery: common?.gallery ? convertLinksToUploadFiles(common.gallery) : [],
    links: common?.links || [],
  };
};

export const useCommonForm = (
  handleSubmit: (
    commonData: IntermediateUpdateCommonData | IntermediateCreateCommonData,
  ) => Promise<void>,
  common?: Common,
): Return => {
  const dispatch = useDispatch();
  const initialValues: CommonFormValues = useMemo(
    () => getInitialValues(common),
    [],
  );

  useEffect(() => {
    dispatch(projectsActions.setIsCommonCreationDisabled(true));

    return () => {
      dispatch(projectsActions.setIsCommonCreationDisabled(false));
    };
  }, []);

  const onSubmit = (values: CommonFormValues): void => {
    const [image] = values.projectImages;

    if (!image) {
      return;
    }

    handleSubmit({
      ...values,
      image,
      name: values.spaceName,
    });
  };

  return {
    initialValues,
    onSubmit,
    formItems: CONFIGURATION,
  };
};
