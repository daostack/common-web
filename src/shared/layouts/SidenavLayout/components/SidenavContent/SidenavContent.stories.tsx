import React from "react";
import { MemoryRouter } from "react-router";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SidenavContent from "./SidenavContent";

export default {
  component: SidenavContent,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
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
    <div style={{ maxWidth: "18.75rem", width: "100%" }}>
      <Story />
    </div>
  ),
];
