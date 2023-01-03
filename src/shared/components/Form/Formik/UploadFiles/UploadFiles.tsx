import React, { FC } from "react";
import { useField } from "formik";
import {
  UploadFiles as BaseUploadFiles,
  UploadFilesProps as BaseUploadFilesProps,
} from "@/shared/ui-kit/UploadFiles";

interface UploadFilesProps extends BaseUploadFilesProps {
  name: string;
}

const UploadFiles: FC<UploadFilesProps> = (props) => {
  const { name, ...restProps } = props;
  const [{ value }, , { setValue }] = useField(name);

  return <BaseUploadFiles {...restProps} files={value} onChange={setValue} />;
};

export default UploadFiles;
