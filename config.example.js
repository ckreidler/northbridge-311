/**
 * Northbridge 311 — ACXD Touchpoint config (example)
 *
 * Copy this file to config.js and replace the REPLACE_WITH_* placeholders.
 * config.js is gitignored so real keys stay off GitHub.
 *
 * Where to get these values
 * -------------------------
 * In Amazon Connect Customer / Agentic CX Designer (ACXD):
 *   1. Open your deployed conversational application
 *   2. Open the Touchpoint (API Delivery) channel
 *   3. Open Setup instructions
 *
 * You will see either:
 *   - Discrete keys: Host, Deployment key, Channel key, API key
 *   - Simplified form: Application URL + API key
 *
 * Application URL shape (typical):
 *   https://apps.nlx.ai/c/{deploymentKey}/{channelKey}-{languageCode}
 *
 * Also whitelist this page's origin on the channel (for local demo: http://localhost:3000).
 */
window.NORTHBRIDGE_311 = {
  // Discrete Touchpoint keys (Path A — preferred)
  host: "REPLACE_WITH_HOST",
  deploymentKey: "REPLACE_WITH_DEPLOYMENT_KEY",
  channelKey: "REPLACE_WITH_CHANNEL_KEY",
  apiKey: "REPLACE_WITH_API_KEY",

  // IETF language tag used by the channel (must match the deployed language)
  languageCode: "en-US",

  // Optional civic accent passed to Touchpoint theme.accent
  accent: "#1B4D6E",

  /**
   * Optional simplified form.
   * If applicationUrl AND apiKey are both filled (not placeholders),
   * boot.js uses this instead of host / deploymentKey / channelKey.
   *
   * Example:
   *   applicationUrl: "https://apps.nlx.ai/c/YOUR_DEPLOYMENT/YOUR_CHANNEL-en-US",
   */
  applicationUrl: "",
};
