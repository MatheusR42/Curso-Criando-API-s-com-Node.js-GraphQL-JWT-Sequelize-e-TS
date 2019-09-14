import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { PostInstance } from "../../../models/PostModel";
import { CommentInstance } from "../../../models/CommentModel";

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
    }
}