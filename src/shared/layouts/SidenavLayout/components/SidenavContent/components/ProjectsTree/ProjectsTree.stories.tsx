import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ProjectsTreeComponent from "./ProjectsTree";

const IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_01.png?alt=media";

export default {
  component: ProjectsTreeComponent,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "18.75rem", width: "100%" }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof ProjectsTreeComponent>;

const Template: ComponentStory<typeof ProjectsTreeComponent> = (args) => (
  <ProjectsTreeComponent {...args} />
);

export const ProjectsTree = Template.bind({});
ProjectsTree.args = {
  items: [
    {
      id: "project-1",
      name: "Project 1",
      image: IMAGE_URL,
    },
    {
      id: "project-2",
      name: "Project 2",
      image: IMAGE_URL,
      items: [
        {
          id: "project-2-nested-1",
          name: "Project 2 Nested 1",
          image: IMAGE_URL,
          items: [
            {
              id: "project-2-nested-1.1",
              name: "Project 2 Nested 1.1",
              image: IMAGE_URL,
            },
            {
              id: "project-2-nested-1.2",
              name: "Project 2 Nested 1.2",
              image: IMAGE_URL,
            },
          ],
        },
      ],
    },
    {
      id: "project-3",
      name: "Project 3",
      image: IMAGE_URL,
    },
  ],
};
