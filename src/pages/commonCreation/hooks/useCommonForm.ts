import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  IntermediateCreateCommonData,
  IntermediateUpdateCommonData,
} from "@/pages/OldCommon/interfaces";
import { Common, Roles } from "@/shared/models";
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

const getInitialValues = (common?: Common, roles?: Roles): CommonFormValues => {
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
    roles: roles || [],
  };
};

export const useCommonForm = (
  handleSubmit: (
    commonData: IntermediateUpdateCommonData | IntermediateCreateCommonData,
  ) => Promise<void>,
  common?: Common,
  roles?: Roles,
): Return => {
  const dispatch = useDispatch();
  const initialValues: CommonFormValues = useMemo(
    () => getInitialValues(common, roles),
    [common, roles],
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
    formItems: getConfiguration({
      isProject: false,
      roles,
      isImageRequired: true,
    }),
  };
};
