import { Configuration } from "@/shared/interfaces";

jest.mock(
  "@/config",
  (): Configuration => ({
    env: "dev",
    baseApiUrl: "https://api-url.com",
    firebase: {
      apiKey: "API_KEY",
      authDomain: "auth-domain.com",
      databaseURL: "https://db-url.com",
      projectId: "PROJECT_ID",
      storageBucket: "BUCKET",
      messagingSenderId: "MESSAGING_SENDER_ID",
      appId: "APP_ID",
    },
    cloudFunctionUrl: "https://cloud-function-url.com",
  })
);
