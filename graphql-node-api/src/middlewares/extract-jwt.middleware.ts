import * as jwt from 'jsonwebtoken'
import { RequestHandler, Request, Response, NextFunction } from "express"
import db from '../models'
import { UserInstance } from '../models/UserModel'

export const extractJwtMiddleware = (): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authorization: string = req.get('authorization') //Bearer token
        const token: string = authorization ? authorization.split(' ')[1]: null

        req['context'] = {}
        req['context']['authorization'] = authorization

        if (!token) {
            return next() //next returns void
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded: any) => {
            if (err) {
                return next()
            }

            const user: UserInstance = await db.User.findById(decoded.sub, {
                attributes: ['id', 'email']
            })

            if (user) {
                req['context']['user'] = {
                    id: user.get('id'),
                    email: user.get('email')
                }
            }

            return next()
        })
    }
}
