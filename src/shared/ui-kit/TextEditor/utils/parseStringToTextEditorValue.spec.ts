import { ElementType } from "@/shared/ui-kit/TextEditor/constants";
import { TextEditorValue } from "../types";
import { parseStringToTextEditorValue } from "./parseStringToTextEditorValue";

describe("parseStringToTextEditorValue", () => {
  it("should return initial value for undefined/empty string", () => {
    const expectedResult: TextEditorValue = [
      {
        type: ElementType.Paragraph,
        children: [{ text: "" }],
      },
    ];

    expect(parseStringToTextEditorValue()).toEqual(expectedResult);
    expect(parseStringToTextEditorValue("")).toEqual(expectedResult);
  });

  it("should return correct value for string with plain text", () => {
    const text = "Hey, text goes here";
    const expectedResult: TextEditorValue = [
      {
        type: ElementType.Paragraph,
        children: [{ text }],
      },
    ];

    expect(parseStringToTextEditorValue(text)).toEqual(expectedResult);
  });

  it("should return correct value for string with multi-line text", () => {
    const textParts = [
      "Hey, text goes here",
      "also the next line",
      "and the next",
      "!!!",
    ];
    const text = textParts.join("\n");
    const expectedResult: TextEditorValue = textParts.map((part) => ({
      type: ElementType.Paragraph,
      children: [{ text: part }],
    }));

    expect(parseStringToTextEditorValue(text)).toEqual(expectedResult);
  });

  it("should correctly parse serialized value", () => {
    const serializedValue =
      '[{"type":"paragraph","children":[{"text":"Hey, text goes here"}]},{"type":"paragraph","children":[{"text":"also the next line"}]},{"type":"paragraph","children":[{"text":"and the next"}]},{"type":"paragraph","children":[{"text":"!!!"}]}]';
    const textParts = [
      "Hey, text goes here",
      "also the next line",
      "and the next",
      "!!!",
    ];
    const expectedResult: TextEditorValue = textParts.map((part) => ({
      type: ElementType.Paragraph,
      children: [{ text: part }],
    }));

    expect(parseStringToTextEditorValue(serializedValue)).toEqual(
      expectedResult,
    );
  });
});
