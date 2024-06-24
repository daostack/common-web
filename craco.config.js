const CracoAlias = require("craco-alias");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const reactAppEnv = process.env.REACT_APP_ENV;
      if (reactAppEnv === "dev" || reactAppEnv === "stage") {
        webpackConfig.optimization.minimize = false;
        webpackConfig.devtool = "source-map";
      } else {
        webpackConfig.devtool = false;
      }
      return webpackConfig;
    },
  },
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
  ],
};
