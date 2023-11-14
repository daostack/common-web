const CracoAlias = require("craco-alias");

module.exports = {
  style: {
    css: {
      loaderOptions: () => ({
        url: {
          filter: (url) => url.includes("/fonts/"),
        },
      }),
    },
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: ".",
        // tsConfigPath should point to the file where "baseUrl" and "paths" are specified
        tsConfigPath: "./tsconfig.paths.json",
      },
    },
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.devtool =
            process.env.REACT_APP_ENV === "dev"
              ? "source-map"
              : "eval-cheap-module-source-map";

          return webpackConfig;
        },
      },
    },
  ],
};
