import React from "react";

jest.mock("react-scrollbars-custom", () => ({
  Scrollbar: ({ children }) => (
    <div data-testid="react-scrollbars-custom">{children}</div>
  ),
}));
