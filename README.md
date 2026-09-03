# NIPS Neon Event Microsite

A static GitHub Pages-ready event website inspired by the supplied neon AI / K-pop event-flow reference.

## Included

- `index.html` — page structure and content
- `styles.css` — responsive neon UI, card layouts, stage visuals, mobile styles
- `script.js` — GSAP/ScrollTrigger animations, float-in reveals, scroll rotations, 3D tilt and sticky studio interaction
- `assets/reference-theme.png` — the supplied design reference, kept only as a project reference and not displayed by the page

## Run locally

No npm install is required.

Option A: just open `index.html` in your browser.

Option B: run a tiny local web server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

### Recommended: username.github.io repository

1. Create a GitHub repository named exactly:

   `YOUR_GITHUB_USERNAME.github.io`

2. Upload these files to the repository root:

   - `index.html`
   - `styles.css`
   - `script.js`
   - `assets/`

3. Commit and push to the `main` branch.

4. Open GitHub → repository → **Settings → Pages**.

5. Under **Build and deployment** select:

   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`

6. Save. Your site will be available at:

   `https://YOUR_GITHUB_USERNAME.github.io/`

GitHub Pages may take a minute or two to publish after the first deployment.

### Alternative: project repository

If the repository is called `nips-event`, the site will normally be:

`https://YOUR_GITHUB_USERNAME.github.io/nips-event/`

This template uses only relative asset paths, so it also works in project repositories without changing the code.

## Edit the content

Most text is in `index.html`. Search for these section IDs:

- `#flow`
- `#studio`
- `#share`

Edit colors near the top of `styles.css` inside `:root`.

## Animation stack

The site loads GSAP and ScrollTrigger from CDN. This means:

- no npm build is needed
- GitHub Pages can host it directly
- internet access is required for GSAP to load

For a fully offline/self-contained deployment, download GSAP locally and replace the two CDN script tags in `index.html` with local file paths.

## Performance notes

The page intentionally uses many animated effects, but most movement relies on `transform` and `opacity` for GPU-friendly rendering. It also respects `prefers-reduced-motion` for accessibility.
