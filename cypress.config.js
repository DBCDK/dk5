import { defineConfig } from "cypress";

const host = process.env.CYPRESS_APP_HOST || "http://localhost";
const port = process.env.CYPRESS_APP_PORT || "3001";

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 8000,
    retries: { runMode: 2, openMode: 0 },
    // Keep legacy spec folder structure
    specPattern: "cypress/integration/**/*.js",
    baseUrl: `${host}:${port}`,
    supportFile: "cypress/support/index.js",
    fixturesFolder: "cypress/fixtures",
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
  },
});
