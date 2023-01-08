import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { UploadFile } from "@/shared/interfaces";
import UploadFilesComponent from "./UploadFiles";

export default {
  title: "Upload Files",
  component: UploadFilesComponent,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof UploadFilesComponent>;

const Template: ComponentStory<typeof UploadFilesComponent> = (args) => {
  const [files, setFiles] = useState<UploadFile[]>([]);

  return <UploadFilesComponent {...args} files={files} onChange={setFiles} />;
};

export const UploadFiles = Template.bind({});
