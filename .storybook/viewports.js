const AUTO = "90%";

const convertViewportWidth = (px) => `${px + 1}px`;

// Based on SCSS breakpoints v2
export const VIEWPORTS = {
  desktop: {
    name: "Desktop",
    styles: { width: convertViewportWidth(1560), height: AUTO },
    type: "desktop",
  },
  laptop: {
    name: "Laptop",
    styles: { width: convertViewportWidth(1152), height: AUTO },
    type: "laptop",
  },
  tabletPortrait: {
    name: "Tablet / Portrait",
    styles: { width: convertViewportWidth(768), height: "1024px" },
    type: "tablet",
  },
  tabletLandscape: {
    name: "Tablet / Landscape",
    styles: { width: "1024px", height: "768px" },
    type: "tablet",
  },
  mobilePortrait: {
    name: "Mobile / Portrait",
    styles: { width: "390px", height: "768px" },
    type: "mobile",
  },
  mobileLandscape: {
    name: "Mobile / Landscape",
    styles: { width: "768px", height: "390px" },
    type: "mobile",
  },
};
