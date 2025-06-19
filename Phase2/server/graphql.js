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

// Placeholder resolvers - replace with real data sources
const resolvers = {
    Query: {
        lore: () => [],
        planet: () => null,
        races: () => [],
        technology: () => [],
        userProfile: () => null
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
async function queryWAXGraphQL(query, variables = {}) {
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
export { queryWAXGraphQL };
