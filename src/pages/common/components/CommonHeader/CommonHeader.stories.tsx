import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { formatPrice } from "@/shared/utils";
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

export const WithFullInfo = Template.bind({});
WithFullInfo.args = {
  commonSrc:
    "https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_01.png?alt=media",
  commonName: "CleanAir",
  description: "If you wanna save the Amazon, own it.",
  details: [
    {
      id: "available-funds",
      name: "Available Funds",
      value: formatPrice(142100, { shouldMillify: false }),
    },
    {
      id: "members",
      name: "Members",
      value: "182",
    },
  ],
};

export const ForProject = Template.bind({});
ForProject.args = {
  ...WithFullInfo.args,
  isProject: true,
};

export const WithChangedJoinButtonText = Template.bind({});
WithChangedJoinButtonText.args = {
  ...WithFullInfo.args,
  joinButtonText: "Join the project",
};

export const WithoutJoinButton = Template.bind({});
WithoutJoinButton.args = {
  ...WithFullInfo.args,
  withJoin: false,
};

export const WithoutDetails = Template.bind({});
WithoutDetails.args = {
  ...WithFullInfo.args,
  details: [],
};
