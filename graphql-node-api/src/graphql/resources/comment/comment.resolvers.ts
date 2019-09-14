import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { CommentInstance } from "../../../models/CommentModel";

export const resolvers = {
    Comment: {
        user: (parent: CommentInstance, _args, {db}: {db: DbConnection}) => {
            return db.User.findById(parent.get('user'))
        },
        post: (parent: CommentInstance, _args, {db}: {db: DbConnection}) => {
            return db.Post.findById(parent.get('post'))
        }
    },
    Query: {
        commentsByPost: (_parent, {postId, first = 10, offset = 10}, {db}: {db: DbConnection}) => {
            return db.Comment.findAll({
                where: { post: postId },
                limit: first,
                offset
            })
        }
    }
}