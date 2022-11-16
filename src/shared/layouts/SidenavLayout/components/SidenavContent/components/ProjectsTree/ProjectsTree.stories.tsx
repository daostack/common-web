import React from "react";
import { MemoryRouter } from "react-router";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ROUTE_PATHS } from "@/shared/constants";
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
  items: [
    {
      id: "project-1",
      name: "Project 1",
      image: IMAGE_URL,
      path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", "project-1"),
    },
    {
      id: "project-2",
      name: "Project 2",
      image: IMAGE_URL,
      path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", "project-2"),
      items: [
        {
          id: "project-2.1",
          name: "Project 2.1",
          image: IMAGE_URL,
          path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", "project-2.1"),
          notificationsAmount: 7,
          items: [
            {
              id: "project-2.1.1",
              name: "Project 2.1.1",
              image: IMAGE_URL,
              path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", "project-2.1.1"),
              items: [
                {
                  id: "project-2.1.1.1",
                  name: "Project 2.1.1.1",
                  image: IMAGE_URL,
                  path: ROUTE_PATHS.COMMON_DETAIL.replace(
                    ":id",
                    "project-2.1.1.1",
                  ),
                },
                {
                  id: "project-2.1.1.2",
                  name: "Project 2.1.1.2",
                  image: IMAGE_URL,
                  path: ROUTE_PATHS.COMMON_DETAIL.replace(
                    ":id",
                    "project-2.1.1.2",
                  ),
                  hasMembership: false,
                  items: [
                    {
                      id: "project-2.1.1.2.1",
                      name: "Project nested long long long",
                      image: IMAGE_URL,
                      path: ROUTE_PATHS.COMMON_DETAIL.replace(
                        ":id",
                        "project-2.1.1.2.1",
                      ),
                      notificationsAmount: 2,
                      hasMembership: false,
                    },
                    {
                      id: "project-2.1.1.2.2",
                      name: "Project 2.1.1.2.2",
                      image: IMAGE_URL,
                      path: ROUTE_PATHS.COMMON_DETAIL.replace(
                        ":id",
                        "project-2.1.1.2.2",
                      ),
                      hasMembership: false,
                    },
                  ],
                },
              ],
            },
            {
              id: "project-2.1.2",
              name: "Project 2.1.2",
              image: IMAGE_URL,
              path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", "project-2.1.2"),
            },
          ],
        },
      ],
    },
    {
      id: "project-3",
      name: "Project 3",
      image: IMAGE_URL,
      path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", "project-3"),
    },
  ],
};
