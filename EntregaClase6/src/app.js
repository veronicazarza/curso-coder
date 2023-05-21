import express from "express";
import handlebars from 'express-handlebars';
import { __dirname } from "./utils.js";
import {Server} from 'socket.io';

import { routerProducts } from "./routes/products.router.js";
import { routerCarts } from "./routes/carts.router.js";
import { routerViewProducts } from "./routes/products.views.router.js";
import { routerViewRealTimeProducts } from "./routes/realtimeproducts.views.router.js";

import { ProductManager } from './ProductManager.js';
const manager = new ProductManager();

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

app.use("/", routerViewProducts);
app.use("/realtimeproducts?", routerViewRealTimeProducts);


const httpServer = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set("views", __dirname + "/views");
app.set('view engine','handlebars');
app.use(express.static(__dirname + "/public"));

app.get("*", (req, res) => {
  return res.status(404).json({
    status: "error",
    msg: "error esa ruta no existe",
    data: {},
  });
});
const products = [];
socketServer.on("connection", (socket) => {
  console.log('cliente conectado');
  socket.on("msg_front_to_back", async (product) => {
    await manager.addProduct(product);
    products.push(await manager.getProducts());
    socketServer.emit("todos_los_products", products)
  });
});