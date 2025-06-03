// server.js
const express = require('express');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();
const app = express();
const PORT = 3000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function githubHeaders(accept) {
    const headers = {
        'Accept': accept,
        'User-Agent': 'Alien-Worlds-Lore-App'
    };
    if (GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }
    return headers;
}

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Proxy endpoint for fetching Canon lore
app.get('/api/canon', async (req, res) => {
    try {
        const response = await fetch(
            'https://api.github.com/repos/Alien-Worlds/the-lore/contents/README.md?ref=main',
            { headers: githubHeaders('application/vnd.github.raw+json') }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        res.send(text);
    } catch (error) {
        console.error('Error fetching Canon lore:', error);
        res.status(500).send('Error fetching Canon lore');
    }
});

// Proxy endpoint for fetching Proposed lore
app.get('/api/proposed', async (req, res) => {
    try {
        const response = await fetch(
            'https://api.github.com/repos/Alien-Worlds/the-lore/pulls?state=open&ref=main',
            { headers: githubHeaders('application/vnd.github+json') }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const pulls = await response.json();
        res.json(pulls);
    } catch (error) {
        console.error('Error fetching Proposed lore:', error);
        res.status(500).send('Error fetching Proposed lore');
    }
});

// Proxy endpoint for fetching pull request files
app.get('/api/pulls/:number/files', async (req, res) => {
    const { number } = req.params;
    try {
        const response = await fetch(
            `https://api.github.com/repos/Alien-Worlds/the-lore/pulls/${number}/files`,
            { headers: githubHeaders('application/vnd.github+json') }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const files = await response.json();
        res.json(files);
    } catch (error) {
        console.error(`Error fetching files for PR #${number}:`, error);
        res.status(500).send(`Error fetching files for PR #${number}`);
    }
});

// Proxy endpoint for fetching file contents
app.get('/api/contents', async (req, res) => {
    const { url } = req.query;
    try {
        const response = await fetch(url, {
            headers: githubHeaders('application/vnd.github.raw+json')
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const content = await response.text();
        res.send(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).send('Error fetching content');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
