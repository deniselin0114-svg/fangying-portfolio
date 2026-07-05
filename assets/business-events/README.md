# Business events — click-through frames

Static frames for the **Create business events with AI assistance** click-through
([`prototype-business-events.html`](../../prototype-business-events.html)). This
replaces the live Figma embed so the flow renders instantly with no dependency on
Figma's servers.

## Naming convention

Drop the exported PNGs here as a zero-padded or plain numeric sequence, in flow
order:

```
1.png   2.png   3.png   …   N.png
```

The player **auto-discovers** frames: it loads `1.png`, then `2.png`, and so on,
stopping at the first number that is missing. No code change is needed when you
add or remove frames — just keep the sequence contiguous starting at `1`.

## How to export from Figma

Source file: `Create business events with AI assistance`
Figma file key: `ZjCJJcf6PpaxgXcuCN39gq`
Prototype start node: `1:137635`

Pick whichever access you have:

### Option A — Figma Dev Mode / remote MCP (already configured)

The `figma` MCP server is set up in [`.vscode/mcp.json`](../../../.vscode/mcp.json)
(`https://mcp.figma.com/mcp`). Start + authorize it in the MCP view, then ask the
agent to export each prototype frame node as PNG into this folder.

### Option B — Figma REST API (token in terminal)

Never paste the token in chat. In a terminal:

```bash
export FIGMA_TOKEN=<your-personal-access-token>
FILE=ZjCJJcf6PpaxgXcuCN39gq

# 1. List frame node IDs on the prototype page
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE" > file.json

# 2. Render chosen frame IDs to PNG (2x), then download each returned URL
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/images/$FILE?ids=1:137635,<next>,<next>&format=png&scale=2"
```

Save the downloaded images here as `1.png`, `2.png`, … in click-through order.

## Notes

- Use PNG (repo forbids `.gif`).
- Keep frames the same aspect ratio for a smooth click-through; the player uses
  `object-fit: contain` so mismatched sizes still display without cropping.
