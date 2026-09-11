import { create } from "https://unpkg.com/@nlxai/touchpoint-ui/lib/index.js?module";

const PLACEHOLDER = /REPLACE_WITH_/i;

function filled(value) {
  return typeof value === "string" && value.trim() !== "" && !PLACEHOLDER.test(value);
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

function buildConfig(settings) {
  const languageCode = filled(settings.languageCode) ? settings.languageCode.trim() : "en-US";
  const apiKey = settings.apiKey.trim();

  if (filled(settings.applicationUrl) && filled(settings.apiKey)) {
    return {
      applicationUrl: settings.applicationUrl.trim(),
      headers: { "nlx-api-key": apiKey },
      languageCode,
    };
  }

  if (
    filled(settings.host) &&
    filled(settings.deploymentKey) &&
    filled(settings.channelKey) &&
    filled(settings.apiKey)
  ) {
    return {
      host: settings.host.trim(),
      deploymentKey: settings.deploymentKey.trim(),
      channelKey: settings.channelKey.trim(),
      headers: { "nlx-api-key": apiKey },
      languageCode,
    };
  }

  return null;
}

async function boot() {
  const settings = window.NORTHBRIDGE_311;

  if (!settings) {
    setStatus(
      "Config file missing",
      "Copy <code>config.example.js</code> to <code>config.js</code>, fill in your ACXD Touchpoint keys, then refresh. Serve the site over http (npm start) — do not open index.html as a file:// URL.",
      "warn",
    );
    return;
  }

  const config = buildConfig(settings);

  if (!config) {
    setStatus(
      "Add your ACXD channel keys to start chat",
      "Open <code>config.js</code> and replace the <code>REPLACE_WITH_*</code> placeholders. Use host, deploymentKey, channelKey, and apiKey from the deployed ACXD Touchpoint channel — or set applicationUrl plus apiKey. After saving, refresh this page.",
      "warn",
    );
    return;
  }

  const accent = filled(settings.accent) ? settings.accent.trim() : "#1B4D6E";

  try {
    await create({
      config,
      input: "text",
      chatMode: true,
      colorMode: "light",
      theme: { accent },
    });

    hideStatus();
    setStatus(
      "Northbridge 311 assistant is ready",
      "Use the chat launcher to ask about hours, trash, potholes, permits, and other city services. This is a portfolio demo — answers come from the ACXD app and knowledge base you deploy.",
      "ok",
    );
  } catch (error) {
    console.error("Touchpoint failed to start", error);
    setStatus(
      "Touchpoint could not start",
      "Check that the keys in <code>config.js</code> match a deployed ACXD Touchpoint channel and that this page origin is allowlisted. Then refresh.",
      "error",
    );
  }
}

boot();
