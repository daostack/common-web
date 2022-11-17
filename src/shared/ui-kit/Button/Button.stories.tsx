import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
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
  </div>
);

export const OutlineBlue = Template.bind({});
OutlineBlue.args = {
  variant: ButtonVariant.OutlineBlue,
  children: "Button Label",
};
