
import * as http from 'http';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import { errorHandlerApi } from './errorHandler';
import DataBase from './config/mongo/db';
import * as cors from "cors";

import EmployeeController from './controllers/employeeController';

const config = require('./config/env/config')();

class Server {
    public app: express.Application;
    private database: DataBase;

    server: any;
    io: any;

    constructor(){
        this.app = express();
        this.listen();
        this.middleware();
        this.database = new DataBase();
        this.dataBaseConnection();
        this.router();
    }
    
    listen() {
        this.server = http.createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.io.on('connection', (client) => {
            console.log('cliente conectado ! ' + client.id);
        });

        this.io.on('disconnect', (client) => {
            console.log('cliente desconectado ! ' + client.id);
        });

        this.server.listen(config.port);
        this.server.on('listening', () => console.log(`server está rodando na porta ${config.port}`));
        this.server.on('error', (error: NodeJS.ErrnoException) => console.log(`ocorreu um erro ${error}`));
    }

    dataBaseConnection() {
        this.database.createConnection();
    }

    middleware (): void {
        this.app.use(cors());
        this.app.use(morgan('dev'));
        this.app.use(bodyParser.urlencoded( { extended: true } ));
        this.app.use(bodyParser.json());
        this.app.use(errorHandlerApi);
        this.router();
    }

    enableCors() {
        const options: cors.CorsOptions = {
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            origin: '*',
            preflightContinue: false
        };

        this.app.use(cors(options));
    }

    router(): void {
        
        this.app.route('/api/employee').get(EmployeeController.list);
        this.app.route('/api/employee').post(EmployeeController.create);    
    }
}

export default new Server().app;