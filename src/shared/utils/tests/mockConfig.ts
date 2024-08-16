import { Environment } from "@/shared/constants";
import { Configuration } from "@/shared/interfaces";

jest.mock(
  "@/config",
  (): Configuration => ({
    env: Environment.Dev,
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
    deadSeaCommonId: "958dca85-7bc1-4714-95bd-1fc6343f0654",
    parentsForClimateCommonId: "958dca85-7bc1-4714-95bd-1fc6343f0654",
    saadiaCommonId: "958dca85-7bc1-4714-95bd-1fc6343f0654",
    vapidKey: "VAPID_KEY",
  })
);
