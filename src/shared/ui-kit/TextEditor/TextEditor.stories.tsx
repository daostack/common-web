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
      type: TextEditorElementType.Heading,
      children: [{ text: "Here we have heading" }],
    },
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
          text: ", or add a bulleted list:",
        },
      ],
    },
    {
      type: TextEditorElementType.BulletedList,
      children: [
        {
          type: TextEditorElementType.ListItem,
          children: [{ text: "With" }],
        },
        {
          type: TextEditorElementType.ListItem,
          children: [{ text: "Some" }],
        },
        {
          type: TextEditorElementType.ListItem,
          children: [{ text: "Items" }],
        },
      ],
    },
    {
      type: TextEditorElementType.Paragraph,
      children: [
        {
          text: "Here we can have a ",
        },
        {
          type: TextEditorElementType.Link,
          url: "https://common.io",
          children: [{ text: "hyperlink" }],
        },
        {
          text: " definition.",
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

export const Error = Template.bind({});
Error.args = {
  error: "This field is required",
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  readOnly: true,
};
