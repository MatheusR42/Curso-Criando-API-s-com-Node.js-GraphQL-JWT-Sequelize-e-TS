import { RequestHandler, Request, Response, NextFunction } from "express";
import db from '../models'
import { DataLoaderFactory } from "../graphql/dataloaders/DataLoaderFactory";
import { RequestedFields } from "../graphql/ast/RequestedFields";

export const dbMiddleware = (dataLoaderFactory: DataLoaderFactory, requestedFields: RequestedFields): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        req['context'].db = db
        //create a new instace to each request to reset cache
        req['context'].dataloaders = dataLoaderFactory.getLoaders()
        req['context'].requestedFields = requestedFields
        next()
    }
}
