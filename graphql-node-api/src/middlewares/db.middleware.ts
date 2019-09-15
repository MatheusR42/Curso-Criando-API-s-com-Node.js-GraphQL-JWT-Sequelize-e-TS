import { RequestHandler, Request, Response, NextFunction } from "express";
import db from '../models'
import { DataLoaderFactory } from "../graphql/dataloaders/DataLoaderFactory";

export const dbMiddleware = (dataLoaderFactory: DataLoaderFactory): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        req['context'].db = db
        //create a new instace to each request to reset cache
        req['context'].dataloaders = dataLoaderFactory.getLoaders();
        next()
    }
}
