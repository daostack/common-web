import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PlusIcon } from "@/shared/icons";
import { ButtonVariant } from "../Button";
import ButtonIcon from "./ButtonIcon";

export default {
  component: ButtonIcon,
  argTypes: {
    onClick: {
      action: "clicked",
    },
  },
} as ComponentMeta<typeof ButtonIcon>;

const Template: ComponentStory<typeof ButtonIcon> = (args) => (
  <div className="sb-flex-column sb-align-start sb-w-max-content sb-items-mb-2">
    <ButtonIcon {...args} />
    <ButtonIcon {...args} disabled />
    <ButtonIcon {...args} visuallyDisabled />
  </div>
);

export const OutlineBlue = Template.bind({});
OutlineBlue.args = {
  variant: ButtonVariant.OutlineBlue,
  children: <PlusIcon />,
};
