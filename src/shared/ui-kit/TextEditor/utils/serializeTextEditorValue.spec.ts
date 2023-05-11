import { ElementType } from "../constants";
import { TextEditorValue } from "../types";
import { serializeTextEditorValue } from "./serializeTextEditorValue";

describe("serializeTextEditorValue", () => {
  it("should return correct text for simple paragraph", () => {
    const value: TextEditorValue = [
      {
        type: ElementType.Paragraph,
        children: [{ text: "test just text" }],
      },
    ];

    expect(serializeTextEditorValue(value)).toEqual("test just text");
  });

  it("should return correct text for paragraph with mention", () => {
    const value: TextEditorValue = [
      {
        type: ElementType.Paragraph,
        children: [
          { text: "test mention " },
          {
            type: ElementType.Mention,
            displayName: "Latif Eliaz",
            userId: "DDLlUToombZCVE4hf6Ir0NEsOvg2",
            children: [{ text: " " }],
          },
          { text: " and more text after" },
        ],
      },
    ];

    expect(serializeTextEditorValue(value)).toEqual(
      "test mention @Latif Eliaz and more text after",
    );
  });

  it("should return correct text for 2 paragraphs", () => {
    const value: TextEditorValue = [
      { type: ElementType.Paragraph, children: [{ text: "paragraph1" }] },
      { type: ElementType.Paragraph, children: [{ text: "paragraph2" }] },
    ];

    expect(serializeTextEditorValue(value)).toEqual("paragraph1\nparagraph2");
  });
});
