import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BoldMarkIcon, ListMarkIcon } from "@/shared/icons";
import ToolbarButton from "./ToolbarButton";

export default {
  title: "TextEditor/Toolbar Button",
  component: ToolbarButton,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onClick: {
      action: "clicked",
    },
  },
} as ComponentMeta<typeof ToolbarButton>;

const Template: ComponentStory<typeof ToolbarButton> = (args) => (
  <ToolbarButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: <BoldMarkIcon />,
};

export const Active = Template.bind({});
Active.args = {
  active: true,
  children: <ListMarkIcon />,
};
