import { UserMutations } from './resources/users/users.schema'

const Mutation = `
    type Mutation {
        ${UserMutations}   
    }
`;

export {
    Mutation
}