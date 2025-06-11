export function showMarkdownConverter(containerId = 'contentBox') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="markdown-converter">
      <h2>Markdown Converter</h2>
      <textarea id="md-input" placeholder="Paste raw text here"></textarea>
      <button id="md-convert">Convert</button>
      <textarea id="md-output" placeholder="Markdown output" readonly></textarea>
      <div id="md-preview"></div>
    </div>
  `;
  const input = document.getElementById('md-input');
  const output = document.getElementById('md-output');
  const preview = document.getElementById('md-preview');
  document.getElementById('md-convert').addEventListener('click', () => {
    output.value = simpleConvert(input.value);
    preview.innerHTML = renderMarkdown(output.value);
  });
}

function simpleConvert(text) {
  const paragraphs = text.split(/\n\s*\n/).map(p => p.trim());
  return paragraphs.map(p => p ? p + '\n' : '').join('\n');
}

function renderMarkdown(text) {
  return text
    .replace(/(?:\*\*|__)(.*?)(?:\*\*|__)/g, '<strong>$1</strong>')
    .replace(/(?:\*|_)(.*?)(?:\*|_)/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}
