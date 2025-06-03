export async function showSpaceExplorer(containerId = 'contentBox') {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="space-explorer">
      <h2>Planet Explorer</h2>
      <p>The interactive planet explorer is not yet implemented.</p>
    </div>
  `;
  return () => {
    // cleanup if needed
  };
}
