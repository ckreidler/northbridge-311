const PLACEHOLDER = /REPLACE_WITH_/i;
const WINDOW_SIZES = new Set(["half", "full", "floating", "side-by-side"]);

function filled(value) {
  return typeof value === "string" && value.trim() !== "" && !PLACEHOLDER.test(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setStatus(title, detail, tone = "info") {
  const status = document.getElementById("touchpoint-status");
  if (!status) return;

  status.hidden = false;
  status.dataset.tone = tone;
  status.innerHTML = `<strong>${title}</strong><p>${detail}</p>`;
}

function hideStatus() {
  const status = document.getElementById("touchpoint-status");
  if (status) status.hidden = true;
}

function publicConfig(settings) {
  if (
    filled(settings.chatEndpoint) &&
    filled(settings.instanceId) &&
    filled(settings.contactFlowId) &&
    filled(settings.region)
  ) {
    return {
      chatEndpoint: settings.chatEndpoint.trim(),
      instanceId: settings.instanceId.trim(),
      contactFlowId: settings.contactFlowId.trim(),
      region: settings.region.trim(),
    };
  }

  return null;
}

function windowSizeFrom(settings) {
  const size = typeof settings.windowSize === "string" ? settings.windowSize.trim() : "";
  return WINDOW_SIZES.has(size) ? size : "floating";
}

function boot() {
  const sdk = window.amazonConnectTouchpoint;
  const settings = window.NORTHBRIDGE_311;
  const openButton = document.getElementById("open-chat");

  if (!sdk || typeof sdk.create !== "function") {
    setStatus(
      "Connect Touchpoint failed to load",
      "The <code>@amazon-connect-touchpoint/web</code> script did not load. Check the CDN script tag in <code>index.html</code>, then refresh.",
      "error",
    );
    return;
  }

  if (window.__NORTHBRIDGE_311_MISSING_CONFIG || !settings) {
    setStatus(
      "Config file missing",
      "Copy <code>config.example.js</code> to <code>config.js</code> and fill the public values: chatEndpoint, instanceId, contactFlowId, and region. Serve the site over http (<code>npm start</code>) — do not open index.html as a file:// URL. Never put ACXD API keys in this file.",
      "warn",
    );
    return;
  }

  const config = publicConfig(settings);

  if (!config) {
    setStatus(
      "Add your public Connect values to start chat",
      "Open <code>config.js</code> and replace the <code>REPLACE_WITH_*</code> placeholders with your StartChatContact HTTPS URL, instance ID, contact flow ID, and region. After your API is deployed and CORS allows this origin, refresh this page.",
      "warn",
    );
    return;
  }

  const accent = filled(settings.accent) ? settings.accent.trim() : "#1B4D6E";
  const assistantName = filled(settings.assistantName)
    ? settings.assistantName.trim()
    : "Northbridge 311";
  const windowSize = windowSizeFrom(settings);

  sdk
    .create({
      config,
      input: "text",
      chatMode: true,
      colorMode: "light",
      windowSize,
      assistantName,
      showParticipantInfo: true,
      theme: { accent },
    })
    .then((touchpoint) => {
      hideStatus();
      setStatus(
        `${escapeHtml(assistantName)} is ready`,
        "Use the chat launcher (or Open chat) to ask about hours, trash, potholes, permits, and other city services. This page only receives short-lived Connect participant credentials from your StartChatContact API — not ACXD keys.",
        "ok",
      );

      if (openButton) {
        openButton.hidden = false;
        openButton.addEventListener("click", () => {
          touchpoint.expanded = true;
        });
      }
    })
    .catch((error) => {
      console.error("Connect Touchpoint failed to start", error);
      setStatus(
        "Connect Touchpoint could not start",
        "Confirm <code>chatEndpoint</code> is an HTTPS StartChatContact URL, that CORS allows this origin, and that the contact flow invokes your ACXD app. Then refresh.",
        "error",
      );
    });
}

boot();
