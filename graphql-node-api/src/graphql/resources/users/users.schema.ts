const UserTypes = `
    #User definition type
    type User {
        #user id
        id: ID!
        name: String!
        email: String!
        photo: String 
        createdAt: String!
        updatedAt: String!
    }

    input UserCreateInput {
        name: String!
        email: String!
        password: String!
    }

    input UserUpdateInput {
        name: String!
        email: String!
        photo: String!
    }

    input UserUpdatePasswordInput {
        password: String!
    }
`;

const UserQueries = `
    users(first: Int, offset: Int): [ User! ]!
    user(id: ID!): User
`;

const UserMutations = `
    createUser(input: UserCreateInput!): User
    updateUser(id: ID!, input: UserUpdateInput!): User
    updateUserPassword(id: ID!, input: UserUpdatePasswordInput): Boolean
    deleteUser(id: ID!): Boolean
`;

export {
    UserTypes,
    UserQueries,
    UserMutations
}
