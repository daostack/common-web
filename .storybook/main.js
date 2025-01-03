const path = require("path");

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
    {
      directory: "../src/shared/layouts",
      files: "**/*.stories.*",
      titlePrefix: "Layouts",
    },
    {
      directory: "../src/pages",
      files: "**/*.stories.*",
      titlePrefix: "Pages",
    },
    "../src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-create-react-app",
    "@storybook/addon-a11y",
    "@storybook/addon-viewport",
  ],
  features: {
    interactionsDebugger: true,
  },
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5",
  },
  webpackFinal: async (config) => {
    // Is based on tsconfig.paths.json file paths
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "..", "src"),
    };

    return config;
  },
};
