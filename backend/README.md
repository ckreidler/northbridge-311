# StartChatContact backend (not in this repo)

Chris deploys the API. This folder is a pointer, not an implementation.

Do **not** put AWS keys, ACXD API keys, or instance access credentials in the static site. They belong in Lambda environment variables or AWS Secrets Manager, with IAM on the function role (`connect:StartChatContact` on the instance).

## Official sample

Deploy Amazon’s StartChatContact API Gateway + Lambda template:

https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI

That stack is the supported way to mint short-lived Connect **participant** credentials for the browser. After deploy, copy the API Gateway invoke URL into `config.js` as `chatEndpoint`.

## What Touchpoint sends and expects

`@amazon-connect-touchpoint/web` `POST`s JSON to `chatEndpoint`:

```json
{
  "InstanceId": "<from config.js>",
  "ContactFlowId": "<from config.js>",
  "ParticipantDetails": { "DisplayName": "…" },
  "Attributes": {},
  "SupportedMessagingContentTypes": [
    "text/plain",
    "text/markdown",
    "application/json",
    "application/vnd.amazonaws.connect.message.interactive",
    "application/vnd.amazonaws.connect.message.interactive.response"
  ]
}
```

The official sample responds in the shape ChatJS / Touchpoint already understand:

```json
{
  "data": {
    "startChatResult": {
      "ContactId": "…",
      "ParticipantId": "…",
      "ParticipantToken": "…"
    }
  }
}
```

If you write your own Lambda, keep that wrapper (or the widget cannot join the chat).

The sample also stores `instanceId` / `contactFlowId` as Lambda environment variables. Keep those in sync with `config.js`, and put any additional secrets in Secrets Manager — not in GitHub.

## CORS

Allow the origins this static site actually uses, for example:

- `http://localhost:3000`
- `http://127.0.0.1:3000`
- Your GitHub Pages origin (`https://<user>.github.io` and the project URL if the site is on a subpath)

The official template’s `OPTIONS` method uses a wildcard origin. If you restrict it, list every origin above. With API Gateway Lambda proxy, `POST` responses must include `Access-Control-Allow-Origin` as well.

## Contact flow

The flow ID you pass (frontend and/or Lambda env) must be a **chat** contact flow whose Agentic CX block invokes the ACXD application. See the root README.
