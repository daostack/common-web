import React from "react";

jest.mock("react-merge-refs", () => ({
  mergeRefs: () => () => [],
}));
