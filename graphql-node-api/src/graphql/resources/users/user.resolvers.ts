import { GraphQLResolveInfo } from "graphql"
import { DbConnection } from "../../../interfaces/DbConnectionInterface"
import { Transaction } from "sequelize"
import { UserInstance } from "../../../models/UserModel"

export const resolvers = {
    User: {
        posts: (parent: UserInstance, { first = 10, offset = 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.Post.findAll({
                where: { 
                    author: parent.get('id')
                },
                limit: first,
                offset
            })
        },
    },
    Query: {
        users: (parent, { first = 10, offset = 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.User.findAll({
                limit: first,
                offset
            });
        },
        user: async (parent, { id }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            const user = await db.User.findById(id);

            if (!user) {
                throw new Error(`User with id ${id} not found`)
            }

            return user;
        }
    },
    Mutation: {
        createUser: (parent, { input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.create(input, { transaction: t })
            })
        },
        updateUser: (parent, { id, input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return db.sequelize.transaction(async (t: Transaction) => {
                const user = await db.User.findById(id);
                if (!user) {
                    throw new Error(`User with id ${id} not found`)
                }

                return user.update(input, { transaction: t });
            })
        },
        updateUserPassword: (parent, { id, input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return db.sequelize.transaction(async (t: Transaction) => {
                const user = await db.User.findById(id);
                if (!user) {
                    throw new Error(`User with id ${id} not found`)
                }

                return !!await user.update(input, { transaction: t });
            })
        },
        deleteUser: (parent, { id, input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return db.sequelize.transaction(async (t: Transaction) => {
                const user = await db.User.findById(id)
                
                if (!user) {
                    throw new Error(`User with id ${id} not found`)
                }

                await user.destroy({ transaction: t })

                return true
            })
        }
    }
}