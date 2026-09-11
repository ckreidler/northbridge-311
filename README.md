# Northbridge 311

Portfolio demo for a fictional **City of Northbridge 311** front door on Amazon Connect Customer / Agentic CX Designer (ACXD).

This repo is a simple static site plus a small knowledge-base pack. It is meant for nights-and-weekends portfolio work — not a production city website.

- **Path A (this repo):** the webpage embeds ACXD Touchpoint directly with `@nlxai/touchpoint-ui`. No `StartChatContact` call is required.
- **Path B (optional later):** website → Amazon Connect chat → Connect flow → ACXD, using `@amazon-connect-touchpoint/web` and `StartChatContact`. See [path-b-connect.html](path-b-connect.html).

## Path A quick start

1. Clone this repository.
2. Copy the example config and keep real keys out of git:

   ```bash
   cp config.example.js config.js
   ```

3. Fill `config.js` with values from your **deployed ACXD Touchpoint (API Delivery) channel**.
4. Serve the folder over HTTP (do not open `index.html` as a `file://` URL):

   ```bash
   npm start
   ```

   or:

   ```bash
   npx --yes serve .
   ```

5. Open the URL `serve` prints (usually `http://localhost:3000`).
6. If keys are still placeholders, the side panel shows a friendly setup message. After you save real keys and refresh, the Touchpoint launcher appears.

`config.js` is gitignored. `config.example.js` is the committed template.

## Where to get host, keys, and API key

In Amazon Connect Customer / Agentic CX Designer:

1. Open the conversational application you deployed for this demo.
2. Open the **Touchpoint** / **API Delivery** channel.
3. Open **Setup instructions**.

You will typically see either:

| Field | What it is |
| --- | --- |
| `host` | Touchpoint / runtime host from the channel setup UI |
| `deploymentKey` | Deployment identifier for the built application |
| `channelKey` | Identifier for the Touchpoint / API channel |
| `apiKey` | Channel API key (sent as the `nlx-api-key` header) |
| `languageCode` | Channel language, usually `en-US` |

Some setup screens show a single **Application URL** plus API key instead. That URL usually looks like:

```text
https://apps.nlx.ai/c/{deploymentKey}/{channelKey}-{languageCode}
```

`boot.js` accepts either shape:

- Discrete keys: `host` + `deploymentKey` + `channelKey` + `apiKey`
- Simplified: `applicationUrl` + `apiKey`

Also allowlist the origin you use to open the page (for local demo, `http://localhost:3000`) on the channel.

Do **not** invent AWS account IDs or paste sample keys from the internet. Use only values from your own deployed channel.

## Upload the knowledge base pack

The `kb/` folder has 10 small HTML articles and matching `.txt` twins about fictional Northbridge 311 services. Each file is well under 1 MB and uses question/answer headings so retrieval stays focused.

Typical ACXD upload tips:

- Preferred types: HTML, TXT, PDF, DOCX
- Keep files small (≤ 1 MB) and split topics — many small files retrieve better than one large dump
- Upload the `kb/*.html` or `kb/*.txt` set into the application knowledge base, then rebuild and redeploy
- See [kb/README.md](kb/README.md) for the file list and more notes

## Security

- Never commit real API keys, channel secrets, or AWS account IDs.
- `config.js` is listed in `.gitignore` for that reason.
- Treat the Touchpoint API key like a credential: rotate it if it leaks, and restrict channel allowlists to demo origins.

## Repo layout

```text
index.html            Path A landing page (loads config.js, then boot.js)
styles.css            Civic demo styles
boot.js               Touchpoint create() bootstrap
config.example.js     Documented placeholders (committed)
config.js             Local keys (gitignored)
path-b-connect.html   Optional Path B notes
kb/                   Sample knowledge-base documents
package.json          npm start / npm run dev → npx serve .
```

## License / attribution

Fictional municipal content for portfolio use only. Not affiliated with any real city 311 program.
