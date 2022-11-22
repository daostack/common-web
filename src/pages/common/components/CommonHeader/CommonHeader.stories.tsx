import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import CommonHeader from "./CommonHeader";

export default {
  title: "Common/Common Header",
  component: CommonHeader,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof CommonHeader>;

const Template: ComponentStory<typeof CommonHeader> = (args) => (
  <CommonHeader {...args} />
);

export const Regular = Template.bind({});
Regular.args = {
  commonSrc:
    "https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_01.png?alt=media",
  commonName: "CleanAir",
  description: "If you wanna save the Amazon, own it.",
};
