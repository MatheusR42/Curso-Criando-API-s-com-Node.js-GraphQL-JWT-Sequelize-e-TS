import { commentQueries } from './resources/comment/comment.schema';
import { postQueries } from './resources/post/post.schema';
import { UserQueries } from './resources/users/users.schema'

const Query = `
    type Query {
        ${commentQueries}
        ${postQueries}
        ${UserQueries}
    }
`;

export {
    Query
}