import { postMutations } from './resources/post/post.schema';
import { UserMutations } from './resources/users/users.schema'

const Mutation = `
    type Mutation {
        ${postMutations}
        ${UserMutations}   
    }
`;

export {
    Mutation
}