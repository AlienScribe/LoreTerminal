// server/graphql.js
import { ApolloServer } from 'apollo-server-express';
import { gql } from 'apollo-server-express';
import { WebSocket } from 'ws';
import { createClient } from 'graphql-ws';

// Define the GraphQL schema
const typeDefs = gql`
    type Race {
        id: ID!
        name: String!
        description: String!
        traits: [String]!
        homeworld: String!
    }

    type Technology {
        id: ID!
        name: String!
        description: String!
        level: Int!
        requirements: [String]!
    }

    type Planet {
        name: String!
        type: String!
        climate: String!
        resources: [String]!
        natives: [Native]!
    }

    type Native {
        species: String!
        population: Int!
        intelligence: Int!
    }

    type Lore {
        id: ID!
        title: String!
        content: String!
        category: String!
        timestamp: String!
    }

    type UserProfile {
        username: String!
        wallet: String!
        contributions: Int!
        votes: Int!
        planetsVisited: Int!
    }

    type Query {
        lore: [Lore]!
        planet(name: String!): Planet
        races: [Race]!
        technology: [Technology]!
        userProfile: UserProfile!
    }
`;


// Define resolvers
const resolvers = {
    Query: {
        lore: async () => {
            try {
                const res = await fetch('https://raw.githubusercontent.com/Alien-Worlds/the-lore/main/README.md')
                if (!res.ok) throw new Error('Failed to fetch canon')
                const text = await res.text()
                return [{ id: 'canon', title: 'Alien Worlds Lore', content: text, category: 'canon', timestamp: new Date().toISOString() }]
            } catch (err) {
                console.error('Lore resolver error:', err)
                return []
            }
        },
        planet: async (_, { name }) => {
            try {
                const query = `query ($dacId: String!) { planet_details(dac_id: $dacId) { planet_details { name description } } }`
                const result = await queryWAXGraphQL(query, { dacId: name })
                const details = result.data?.planet_details?.planet_details?.[0] || {}
                return {
                    name: details.name || name,
                    type: '',
                    climate: details.description || '',
                    resources: [],
                    natives: []
                }
            } catch (err) {
                console.error('Planet resolver error:', err)
                return null
            }
        },
        races: async () => {
            try {
                const res = await fetch('https://raw.githubusercontent.com/Alien-Worlds/aw-lore-data/master/races.json')
                if (!res.ok) throw new Error('Failed to fetch races')
                return await res.json()
            } catch (err) {
                console.error('Races resolver error:', err)
                return []
            }
        },
        technology: async () => {
            try {
                const res = await fetch('https://raw.githubusercontent.com/Alien-Worlds/aw-lore-data/master/technology.json')
                if (!res.ok) throw new Error('Failed to fetch technology')
                return await res.json()
            } catch (err) {
                console.error('Technology resolver error:', err)
                return []
            }
        },
        userProfile: async () => ({ username: '', wallet: '', contributions: 0, votes: 0, planetsVisited: 0 })
    }
};

// Create Apollo Server instance
export const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
        // Add any context needed for authentication, etc.
        token: req.headers.authorization
    })
});

// WAX GraphQL client setup
const WAX_GRAPHQL_ENDPOINT = process.env.WAX_GRAPHQL_ENDPOINT || 'wss://wax.greymass.com/v1/chain';

const waxClient = createClient({
    url: WAX_GRAPHQL_ENDPOINT,
    webSocketImpl: WebSocket,
    connectionParams: {
        // Add any required connection parameters
    }
});

// WAX GraphQL query function
export async function queryWAXGraphQL(query, variables = {}) {
    try {
        const result = await waxClient.request({
            query,
            variables
        });
        return result;
    } catch (error) {
        console.error('WAX GraphQL query error:', error);
        throw error;
    }
}

export { graphqlServer as server };
