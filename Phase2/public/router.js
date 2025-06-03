// router.js
// Refactored Router for improved readability and Vite compatibility

export class Router {
  constructor(routes = {}) {
    // Map view IDs to asynchronous render functions
    this.routes = routes;
    // Main container for dynamic content
    this.contentBox = document.getElementById('contentBox');
    // Sidebar buttons triggering route changes
    this.sidebarButtons = document.querySelectorAll('.sidebar-btn');
    this.init();
  }

  init() {
    // Listen for URL hash changes to trigger routing
    window.addEventListener('hashchange', this.handleRoute.bind(this));
    // Attach click events to sidebar navigation buttons
    this.sidebarButtons.forEach(button => {
      button.addEventListener('click', () => {
        const route = button.dataset.route;
        if (route) {
          window.location.hash = `#${route}`;
        }
      });
    });
    
    // Load the initial route on page load
    this.handleRoute();
  }

  async handleRoute() {
    // Determine desired route; fallback to 'canon' if none specified
    const route = window.location.hash.slice(1) || 'canon';
    await this.loadView(route);
  }

  async loadView(viewId) {
    if (!this.routes[viewId]) {
      this.renderError(`Unknown view: ${viewId}`);
      return;
    }
    try {
      this.setActiveButton(viewId);
      // Show a temporary loading message
      this.contentBox.innerHTML = `<div class="loading">LOADING ${viewId.toUpperCase()}...</div>`;
      // Render the selected view
      await this.routes[viewId](this.contentBox);
    } catch (err) {
      console.error(`Error loading view "${viewId}":`, err);
      this.renderError(`Failed to load ${viewId}.`);
    }
  }

  setActiveButton(viewId) {
    // Toggle the 'active' class on sidebar buttons based on current route
    this.sidebarButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.route === viewId);
    });
  }

  renderError(message) {
    // Render an error message in the main content container
    this.contentBox.innerHTML = `<div class="error">${message}</div>`;
  }
}
