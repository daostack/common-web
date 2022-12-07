import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Tooltip from "./Tooltip";
import { TooltipContent, TooltipTrigger } from "./components";

export default {
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => (
  <Tooltip {...args}>
    <TooltipTrigger>Trigger</TooltipTrigger>
    <TooltipContent>{args.children}</TooltipContent>
  </Tooltip>
);

export const Default = Template.bind({});
Default.args = {
  children: "Content",
};

export const WithLongContent = Template.bind({});
WithLongContent.args = {
  children: (
    <div style={{ maxWidth: "320px" }}>
      <span>
        Adding a new project is reserved for members of the Leaders circle.
      </span>
      <br />
      <span>
        You can check the Governance page to learn more about the structure and
        permissions in this common.
      </span>
    </div>
  ),
};

export const Controlled = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger onClick={() => setIsOpen((v) => !v)}>
          Trigger
        </TooltipTrigger>
        <TooltipContent>Controlled Content</TooltipContent>
      </Tooltip>
    </div>
  );
};
