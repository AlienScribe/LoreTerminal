// server.js

import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { createServer as createViteServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { graphqlServer, queryWAXGraphQL } from './server/graphql.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

function githubHeaders(accept) {
  const headers = {
    Accept: accept,
    'User-Agent': 'A01-Canon-Terminal'
  }
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`
  }
  return headers
}

// Create Vite server in middleware mode
const vite = await createViteServer({
  root: process.cwd(),
  server: { middlewareMode: true }
})

// Use Vite's connect instance as middleware
app.use(vite.middlewares)

// Serve static files
app.use(express.static(path.resolve(__dirname, 'public')))
app.use('/assets', express.static(path.resolve(__dirname, 'public/assets')))

// Built-in middleware to parse JSON bodies
app.use(express.json())

// Mount Apollo-style GraphQL server (for your own schema)
await graphqlServer.start()
graphqlServer.applyMiddleware({ app })

// ----------------------------------------
// API routes
// ----------------------------------------

// 1. Proxy POSTs from front-end to Alien Worlds GraphQL
app.post('/api/aw-query', async (req, res) => {
  try {
    // Assumes front-end sends { query: "...", variables: { ... } }
    const { query, variables } = req.body
    const waxResult = await queryWAXGraphQL(query, variables || {})
    // waxResult should already be a JS object parsed from JSON
    res.json(waxResult)
  } catch (error) {
    console.error('Error proxying /api/aw-query:', error)
    res.status(500).json({ error: 'Failed to fetch from WAX GraphQL' })
  }
})

// 2. Canon lore via your own GraphQL schema
app.get('/api/canon', async (req, res) => {
  try {
    const result = await graphqlServer.executeOperation({
      query: `
        query {
          lore {
            id
            title
            content
            author
            date
            category
          }
        }
      `
    })

    if (result.errors) {
      console.error('GraphQL errors in /api/canon:', result.errors)
      return res.status(500).json({ error: 'GraphQL returned errors' })
    }

    // Extract data.lore
    const lore = result.data?.lore || []
    res.json(lore)
  } catch (error) {
    console.error('Error fetching canon lore:', error)
    res.status(500).json({ error: 'Failed to fetch canon lore' })
  }
})

// 3. Learn resources: fetch curated blog posts as raw HTML
app.get('/api/learn', async (req, res) => {
  try {
    const blogUrls = [
      'https://alienworlds.io/blogs/tokenized-lore-now-live-shape-the-alien-worlds-universe/',
      'https://alienworlds.io/blogs/tokenized-lore-ui-guide/',
      'https://alienworlds.io/blogs/proposing-new-lore-detailed-submission-guide/'
    ]

    const fetchPromises = blogUrls.map(async (url) => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url} (status ${response.status})`)
      }
      const html = await response.text()
      return { url, html }
    })

    const results = await Promise.all(fetchPromises)
    res.json(results)
  } catch (error) {
    console.error('Error fetching learning resources:', error)
    res.status(500).json({ error: 'Failed to fetch learning resources' })
  }
})

// 4. Votes data via WAX GraphQL
app.get('/api/votes', async (req, res) => {
  try {
    const waxQuery = `
      query {
        activeVotes {
          id
          title
          description
          count
        }
      }
    `
    const result = await queryWAXGraphQL(waxQuery)
    if (result.errors) {
      console.error('GraphQL errors in /api/votes:', result.errors)
      return res.status(500).json({ error: 'GraphQL returned errors' })
    }
    const votes = result.data?.activeVotes || []
    res.json(votes)
  } catch (error) {
    console.error('Error fetching votes:', error)
    res.status(500).json({ error: 'Failed to fetch votes' })
  }
})

// 5. Races via your own GraphQL schema
app.get('/api/races', async (req, res) => {
  try {
    const result = await graphqlServer.executeOperation({
      query: `
        query {
          races {
            id
            name
            description
            homeworld
            techLevel
            population
            history
          }
        }
      `
    })

    if (result.errors) {
      console.error('GraphQL errors in /api/races:', result.errors)
      return res.status(500).json({ error: 'GraphQL returned errors' })
    }

    const races = result.data?.races || []
    res.json(races)
  } catch (error) {
    console.error('Error fetching races:', error)
    res.status(500).json({ error: 'Failed to fetch races' })
  }
})

// 6. Technology via your own GraphQL schema
app.get('/api/technology', async (req, res) => {
  try {
    const result = await graphqlServer.executeOperation({
      query: `
        query {
          technology {
            id
            name
            description
            origin
            era
            impact
            relatedRaces {
              id
              name
            }
          }
        }
      `
    })

    if (result.errors) {
      console.error('GraphQL errors in /api/technology:', result.errors)
      return res.status(500).json({ error: 'GraphQL returned errors' })
    }

    const technology = result.data?.technology || []
    res.json(technology)
  } catch (error) {
    console.error('Error fetching technology:', error)
    res.status(500).json({ error: 'Failed to fetch technology' })
  }
})

// 7. Proposed lore: list open pull requests on GitHub
app.get('/api/proposed', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.github.com/repos/Alien-Worlds/the-lore/pulls?state=open',
      { headers: githubHeaders('application/vnd.github+json') }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API Error (Proposed PRs):', errorText)
      return res.status(response.status).json({ error: 'GitHub returned error' })
    }

    const pulls = await response.json()
    res.json(pulls)
  } catch (err) {
    console.error('Error fetching proposed lore:', err)
    res.status(500).json({ error: 'Error fetching proposed lore' })
  }
})

// 8. Pull request file list (GitHub)
app.get('/api/pulls/:number/files', async (req, res) => {
  const { number } = req.params
  try {
    const response = await fetch(
      `https://api.github.com/repos/Alien-Worlds/the-lore/pulls/${number}/files`,
      { headers: githubHeaders('application/vnd.github+json') }
    )
    if (!response.ok) {
      console.error(`GitHub API Error (PR #${number} files): HTTP ${response.status}`)
      return res.status(response.status).json({ error: 'GitHub returned error' })
    }
    const files = await response.json()
    res.json(files)
  } catch (err) {
    console.error(`Error fetching PR #${number} files:`, err)
    res.status(500).json({ error: `Error fetching PR #${number}` })
  }
})

// 9. Raw file content (GitHub)
app.get('/api/contents', async (req, res) => {
  const { url } = req.query
  try {
    if (!url) {
      return res.status(400).json({ error: 'Missing "url" query parameter' })
    }
    const response = await fetch(url, {
      headers: githubHeaders('application/vnd.github.raw+json')
    })
    if (!response.ok) {
      console.error(`GitHub API Error (contents URL): HTTP ${response.status}`)
      return res.status(response.status).json({ error: 'GitHub returned error' })
    }
    const text = await response.text()
    res.send(text)
  } catch (err) {
    console.error('Error fetching file content:', err)
    res.status(500).json({ error: 'Error fetching file content' })
  }
})

// ----------------------------------------
// Fallback: serve the main application
// ----------------------------------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something broke!' })
})

app.listen(PORT, () => {
  console.log(`✅ A-01 Terminal running at http://localhost:${PORT}`)
  console.log(`GraphQL endpoint: http://localhost:${PORT}${graphqlServer.graphqlPath}`)
})
