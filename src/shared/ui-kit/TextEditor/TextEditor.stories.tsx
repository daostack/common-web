import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  TextEditor,
  TextEditorSize,
  TextEditorValue,
  TextEditorElementType,
} from "./index";

export default {
  component: TextEditor,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof TextEditor>;

const Template: ComponentStory<typeof TextEditor> = (args) => {
  const [value, setValue] = useState<TextEditorValue>([
    {
      type: TextEditorElementType.Paragraph,
      children: [
        { text: "This is editable " },
        { text: "rich", bold: true },
        { text: " text, " },
        { text: "much", italic: true },
        { text: " better than a textarea!" },
      ],
    },
    {
      type: TextEditorElementType.Paragraph,
      children: [
        {
          text: "Since it's rich text, you can do things like turn a selection of text ",
        },
        { text: "bold", bold: true },
        {
          text: ", or add a semantically rendered block quote in the middle of the page, like this:",
        },
      ],
    },
    {
      type: TextEditorElementType.Paragraph,
      children: [{ text: "היי ", bold: true }, { text: "מה שלומך?" }],
    },
  ]);

  return <TextEditor {...args} value={value} onChange={setValue} />;
};

export const Small = Template.bind({});

export const Big = Template.bind({});
Big.args = {
  size: TextEditorSize.Big,
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: "Content",
};

export const WithHint = Template.bind({});
WithHint.args = {
  label: "Content",
  hint: "Hint goes here",
};

export const Optional = Template.bind({});
Optional.args = {
  label: "Content",
  optional: true,
};
