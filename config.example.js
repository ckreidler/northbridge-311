/**
 * Northbridge 311 — public frontend config (example)
 *
 * Copy this file to config.js and replace the REPLACE_WITH_* placeholders.
 * config.js is gitignored.
 *
 * Put only public values here. The browser must never hold ACXD API keys,
 * deployment keys, AWS access keys, or other long-lived secrets.
 *
 * chatEndpoint is the HTTPS URL of your StartChatContact API (API Gateway /
 * Lambda). The URL itself is not a secret, but do not put AWS keys in this file.
 *
 * Where secrets belong
 * --------------------
 * Instance access, IAM, and any ACXD credentials live in Lambda environment
 * variables or AWS Secrets Manager — not in this static site.
 *
 * Where to get the public IDs
 * ---------------------------
 * - chatEndpoint: Invoke URL of the StartChatContact API you deploy
 *   (see backend/README.md and the official sample:
 *   https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI)
 * - instanceId / contactFlowId: Amazon Connect Customer console (Routing → Flows)
 * - region: AWS region of that instance (for example us-east-1)
 */
window.NORTHBRIDGE_311 = {
  // HTTPS URL of your StartChatContact API Gateway stage (no trailing secrets)
  chatEndpoint: "REPLACE_WITH_CHAT_ENDPOINT",

  // Amazon Connect Customer instance UUID
  instanceId: "REPLACE_WITH_INSTANCE_ID",

  // Inbound chat contact flow UUID (must invoke the ACXD app)
  contactFlowId: "REPLACE_WITH_CONTACT_FLOW_ID",

  // AWS region of the Connect instance
  region: "us-east-1",

  // Display name for the automated assistant
  assistantName: "Northbridge 311",

  // Civic accent passed to Touchpoint theme.accent
  accent: "#1B4D6E",

  /**
   * How the expanded chat is presented:
   *   "half"         overlay, panel on the right, page dimmed
   *   "full"         overlay covering the viewport
   *   "floating"     detached panel; page stays interactive (default)
   *   "side-by-side" docked right panel; page narrows on wide viewports
   */
  windowSize: "floating",
};
