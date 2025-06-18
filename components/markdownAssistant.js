// Markdown formatting assistant
function convertToMarkdown(raw) {
  return raw
    .replace(/\n{2,}/g, '\n\n')
    .replace(/\t/g, '    ');
}

const assistant = document.createElement('div');
assistant.id = 'mdAssistant';
assistant.innerHTML = `
  <textarea id="mdInput" placeholder="Paste text here..."></textarea>
  <div class="controls">
    <button id="copyMd">Copy</button>
  </div>
  <pre id="mdPreview"></pre>
`;

document.body.appendChild(assistant);

document.getElementById('mdInput').addEventListener('input', e => {
  const md = convertToMarkdown(e.target.value);
  document.getElementById('mdPreview').textContent = md;
});

document.getElementById('copyMd').addEventListener('click', () => {
  const text = document.getElementById('mdPreview').textContent;
  navigator.clipboard.writeText(text);
});
