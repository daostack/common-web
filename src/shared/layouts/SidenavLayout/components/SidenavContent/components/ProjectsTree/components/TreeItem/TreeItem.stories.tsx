import React from "react";
import { MemoryRouter } from "react-router";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ROUTE_PATHS } from "@/shared/constants";
import { Item } from "../../types";
import TreeItem from "./TreeItem";

const ITEM: Item = {
  id: "parent-item",
  image:
    "https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_01.png?alt=media",
  name: "Clean Air",
  path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", "parent-item"),
};

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
  item: { ...ITEM },
};

export const ParentActiveWithoutItems = Template.bind({});
ParentActiveWithoutItems.args = {
  item: { ...ITEM },
  isActive: true,
};

export const ParentWithNotificationsAmount = Template.bind({});
ParentWithNotificationsAmount.args = {
  item: {
    ...ITEM,
    notificationsAmount: 2,
  },
};

export const ParentActiveWithNotificationsAmount = Template.bind({});
ParentActiveWithNotificationsAmount.args = {
  item: { ...ITEM, notificationsAmount: 2 },
  isActive: true,
};

export const ParentWithoutMembership = Template.bind({});
ParentWithoutMembership.args = {
  item: {
    ...ITEM,
    hasMembership: false,
  },
};
