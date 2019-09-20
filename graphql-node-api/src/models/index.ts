import * as fs from 'fs'
import * as path from 'path'
import * as Sequelize from 'sequelize'
import { DbConnection } from '../interfaces/DbConnectionInterface';

//get file name
const basename: string = path.basename(module.filename)
const env: string = process.env.NODE_ENV || 'development';
let config = require(path.resolve(`${__dirname}./../config/config.json`))[env];
let db = null;

if (!db) {
    db = {}
    
    config = {
        ...config,
        //https://sequelize.org/master/manual/querying.html#operators-aliases
        $in: Sequelize.Op.in //now we can find a list of ids [1,3,4,5]
    }
    
    const sequelize: Sequelize.Sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );

    fs.readdirSync(__dirname)
        .filter((file: string) => {
            const fileSlice: string = file.slice(-3)
            return (file.indexOf('.') !== 0) && (file !== basename) && (fileSlice === '.js' || fileSlice === '.ts')
        })
        .forEach((file: string) => {
            const model = sequelize.import(path.join(__dirname, file));
            db[model['name']] = model;
        });
    
        Object.keys(db).forEach((modelName: string) => {
            if (db[modelName].associate) {
                db[modelName].associate(db);
            }
        });

        db['sequelize'] = sequelize;
}


export default <DbConnection>db;
