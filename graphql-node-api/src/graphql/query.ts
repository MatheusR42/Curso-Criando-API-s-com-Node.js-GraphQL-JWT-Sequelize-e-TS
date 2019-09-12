import { postQueries } from './resources/post/post.schema';
import { UserQueries } from './resources/users/users.schema'

const Query = `
    type Query {
        ${postQueries}
        ${UserQueries}
    }
`;

export {
    Query
}