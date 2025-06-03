// src/graphql.js
import { GraphQLClient } from 'graphql-request';

// Create GraphQL client with proper URL
const graphqlClient = new GraphQLClient('http://localhost:3000/graphql', {
    headers: {
        'Content-Type': 'application/json',
    },
});

// Cache for API responses
const cache = {
    lore: new Map(),
    planets: new Map(),
    races: new Map(),
    technology: new Map()
};

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Fetch lore data from the server
 * @returns {Promise<Object>} Lore data
 */
export async function fetchLoreData() {
    try {
        const query = `
            query {
                lore {
                    id
                    title
                    content
                    category
                    timestamp
                }
            }
        `;

        const data = await graphqlClient.request(query);
        return data.lore;
    } catch (error) {
        console.error('Error fetching lore data:', error);
        throw error;
    }
}

/**
 * Fetch planet data from the server
 * @param {string} planetName - Name of the planet to fetch
 * @returns {Promise<Object>} Planet data
 */
export async function fetchPlanetData(planetName) {
    try {
        const query = `
            query GetPlanet($name: String!) {
                planet(name: $name) {
                    name
                    type
                    climate
                    resources
                    natives {
                        species
                        population
                        intelligence
                    }
                }
            }
        `;

        const variables = { name: planetName };
        const data = await graphqlClient.request(query, variables);
        return data.planet;
    } catch (error) {
        console.error('Error fetching planet data:', error);
        throw error;
    }
}

/**
 * Fetch race data from the server
 * @returns {Promise<Array>} Race data
 */
export async function fetchRaceData() {
    try {
        const query = `
            query {
                races {
                    id
                    name
                    description
                    traits
                    homeworld
                }
            }
        `;

        const data = await graphqlClient.request(query);
        return data.races;
    } catch (error) {
        console.error('Error fetching race data:', error);
        throw error;
    }
}

/**
 * Fetch technology data from the server
 * @returns {Promise<Array>} Technology data
 */
export async function fetchTechnologyData() {
    try {
        const query = `
            query {
                technology {
                    id
                    name
                    description
                    level
                    requirements
                }
            }
        `;

        const data = await graphqlClient.request(query);
        return data.technology;
    } catch (error) {
        console.error('Error fetching technology data:', error);
        throw error;
    }
}

/**
 * Clear the API cache
 */
export function clearCache() {
    Object.values(cache).forEach(cacheMap => cacheMap.clear());
}

/**
 * Get cache status
 * @returns {Object} Cache status information
 */
export function getCacheStatus() {
    return {
        loreSize: cache.lore.size,
        planetsSize: cache.planets.size,
        racesSize: cache.races.size,
        technologySize: cache.technology.size,
        expirationTime: CACHE_EXPIRATION
    };
}
