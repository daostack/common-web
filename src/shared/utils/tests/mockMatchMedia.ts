import { ViewportBreakpoint } from "@/shared/constants";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => {
    const nonDesktopViewportBreakpoints = [
      ViewportBreakpoint.Phone,
      ViewportBreakpoint.Tablet,
      ViewportBreakpoint.Laptop,
    ];
    const nonDesktopViewportQueries = nonDesktopViewportBreakpoints.map(
      (value) => `(max-width: ${value}px)`,
    );

    return {
      matches: !nonDesktopViewportQueries.includes(query),
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  }),
});

export default () => {};
