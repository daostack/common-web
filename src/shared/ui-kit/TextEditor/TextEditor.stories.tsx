import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TextEditor, TextEditorSize } from "./index";

export default {
  component: TextEditor,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof TextEditor>;

const Template: ComponentStory<typeof TextEditor> = (args) => (
  <TextEditor {...args} />
);

export const Small = Template.bind({});

export const Big = Template.bind({});
Big.args = {
  size: TextEditorSize.Big,
};
