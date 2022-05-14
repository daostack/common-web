import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import AppWrapper from "@/containers/App/AppWrapper";

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AppWrapper, ...options });

export * from "@testing-library/react";
export { customRender as render };
