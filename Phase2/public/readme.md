# Interactive Space Lore UI

This is a modular interactive space lore UI that can be easily integrated into other websites or applications.

## Features
- Interactive space map with orbital systems
- Detailed planet information pages
- Animated planet rotations
- Retro sci-fi aesthetic with scan lines and glitch effects

## How to Integrate

### Basic Integration
1. Copy `index.html`, the `public` folder and the `src` folder into your project.
2. Reference `public/styles.css` in your page or bundle it with your own styles.
3. Load the JavaScript modules using `<script type="module" src="/src/main.js"></script>` and `<script type="module" src="/public/router.js"></script>`.

### Advanced Integration
If you need to integrate this into an existing application:

1. Import the modules from the `src` folder (e.g. `auth.js`, `ui.js`, `main.js`) as needed.
2. Include `public/router.js` to handle navigation between views.
3. Ensure elements such as `#contentBox` and sidebar controls exist in your DOM, then call the initialization code in `src/main.js`.

## Customization
- Tweak `public/styles.css` to alter colors, fonts and layout.
- Update modules in the `src` folder to change logic or data sources.

## Directory Structure
- `index.html` – Main interface markup
- `public/` – Static assets (`styles.css`, `router.js`)
- `src/` – Application logic modules
- `server.js` – Express server with optional GraphQL support

## Dependencies
- Node.js environment with Vite for local development and bundling

