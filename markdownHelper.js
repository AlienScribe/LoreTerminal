export function setupMarkdownConverter() {
  document.body.insertAdjacentHTML('beforeend', `
    <div id="mdTool">
      <textarea id="inputText"></textarea>
      <button id="convertBtn">Convert to Markdown</button>
      <pre id="mdOutput"></pre>
    </div>
  `);

  document.getElementById('convertBtn').onclick = () => {
    const raw = document.getElementById('inputText').value;
    const md = convertToMarkdown(raw);
    document.getElementById('mdOutput').textContent = md;
  };
}

function convertToMarkdown(text) {
  return text
    .replace(/\*(\w.*?)\*/g, '**$1**')
    .replace(/_(\w.*?)_/g, '*$1*');
}
