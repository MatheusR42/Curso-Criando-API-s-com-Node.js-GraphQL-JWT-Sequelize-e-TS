import { GraphQLResolveInfo } from "graphql"
import { DbConnection } from "../../../interfaces/DbConnectionInterface"
import { Transaction } from "sequelize"
import { UserInstance } from "../../../models/UserModel"

export const userResolvers = {
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
        users: (_parent, { first = 10, offset = 0 }, { db }: { db: DbConnection }) => {
            return db.User.findAll({
                limit: first,
                offset
            });
        },
        user: async (_parent, { id }, { db }: { db: DbConnection }) => {
            const user = await db.User.findById(id);

            if (!user) {
                throw new Error(`User with id ${id} not found`)
            }

            return user;
        }
    },
    Mutation: {
        createUser: (_parent, { input }, { db }: { db: DbConnection }) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.create(input, { transaction: t })
            })
        },
        updateUser: (_parent, { id, input }, { db }: { db: DbConnection }) => {
            id = parseInt(id)
            return db.sequelize.transaction(async (t: Transaction) => {
                const user = await db.User.findById(id);
                if (!user) {
                    throw new Error(`User with id ${id} not found`)
                }

                return user.update(input, { transaction: t });
            })
        },
        updateUserPassword: (_parent, { id, input }, { db }: { db: DbConnection }) => {
            id = parseInt(id)
            return db.sequelize.transaction(async (t: Transaction) => {
                const user = await db.User.findById(id);
                if (!user) {
                    throw new Error(`User with id ${id} not found`)
                }

                return !!await user.update(input, { transaction: t });
            })
        },
        deleteUser: (_parent, { id }, { db }: { db: DbConnection }) => {
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