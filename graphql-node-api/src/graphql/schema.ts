import { makeExecutableSchema } from 'graphql-tools'

const typeDefs = `
    type User {
        id: ID!
        name: String!
        email: String!
    }

    type Query {
        allUsers: [User!]
    }

    type Mutation {
        createUser(name: String!, email: String!): User
    }
`

const users: any[] = [
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
]

const resolvers = {
    Query: {
        allUsers: () => users
    },
    Mutation: {
        createUser: (parent, args, context, info) => {
            const newUser = Object.assign({id: users.length + 1}, args)
            users.push(newUser)
            return newUser;
        }
    }
}

export default makeExecutableSchema({typeDefs, resolvers})
