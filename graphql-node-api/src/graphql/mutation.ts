import { commentMutations } from './resources/comment/comment.schema';
import { postMutations } from './resources/post/post.schema';
import { userMutations } from './resources/users/users.schema'
import { tokenMutations } from './resources/token/token.schema';

const Mutation = `
    type Mutation {
        ${commentMutations}   
        ${postMutations}
        ${userMutations}
        ${tokenMutations}
    }
`;

export {
    Mutation
}