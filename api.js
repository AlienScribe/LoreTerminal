import { fetchCanonLore as fetchCanonRaw } from './api/github.js';

const cache = { canon: null, proposed: null };

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
}

function parseMarkdown(markdown) {
  if (!markdown) return [];
  const sections = [];
  const lines = markdown.split('\n');
  let current = { title: '', content: [], metadata: {}, level: 1 };
  let inMeta = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '---') { inMeta = !inMeta; continue; }
    if (inMeta) {
      const [key, ...valueParts] = trimmed.split(':');
      const value = valueParts.join(':').trim();
      if (key && value) current.metadata[key.toLowerCase()] = value;
      continue;
    }
    if (trimmed.startsWith('#')) {
      if (current.title || current.content.length) {
        sections.push({ ...current, content: current.content.join('\n').trim() });
      }
      const level = trimmed.match(/^#+/)[0].length;
      current = { title: trimmed.replace(/^#+/, '').trim(), level, content: [], metadata: {} };
    } else if (trimmed) {
      current.content.push(line);
    }
  }
  if (current.title || current.content.length) {
    sections.push({ ...current, content: current.content.join('\n').trim() });
  }
  return sections.filter(s => s.content);
}

export async function fetchCanonLore() {
  if (cache.canon) return cache.canon;
  const canon = await fetchCanonRaw();
  if (!canon || canon.length === 0) return [];
  const parsed = parseMarkdown(canon[0].content);
  cache.canon = parsed;
  return parsed;
}

export async function fetchProposedLore(canonSections = []) {
  if (cache.proposed) return cache.proposed;
  const res = await fetchWithRetry('https://api.github.com/repos/Alien-Worlds/the-lore/pulls');
  const pulls = await res.json();
  const canonTitles = new Set(canonSections.map(s => s.title.trim().toLowerCase()));
  const proposals = pulls.map(pr => {
    const sections = parseMarkdown(pr.body || '');
    const unique = sections.filter(sec => !canonTitles.has(sec.title.trim().toLowerCase()));
    return { title: pr.title, sections: unique, prNumber: pr.number, date: pr.created_at };
  }).filter(p => p.sections.length);
  cache.proposed = proposals;
  return proposals;
}
