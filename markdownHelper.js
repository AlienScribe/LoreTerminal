function convertToMarkdown(raw) {
  return raw
    .replace(/\n{2,}/g, '\n\n')
    .replace(/\t/g, '    ');
}

document.body.insertAdjacentHTML('beforeend', `
  <textarea id="inputText" placeholder="Paste text here..."></textarea>
  <button id="convertBtn">Convert to Markdown</button>
  <pre id="mdOutput"></pre>
`);

document.getElementById('convertBtn').onclick = () => {
  const raw = document.getElementById('inputText').value;
  const md = convertToMarkdown(raw);
  document.getElementById('mdOutput').textContent = md;
};
