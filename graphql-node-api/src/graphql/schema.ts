import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'
import { Query } from './query'
import { Mutation } from './mutation'
import { commentTypes } from './resources/comment/comment.schema';
import { postTypes } from './resources/post/post.schema';
import { userTypes } from './resources/users/users.schema';
import { commentResolvers } from './resources/comment/comment.resolvers';
import { userResolvers } from './resources/users/user.resolvers';
import { postResolvers } from './resources/post/post.resolvers';
import { tokenTypes, tokenMutations } from './resources/token/token.schema';

const resolvers = merge(
    commentResolvers,
    postResolvers,
    userResolvers
)

const SchemaDefinition = `
    type Schema {
        query: Query,
        mutation: Mutation
    }
`;

export default makeExecutableSchema({
    typeDefs: [
        SchemaDefinition,
        Query,
        Mutation,
        commentTypes,
        postTypes,
        userTypes,
        tokenMutations,
        tokenTypes
    ],
    resolvers
});
