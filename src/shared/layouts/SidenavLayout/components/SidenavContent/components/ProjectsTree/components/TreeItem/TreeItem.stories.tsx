import React from "react";
import { MemoryRouter } from "react-router";
import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
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
  title: "SidenavLayout/TreeItem",
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

export const WithoutItems = Template.bind({});
WithoutItems.args = {
  item: { ...ITEM },
};

export const ActiveWithoutItems = Template.bind({});
ActiveWithoutItems.args = {
  item: { ...ITEM },
  isActive: true,
};

export const Level2 = Template.bind({});
Level2.args = {
  item: { ...ITEM },
  level: 2,
};

export const Level3 = Template.bind({});
Level3.args = {
  item: { ...ITEM },
  level: 3,
};

export const WithNotificationsAmount = Template.bind({});
WithNotificationsAmount.args = {
  item: { ...ITEM, notificationsAmount: 2 },
};

export const ActiveWithNotificationsAmount = Template.bind({});
ActiveWithNotificationsAmount.args = {
  item: { ...ITEM, notificationsAmount: 2 },
  isActive: true,
};

export const WithoutMembership = Template.bind({});
WithoutMembership.args = {
  item: { ...ITEM, hasMembership: false },
};

export const ActiveWithoutMembership = Template.bind({});
ActiveWithoutMembership.args = {
  item: { ...ITEM, hasMembership: false },
  isActive: true,
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  item: { ...ITEM },
  children: <div data-testid="children">Children</div>,
};
WithChildren.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(canvas.queryByTestId("children")).not.toBeInTheDocument();

  const toggleItemsButtonEl = canvas.getByLabelText(
    "Show Clean Air's projects",
  );
  await userEvent.click(toggleItemsButtonEl);
  await expect(canvas.getByTestId("children")).toBeInTheDocument();

  await userEvent.click(toggleItemsButtonEl);
  await expect(canvas.queryByTestId("children")).not.toBeInTheDocument();
};

export const ActiveWithChildren = Template.bind({});
ActiveWithChildren.args = {
  item: { ...ITEM },
  isActive: true,
  children: "Children",
};
