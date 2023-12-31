import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Socket, Server } from 'socket.io';
import cors from 'cors';import _ from 'lodash';
import path from 'path';
import dotenv from 'dotenv';
import { getServerPort } from './utils';
import { routes as huntRoutes } from './src/Routes/hunt';
import { routes as onchainRoutes } from './src/Routes/onchain';
import { routes as craftRoutes } from './src/Routes/craft';
import { routes as craftableRoutes } from './src/Routes/craftable';
import { routes as metadataRoutes } from './src/Routes/metadata';
import { routes as accountMigrationRoutes } from './src/Routes/accountMigration';
dotenv.config({ path: path.join(__dirname, '.env')});

process.on('uncaughtException', function (err) {
    //dont stop on uncaught exception
    console.log('Caught exception: ', err);
});

//create app
const port = getServerPort();
const whitelists = JSON.parse(process.env.CORS_WHITELIST!);

let app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: "*", // allow all
    credentials: true
}));

app.use('/hunt', huntRoutes);
app.use('/onchain', onchainRoutes);
app.use('/craft', craftRoutes);
app.use('/craftable', craftableRoutes);
app.use('/metadata', metadataRoutes);
app.use('/accountMigration', accountMigrationRoutes);

//connect app to websocket
let http = createServer(app);
/* let io = new Server(http, {
    cors: {
        origin: whitelists,
        credentials: true
    }
}); */

//websocket functions
/* io.on('connection', (socket: Socket) => {
    
}); */

//api endpoints
app.get('/', function(req, res) {
    res.send('Hello World');
});

// start the server
http.listen(port, () => {
    console.log("I'm alive!");
});