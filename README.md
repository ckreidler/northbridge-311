# Northbridge 311

Portfolio demo for a fictional **City of Northbridge 311** front door on Amazon Connect Customer / Agentic CX Designer (ACXD).

This repo is a static site plus a knowledge-base pack. The **public demo is Path B**: the browser loads Connect Touchpoint and asks your StartChatContact API for short-lived participant credentials. Chris deploys that API; this repo does not provision AWS.

## Architecture (Path B)

```text
Browser (this static site)
  → StartChatContact API (API Gateway + Lambda)
    → Amazon Connect StartChatContact
      → Contact flow with an Agentic CX block
        → ACXD application (grounded on kb/)
```

1. The page loads `@amazon-connect-touchpoint/web` and public IDs from `config.js`.
2. Touchpoint `POST`s to `chatEndpoint`. Your Lambda calls Connect `StartChatContact` with IAM that never leaves the backend.
3. The API returns participant credentials (`ContactId`, `ParticipantId`, `ParticipantToken`) wrapped as `{ data: { startChatResult } }`.
4. The widget uses those short-lived credentials to join the chat. The contact flow must invoke the ACXD app so answers come from the conversational application (and the `kb/` pack you upload there).

**Secrets belong in Lambda environment variables or AWS Secrets Manager** (instance access, IAM role for `connect:StartChatContact`, and any ACXD credentials). They must never appear in `config.js`, `boot.js`, or the GitHub Pages bundle.

```text
Browser  ──public IDs + chatEndpoint only──►  Static site
Browser  ──POST StartChatContact (no AWS keys)──►  Your API
Lambda   ──IAM-signed StartChatContact──►  Amazon Connect
Connect  ──Agentic CX block──►  ACXD app
```

Official backend sample (deploy this, or an equivalent you already have):

[amazon-connect-chat-ui-examples / startChatContactAPI](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI)

A short operator note lives in [backend/README.md](backend/README.md). This PR does not implement or deploy the Lambda.

## Frontend setup

1. Clone this repository.
2. Copy the example config. Keep real values out of git if you treat the endpoint as environment-specific:

   ```bash
   cp config.example.js config.js
   ```

3. Fill **public** frontend values in `config.js`:

   | Field | What it is |
   | --- | --- |
   | `chatEndpoint` | HTTPS URL of your StartChatContact API (API Gateway invoke URL). Not a secret by itself — still do **not** put AWS keys here. |
   | `instanceId` | Amazon Connect Customer instance UUID |
   | `contactFlowId` | Contact flow UUID that starts chat and invokes ACXD |
   | `region` | AWS region of the instance, e.g. `us-east-1` |
   | `assistantName` | Label shown for the automated assistant |
   | `accent` | Theme accent color |
   | `windowSize` | `floating` (default), `half`, `full`, or `side-by-side` |

4. Serve the folder over HTTP (do not open `index.html` as a `file://` URL):

   ```bash
   npm start
   ```

   or:

   ```bash
   npx --yes serve .
   ```

5. Open the URL `serve` prints (usually `http://localhost:3000`).
6. If placeholders remain, the side panel asks you to fill `config.js`. After the API is up, CORS allows this origin, and the contact flow reaches ACXD, the Connect Touchpoint launcher appears.

`config.js` is gitignored. `config.example.js` is the committed template.

## CORS

The StartChatContact API **must allow the origins** you actually use, including:

- Local demo: `http://localhost:3000` (and `http://127.0.0.1:3000` if you open that)
- GitHub Pages, if you enable it: `https://<github-username>.github.io` and the project URL if the site is served from a subpath

The official CloudFormation sample enables `OPTIONS` with a wildcard origin. If you tighten CORS, list every origin above. With API Gateway `AWS_PROXY`, the Lambda response must also include `Access-Control-Allow-Origin` (and usually `Access-Control-Allow-Headers`) on `POST`.

## Contact flow must invoke ACXD

Create or edit the inbound **chat** contact flow used by `contactFlowId`:

1. Start the flow for chat contacts.
2. Add an **Agentic CX** block that invokes your deployed ACXD application (the one that uses the `kb/` pack).
3. Handle the block’s success / escalation paths (queue a human specialist when the ACXD app escalates).
4. Publish the flow and use that flow’s ID in `config.js` (and in Lambda env if the sample template stores it there).

Until the flow calls ACXD, Connect Touchpoint can start a chat that never reaches the 311 assistant.

## Upload the knowledge base pack

The `kb/` folder has 10 small HTML articles and matching `.txt` twins about fictional Northbridge 311 services. Each file is well under 1 MB and uses question/answer headings so retrieval stays focused.

Typical ACXD upload tips:

- Preferred types: HTML, TXT, PDF, DOCX
- Keep files small (≤ 1 MB) and split topics — many small files retrieve better than one large dump
- Upload the `kb/*.html` or `kb/*.txt` set into the application knowledge base, then rebuild and redeploy
- See [kb/README.md](kb/README.md) for the file list and more notes

## Security

- **Never** put ACXD API keys, deployment keys, channel keys, or AWS access keys in `config.js` or any file the browser loads.
- `config.js` is listed in `.gitignore` so local public IDs stay off GitHub if you prefer.
- Treat the StartChatContact URL as a public browser endpoint: it should mint **participant** credentials only, with IAM on Lambda, rate limiting / WAF as you see fit.
- Rotate anything that leaks. Restrict CORS to the GitHub Pages and localhost origins you actually use.

### Path A (not this demo)

Path A embeds ACXD Touchpoint (`@nlxai/touchpoint-ui`) with long-lived channel keys in the page. That is convenient for a private local experiment and is **not** the public demo. Do not commit those keys. This repo’s `index.html` / `boot.js` path is Connect Touchpoint + StartChatContact only.

## Repo layout

```text
index.html            Path B landing page (config.js, then Connect Touchpoint UMD, then boot.js)
styles.css            Civic demo styles
boot.js               @amazon-connect-touchpoint/web create() bootstrap
config.example.js     Public placeholders (committed)
config.js             Local public IDs (gitignored)
backend/README.md     Pointer to the official StartChatContact CloudFormation sample
kb/                   Sample knowledge-base documents for ACXD grounding
package.json          npm start / npm run dev → npx serve .
```

## License / attribution

Fictional municipal content for portfolio use only. Not affiliated with any real city 311 program.
