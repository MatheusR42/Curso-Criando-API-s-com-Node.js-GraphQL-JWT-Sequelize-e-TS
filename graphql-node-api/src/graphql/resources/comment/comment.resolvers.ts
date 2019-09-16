import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { CommentInstance } from "../../../models/CommentModel";
import { Transaction } from "sequelize";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { AuthUser } from "../../../interfaces/AuthUserInterface";
import { DataLoaders } from "../../../interfaces/DataLoadersInterface";
import { RequestedFields } from "../../ast/RequestedFields";
import { GraphQLResolveInfo } from "graphql";

export const commentResolvers = {
    Comment: {
        user: (parent: CommentInstance, _args, { dataloaders: { userLoader } } : { dataloaders: DataLoaders }) => {
            return userLoader.load(parent.get('user'))
                    .catch(handleError)
        },
        post: (parent: CommentInstance, _args, { dataloaders: { postLoader } } : { dataloaders: DataLoaders }) => {
            return postLoader.load(parent.get('post'))
                    .catch(handleError)
        }
    },
    Query: {
        commentsByPost: (_parent, { postId, first = 10, offset = 10 }, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            postId = parseInt(postId)
            
            return db.Comment.findAll({
                where: { post: postId },
                limit: first,
                offset,
                attributes: requestedFields.getFields(info)
            }).catch(handleError)   
        }
    },
    Mutation: {
        createComment: compose(...authResolvers)((_parent, { input }, { db, authUser }: { db: DbConnection, authUser: AuthUser }) => {
            input.user = authUser.id
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.create(input, { transaction: t })
            }).catch(handleError)
        }),
        updateComment: compose(...authResolvers)((_parent, { id, input }, { db, authUser }: { db: DbConnection, authUser: AuthUser }) => {
            id = parseInt(id)
            return db.sequelize.transaction(async (t: Transaction) => {
                const comment: CommentInstance = await db.Comment.findById(id)

                throwError(!comment, `Comment with id ${id} not found.`)
                throwError(comment.get('user') != authUser.id, `Unauthorized! You can only edit your comments!`)

                input.user = authUser.id
                return comment.update(input, { transaction: t })
            }).catch(handleError)
        }),
        deleteComment: compose(...authResolvers)((_parent, { id }, { db, authUser }: { db: DbConnection, authUser: AuthUser }) => {
            id = parseInt(id)
            return db.sequelize.transaction(async (t: Transaction) => {
                const comment: CommentInstance = await db.Comment.findById(id)

                throwError(!comment, `Comment with id ${id} not found.`)
                throwError(comment.get('user') != authUser.id, `Unauthorized! You can only delete your comments!`)

                await comment.destroy({ transaction: t })

                return true
            }).catch(handleError)
        })
    }
}