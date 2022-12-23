import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import TextEditor from "./TextEditor";

export default {
  component: TextEditor,
} as ComponentMeta<typeof TextEditor>;

const Template: ComponentStory<typeof TextEditor> = (args) => (
  <TextEditor {...args} />
);

export const Default = Template.bind({});
