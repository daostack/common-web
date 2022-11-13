import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SidenavContent from "./SidenavContent";

export default {
  component: SidenavContent,
} as ComponentMeta<typeof SidenavContent>;

const Template: ComponentStory<typeof SidenavContent> = (args) => (
  <SidenavContent {...args} />
);

export const Regular = Template.bind({});
Regular.parameters = {
  layout: "fullscreen",
};
Regular.decorators = [
  (Story) => (
    <div style={{ width: "18.75rem" }}>
      <Story />
    </div>
  ),
];
