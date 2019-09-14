import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { PostInstance } from "../../../models/PostModel";
import { CommentInstance } from "../../../models/CommentModel";
import { Transaction } from "sequelize";
import { handleError } from "../../../utils/utils";

export const postResolvers = {
    Post: {
        author: (parent: PostInstance, _args, {db}: {db: DbConnection}) => {
            return db.User.findById(parent.get('author')).catch(handleError)
        },
        comments: (parent: CommentInstance, {first = 10, offset = 0}, {db}: {db: DbConnection}) => {
            return db.User.findAll({
                where: { post: parent.get('id') },
                limit: first,
                offset
            }).catch(handleError)
        }
    },
    Query: {
        posts: (_parent, {first = 10, offset = 0}, {db}: {db: DbConnection}) => {
            return db.Post.findAll({
                limit: first,
                offset
            }).catch(handleError)
        },
        post: async (_parent, { id }, {db}: {db: DbConnection}) => {
            id = parseInt(id)

            try {
                const post = await db.Post.findById(id)
    
                if (!post) {
                    throw new Error(`Post with id ${id} not found.`)
                }
    
                return post
            } catch (error) {
                return handleError(error)
            }
        }
    },
    Mutation: {
        createPost: (_parent, {input}, {db}: {db: DbConnection}) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.create(input, { transaction: t })
            }).catch(handleError)
        },
        updatePost: (_parent, {id, input}, {db}: {db: DbConnection}) => {
            id = parseInt(id)
            return db.sequelize.transaction(async (t: Transaction) => {
                const post = await db.Post.findById(id)

                if (!post) {
                    throw new Error(`Post with id ${id} not found.`)
                }

                return post.update(input, { transaction: t })
            }).catch(handleError)
        },
        deletePost: (_parent, { id }, { db }: { db: DbConnection }) => {
            id = parseInt(id)
            return db.sequelize.transaction(async (t: Transaction) => {
                const post = await db.Post.findById(id)
                
                if (!post) {
                    throw new Error(`Post with id ${id} not found`)
                }

                await post.destroy({ transaction: t })

                return true
            }).catch(handleError)
        }
    }
}