module.exports = {
  stories: [
    {
      directory: "../src/shared/components",
      files: "**/*.stories.*",
      titlePrefix: "Shared Components",
    },
    {
      directory: "../src/shared/ui-kit",
      files: "**/*.stories.*",
      titlePrefix: "UI Kit",
    },
    "../src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-create-react-app",
    "@storybook/addon-a11y",
  ],
  features: {
    interactionsDebugger: true,
  },
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5",
  },
};
