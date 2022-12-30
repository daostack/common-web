import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Footer, { FooterVariant } from "./Footer";

export default {
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = (args) => <Footer {...args} />;

export const Default = Template.bind({});

export const Small = Template.bind({});
Small.args = {
  variant: FooterVariant.Small,
};
