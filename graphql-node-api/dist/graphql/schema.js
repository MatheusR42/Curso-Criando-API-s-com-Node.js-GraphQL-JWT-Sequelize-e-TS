"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const typeDefs = `
    type User {
        id: ID!
        name: String!
        email: String!
    }

    type Query {
        allUsers: [User!]
    }
`;
const users = [
    {
        id: 1,
        name: 'João',
        email: 'joao@email.com'
    },
    {
        id: 2,
        name: 'Mario',
        email: 'mario@email.com'
    }
];
const resolvers = {
    Query: {
        allUsers: () => users
    }
};
exports.default = graphql_tools_1.makeExecutableSchema({ typeDefs, resolvers });
