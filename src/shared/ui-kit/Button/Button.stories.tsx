import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BoldPlusIcon } from "@/shared/icons";
import Button, { ButtonVariant, ButtonSize } from "./Button";

export default {
  component: Button,
  argTypes: {
    onClick: {
      action: "clicked",
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <div className="sb-flex-column sb-align-start sb-w-max-content sb-items-mb-2">
    <Button {...args} size={ButtonSize.Large} />
    <Button {...args} size={ButtonSize.Medium} />
    <Button {...args} size={ButtonSize.Small} />
    <Button {...args} size={ButtonSize.Xsmall} />
    <Button {...args} disabled size={ButtonSize.Large} />
    <Button {...args} disabled size={ButtonSize.Medium} />
    <Button {...args} disabled size={ButtonSize.Small} />
    <Button {...args} disabled size={ButtonSize.Xsmall} />
    <Button {...args} visuallyDisabled size={ButtonSize.Large}>
      Visually Disabled
    </Button>
    <Button {...args} visuallyDisabled size={ButtonSize.Medium}>
      Visually Disabled
    </Button>
    <Button {...args} visuallyDisabled size={ButtonSize.Small}>
      Visually Disabled
    </Button>
    <Button {...args} visuallyDisabled size={ButtonSize.Xsmall}>
      Visually Disabled
    </Button>
  </div>
);

export const PrimaryGray = Template.bind({});
PrimaryGray.args = {
  variant: ButtonVariant.PrimaryGray,
  children: "Button Label",
};

export const PrimaryPurple = Template.bind({});
PrimaryPurple.args = {
  variant: ButtonVariant.PrimaryPurple,
  children: "Button Label",
};

export const OutlineBlue = Template.bind({});
OutlineBlue.args = {
  variant: ButtonVariant.OutlineBlue,
  children: "Button Label",
};

export const OutlinePink = Template.bind({});
OutlinePink.args = {
  variant: ButtonVariant.OutlinePink,
  children: "Button Label",
};

export const LightPurple = Template.bind({});
LightPurple.args = {
  variant: ButtonVariant.LightPurple,
  children: "Button Label",
};

export const OutlineBlueWithIcon = Template.bind({});
OutlineBlueWithIcon.args = {
  variant: ButtonVariant.OutlineBlue,
  leftIcon: <BoldPlusIcon />,
  children: "Button Label",
};

export const OutlinePinkWithIcon = Template.bind({});
OutlinePinkWithIcon.args = {
  variant: ButtonVariant.OutlinePink,
  leftIcon: <BoldPlusIcon />,
  children: "Button Label",
};

export const Loader = Template.bind({});
Loader.args = {
  loading: true,
  children: "Button Label",
};
