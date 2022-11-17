import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Button, { ButtonVariant } from "./Button";

export default {
  component: Button,
  argTypes: {
    onClick: {
      action: "clicked",
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const OutlineBlue = Template.bind({});
OutlineBlue.args = {
  variant: ButtonVariant.OutlineBlue,
  children: "Button Label",
};

export const OutlineBlueDisabled = Template.bind({});
OutlineBlueDisabled.args = {
  variant: ButtonVariant.OutlineBlue,
  children: "Button Label",
  disabled: true,
};
