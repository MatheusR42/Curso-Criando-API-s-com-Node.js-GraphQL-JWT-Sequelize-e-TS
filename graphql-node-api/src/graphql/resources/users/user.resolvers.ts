import { GraphQLResolveInfo } from "graphql"
import { DbConnection } from "../../../interfaces/DbConnectionInterface"
import { Transaction } from "sequelize"
import { UserInstance } from "../../../models/UserModel"
import { handleError, throwError } from "../../../utils/utils"
import { compose } from "../../composable/composable.resolver"
import { authResolvers } from "../../composable/auth.resolver"
import { AuthUser } from "../../../interfaces/AuthUserInterface"

export const userResolvers = {
    User: {
        posts: (parent: UserInstance, { first = 10, offset = 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
            return db.Post.findAll({
                where: { 
                    author: parent.get('id')
                },
                limit: first,
                offset
            }).catch(handleError)
        },
    },
    Query: {
        users: (_parent, { first = 10, offset = 0 }, { db }: { db: DbConnection }) => {
            return db.User.findAll({
                limit: first,
                offset
            }).catch(handleError)
        },
        user: async (_parent, { id }, { db }: { db: DbConnection }) => {
            id = parseInt(id)
            
            try {
                const user = await db.User.findById(id);
                if (!user) {
                    throw new Error(`User with id ${id} not found`)
                }
    
                return user;
            } catch (error) {
                return handleError(error)
            }
        }
    },
    Mutation: {
        createUser: (_parent, { input }, { db }: { db: DbConnection }) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.create(input, { transaction: t })
            }).catch(handleError)
        },
        updateUser: compose(...authResolvers)((_parent, { input }, { db, authUser }: { db: DbConnection, authUser: AuthUser }) => {
            const id = authUser.id;

            return db.sequelize.transaction(async (t: Transaction) => {
                const user = await db.User.findById(id);
                
                throwError(!user, `User with id ${id} not found`)

                return user.update(input, { transaction: t });
            }).catch(handleError)
        }),
        updateUserPassword: compose(...authResolvers)((_parent, { input }, { db, authUser }: { db: DbConnection, authUser: AuthUser }) => {
            const id = authUser.id;

            return db.sequelize.transaction(async (t: Transaction) => {
                const user = await db.User.findById(id);

                throwError(!user, `User with id ${id} not found`)

                return !!await user.update(input, { transaction: t });
            }).catch(handleError)
        }),
        deleteUser: compose(...authResolvers)((_parent, _args, { db, authUser }: { db: DbConnection, authUser: AuthUser }) => {
            const id = authUser.id

            return db.sequelize.transaction(async (t: Transaction) => {
                const user = await db.User.findById(id)
                
                throwError(!user, `User with id ${id} not found`)

                await user.destroy({ transaction: t })

                return true
            }).catch(handleError)
        })
    }
}