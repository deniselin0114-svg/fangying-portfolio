# Designer Portfolio

A bold, interaction-forward portfolio for a product/UX designer. Built as a
zero-dependency static site (plain HTML, CSS, and JS — no build step), with a
dark expressive canvas and a focus on motion and interactivity:

- **Custom cursor** that smoothly trails the pointer and morphs into labels
  (e.g. "Open ↗") over interactive elements.
- **Magnetic buttons** that lean toward the cursor.
- **Interactive work list** — hovering a project row highlights it, dims the
  others, and reveals a floating preview that follows the cursor.
- **Kinetic hero**, a looping **marquee** strip, film-grain texture, and
  scroll-reveal animations.
- Light/dark theme toggle (defaults to dark) and full reduced-motion support.

## What's here

```
portfolio/
├── index.html   # Home page: hero, selected work, about, contact
├── styles.css   # Editorial theme + light/dark mode
└── script.js    # Theme toggle, sticky nav, reveal-on-scroll
```

## Run it

It's a static site — just open `index.html` in a browser, or serve the folder:

```bash
cd portfolio
python3 -m http.server 8080
# then open http://localhost:8080
```

## The Eventstream entry point

The featured project row **Fabric Eventstream** (item 01) is the live entry
point. Hovering it reveals a topology preview; clicking opens the interactive
prototype that lives in
[`prototypes/ux-proto-es`](../prototypes/ux-proto-es):

```
http://localhost:5173/#eventstream
```

For that link to work, start the prototype's dev server first:

```bash
cd prototypes/ux-proto-es
bun install   # or: npm install
bun run dev   # or: npm run dev
```

> Vite serves on `5173` by default. If that port is taken it picks the next one
> (5174, 5175, …). If yours differs, update the `href` on the Eventstream row
> in `index.html` to match.

## Make it yours

Everything is placeholder content ready to be swapped:

- **Name / tagline** — search for `Fangying Lin` in `index.html`.
- **Projects** — each `<li class="work-row">` is one row. Set its
  `data-preview` key, point the `work-row__link href` at the case study or live
  demo, and add a matching entry in the `PREVIEWS` map in `script.js` for the
  hover preview.
- **Contact links** — update the `mailto:` and social links in the footer.
- **Colors / type** — tweak the tokens at the top of `styles.css` (`--accent`,
  `--accent-2`, `--bg`, fonts, etc.).
