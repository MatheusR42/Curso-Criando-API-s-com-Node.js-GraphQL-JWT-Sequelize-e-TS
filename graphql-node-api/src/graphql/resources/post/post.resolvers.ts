import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { PostInstance } from "../../../models/PostModel";
import { CommentInstance } from "../../../models/CommentModel";
import { Transaction } from "sequelize";

export const resolvers = {
    Post: {
        author: (parent: PostInstance, _args, {db}: {db: DbConnection}) => {
            return db.User.findById(parent.get('author'))
        },
        comments: (parent: CommentInstance, {first = 10, offset = 0}, {db}: {db: DbConnection}) => {
            return db.User.findAll({
                where: { post: parent.get('id') },
                limit: first,
                offset
            })
        }
    },
    Query: {
        posts: (_parent, {first = 10, offset = 0}, {db}: {db: DbConnection}) => {
            return db.Post.findAll({
                limit: first,
                offset
            })
        },
        post: async (_parent, { id }, {db}: {db: DbConnection}) => {
            id = parseInt(id)
            const post = await db.Post.findById(id)

            if (!post) {
                throw new Error(`Post with id ${id} not found.`)
            }

            return post
        }
    },
    Mutation: {
        createPost: (_parent, {input}, {db}: {db: DbConnection}) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.create(input, { transaction: t })
            })
        },
        updatePost: (_parent, {id, input}, {db}: {db: DbConnection}) => {
            id = parseInt(id)
            return db.sequelize.transaction(async (t: Transaction) => {
                const post = await db.Post.findById(id)

                if (!post) {
                    throw new Error(`Post with id ${id} not found.`)
                }

                return post.update(input, { transaction: t })
            })
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
            })
        }
    }
}