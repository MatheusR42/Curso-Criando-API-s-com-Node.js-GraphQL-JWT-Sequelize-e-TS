import { Transaction } from "sequelize";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { PostInstance } from "../../../models/PostModel";
import { CommentInstance } from "../../../models/CommentModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { AuthUser } from "../../../interfaces/AuthUserInterface";
import { DataLoaders } from "../../../interfaces/DataLoadersInterface";
import { GraphQLResolveInfo } from 'graphql';
import { RequestedFields } from "../../ast/RequestedFields";

export const postResolvers = {
    Post: {
        author: (parent: PostInstance, _args, {dataloaders: { userLoader }}: {dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            return userLoader.load({
                        key: parent.get('author'),
                        info
                    })
                    .catch(handleError)
        },
        comments: (parent: CommentInstance, {first = 10, offset = 0}, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            return db.Comment.findAll({
                where: { post: parent.get('id') },
                limit: first,
                offset,
                attributes: requestedFields.getFields(info)
            }).catch(handleError)
        }
    },
    Query: {
        posts: (_parent, {first = 10, offset = 0}, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            return db.Post.findAll({
                limit: first,
                offset,
                attributes: requestedFields.getFields(info, { keep: ['id'], exclude: ['comments']})
            }).catch(handleError)
        },
        post: async (_parent, { id }, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            id = parseInt(id)

            try {
                const post = await db.Post.findById(id, {
                    attributes: requestedFields.getFields(info, { keep: ['id'], exclude: ['comments']})
                })
    
                throwError(!post, `Post with id ${id} not found.`)
    
                return post
            } catch (error) {
                return handleError(error)
            }
        }
    },
    Mutation: {
        createPost: compose(...authResolvers)((_parent, {input}, {db, authUser}: {db: DbConnection, authUser: AuthUser}) => {
            input.author = authUser.id

            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.create(input, { transaction: t })
            }).catch(handleError)
        }),
        updatePost: compose(...authResolvers)((_parent, {id, input}, {db, authUser}: {db: DbConnection, authUser: AuthUser}) => {
            id = parseInt(id)
            return db.sequelize.transaction(async (t: Transaction) => {
                const post = await db.Post.findById(id)

                throwError(!post, `Post with id ${id} not found.`)
                throwError(post.get('author') != authUser.id, `Unauthorized! You can only edit your posts!`)
                input.author = authUser.id

                return post.update(input, { transaction: t })
            }).catch(handleError)
        }),
        deletePost: compose(...authResolvers)((_parent, { id }, { db, authUser }: { db: DbConnection, authUser: AuthUser }) => {
            id = parseInt(id)
            return db.sequelize.transaction(async (t: Transaction) => {
                const post = await db.Post.findById(id)
                
                throwError(!post, `Post with id ${id} not found.`)
                throwError(post.get('author') != authUser.id, `Unauthorized! You can only delete your posts!`)

                await post.destroy({ transaction: t })

                return true
            }).catch(handleError)
        })
    }
}