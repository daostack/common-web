import React from "react";
import { MemoryRouter } from "react-router";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ITEMS } from "../../itemsMock";
import ProjectsTreeComponent from "./ProjectsTree";

export default {
  title: "SidenavLayout/ProjectsTree",
  component: ProjectsTreeComponent,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ maxWidth: "18.75rem", width: "100%" }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof ProjectsTreeComponent>;

const Template: ComponentStory<typeof ProjectsTreeComponent> = (args) => (
  <ProjectsTreeComponent {...args} />
);

export const ProjectsTree = Template.bind({});
ProjectsTree.args = {
  items: ITEMS,
};
