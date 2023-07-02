//@ts-check
import express from 'express';
import handlebars from 'express-handlebars';
import { MessageModel } from './DAO/models/messages.model.js';

import { routerVistaChatSocket } from './routes/chat.vista.router.js';

import { __dirname } from './dirname.js';
import { Server } from 'socket.io';
import { routerProducts } from './routes/products.router.js';
import { routerCarts } from "./routes/carts.router.js";
import { connectMongo } from './utils/connections.js';
import { routerView } from "./routes/view.routes.js";
import { loginRouter } from './routes/login.router.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';

const app = express();
const port = 3000;


connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://veronicastefaniazarza:Veronz1992@codecluster.qtao5ew.mongodb.net/ecommerce?retryWrites=true&w=majority', ttl: 86400 * 7 }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);

//CONFIGURACION DEL MOTOR DE HANDLEBARS
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//archivos publicos
app.use(express.static(__dirname + '/public'));

app.use('/vista/chat', routerVistaChatSocket);
app.use("/api/carts", routerCarts);
app.use('/api/products', routerProducts);
app.use('/', routerView); 
app.use('/products', routerView);
app.use('/api/sessions', loginRouter);


app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'error esa ruta no existe',
    data: {},
  });
});

const httpServer = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const socketServer = new Server(httpServer);
socketServer.on('connection', (socket) => {
  socket.on('msg_front_to_back', async (msg) => {
    const msgCreated = await MessageModel.create(msg);
    const msgs = await MessageModel.find({});
    socketServer.emit('todos_los_msgs', msgs);
  });
});
