import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import CommonLinksComponent from "./CommonLinks";

export default {
  title: "Common/Common Links",
  component: CommonLinksComponent,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof CommonLinksComponent>;

const Template: ComponentStory<typeof CommonLinksComponent> = (args) => (
  <CommonLinksComponent {...args} />
);

export const CommonLinks = Template.bind({});
CommonLinks.args = {
  links: [
    { title: "Google", value: "https://google.com" },
    { title: "Facebook", value: "https://facebook.com" },
    { title: "Common", value: "https://common.io" },
  ],
};
