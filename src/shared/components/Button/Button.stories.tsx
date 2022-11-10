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

export const Primary = Template.bind({});
Primary.args = {
  children: "Primary",
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: ButtonVariant.Secondary,
  children: "Secondary",
};

export const SecondaryPurple = Template.bind({});
SecondaryPurple.args = {
  variant: ButtonVariant.SecondaryPurple,
  children: "Secondary Purple",
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  children: "Disabled",
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  shouldUseFullWidth: true,
  children: "Full Width",
};

export const Shadowed = Template.bind({});
Shadowed.args = {
  shadowed: true,
  children: "Shadowed",
};
