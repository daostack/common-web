import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import FooterComponent from "./Footer";

export default {
  title: "Footer",
  component: FooterComponent,
} as ComponentMeta<typeof FooterComponent>;

const Template: ComponentStory<typeof FooterComponent> = (args) => (
  <FooterComponent {...args} />
);

export const Footer = Template.bind({});
