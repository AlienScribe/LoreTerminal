# Interactive Space Lore UI

This is a modular interactive space lore UI that can be easily integrated into other websites or applications.

## Features
- Interactive space map with orbital systems
- Detailed planet information pages
- Animated planet rotations
- Retro sci-fi aesthetic with scan lines and glitch effects

## How to Integrate

### Basic Integration
1. Copy all files to your project directory
2. Include the main HTML in your page using an iframe or by copying the HTML structure
3. Link to the CSS and JavaScript files in your HTML

### Advanced Integration
If you need to integrate this into an existing application:

1. Import the JavaScript modules (planets.js, maps.js, etc.) in your application
2. Add the necessary HTML elements to your DOM
3. Initialize the space UI using the methods provided in game.js

## Customization
- Edit config.js to modify planet names, images, and other configuration options
- Modify styles.css and planet-styles.css to match your application's design
- Add or remove planets by updating the configuration and adding corresponding images

## Directory Structure
- `*.html` - HTML pages for each planet and the main interface
- `*.js` - JavaScript modules handling different functionality
- `*.css` - Style sheets for the UI
- `*.png` - Planet and map images

## Dependencies
- PIXI.js for rendering planetary maps and space environment

