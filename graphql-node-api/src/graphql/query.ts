import { UserQueries } from './resources/users/users.schema'

const Query = `
    type Query {
        ${UserQueries}
    }
`;

export {
    Query
}