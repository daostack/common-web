import React from "react";
import { MemoryRouter } from "react-router";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ROUTE_PATHS } from "@/shared/constants";
import TreeItem from "./TreeItem";

export default {
  component: TreeItem,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ maxWidth: "16.75rem", width: "100%" }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof TreeItem>;

const Template: ComponentStory<typeof TreeItem> = (args) => (
  <TreeItem {...args} />
);

export const ParentWithoutItems = Template.bind({});
ParentWithoutItems.args = {
  item: {
    id: "parent-item",
    image:
      "https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_01.png?alt=media",
    name: "Clean Air",
    path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", "parent-item"),
  },
};

export const ParentActiveWithoutItems = Template.bind({});
ParentActiveWithoutItems.args = {
  ...ParentWithoutItems.args,
  isActive: true,
};
