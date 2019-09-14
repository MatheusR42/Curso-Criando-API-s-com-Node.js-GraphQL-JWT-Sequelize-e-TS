import { RequestHandler, Request, Response, NextFunction } from "express";
import db from '../models'

export const dbMiddleware = (): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        req['context'].db = db
        next()
    }
}
