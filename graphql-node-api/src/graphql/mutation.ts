import { commentMutations } from './resources/comment/comment.schema';
import { postMutations } from './resources/post/post.schema';
import { UserMutations } from './resources/users/users.schema'

const Mutation = `
    type Mutation {
        ${commentMutations}   
        ${postMutations}
        ${UserMutations}
    }
`;

export {
    Mutation
}