import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { CommentInstance } from "../../../models/CommentModel";
import { Transaction } from "sequelize";
import { handleError } from "../../../utils/utils";

export const commentResolvers = {
    Comment: {
        user: (parent: CommentInstance, _args, { db }: { db: DbConnection }) => {
            return db.User.findById(parent.get('user'))
                .catch(handleError)
        },
        post: (parent: CommentInstance, _args, { db }: { db: DbConnection }) => {
            return db.Post.findById(parent.get('post'))
                .catch(handleError)
        }
    },
    Query: {
        commentsByPost: (_parent, { postId, first = 10, offset = 10 }, { db }: { db: DbConnection }) => {
            return db.Comment.findAll({
                where: { post: postId },
                limit: first,
                offset
            }).catch(handleError)
        }
    },
    Mutation: {
        createComment: (_parent, { input }, { db }: { db: DbConnection }) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.create(input, { transaction: t })
            }).catch(handleError)
        },
        updateComment: (_parent, { id, input }, { db }: { db: DbConnection }) => {
            id = parseInt(id)
            return db.sequelize.transaction(async (t: Transaction) => {
                const comment: CommentInstance = await db.Comment.findById(id)

                if (!comment) {
                    throw new Error(`Comment with id ${id} not found.`)
                }

                return comment.update(input, { transaction: t })
            }).catch(handleError)
        },
        deleteComment: (_parent, { id }, { db }: { db: DbConnection }) => {
            id = parseInt(id)
            return db.sequelize.transaction(async (t: Transaction) => {
                const comment: CommentInstance = await db.Comment.findById(id)

                if (!comment) {
                    throw new Error(`Comment with id ${id} not found`)
                }

                await comment.destroy({ transaction: t })

                return true
            }).catch(handleError)
        }
    }
}