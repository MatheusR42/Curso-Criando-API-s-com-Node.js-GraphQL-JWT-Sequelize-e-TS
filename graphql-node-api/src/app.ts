import * as express from 'express';
import * as graphqlHTTP from 'express-graphql'
import * as cors from 'cors';
import schema from './graphql/schema'
import db from './models'
import { extractJwtMiddleware, dbMiddleware } from './middlewares'
import { DataLoaderFactory } from './graphql/dataloaders/DataLoaderFactory';
import { RequestedFields } from './graphql/ast/RequestedFields';

class App {
    public express: express.Application
    private dataLoaderFactory: DataLoaderFactory;
    private requestedFields: RequestedFields;

    constructor() {
        this.express = express()
        this.init()
    }
    
    private init(): void {
        this.requestedFields = new RequestedFields()
        this.dataLoaderFactory = new DataLoaderFactory(db, this.requestedFields)
        this.middleware()
    }

    private middleware(): void {
        this.express.use(cors({
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Enconding'],
            preflightContinue: false,
            optionsSuccessStatus: 204
        }))

        this.express.use('/graphql', 
            extractJwtMiddleware(),
            dbMiddleware(this.dataLoaderFactory, this.requestedFields),
            graphqlHTTP((req) => ({
                schema,
                graphiql: process.env.NODE_ENV === 'development',
                context: req['context']
            }))
        )        
    }
}

export default new App().express
