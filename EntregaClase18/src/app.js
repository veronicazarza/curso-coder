//@ts-check
import express from 'express';
import handlebars from 'express-handlebars';

import { routerVistaChatSocket } from './routes/chat.vista.router.js';

import { __dirname } from './dirname.js';
import { productManagerRouter  } from './routes/products.router.js';
import { cartsRouter  } from "./routes/carts.router.js";
import { connectMongo } from './utils/connections.js';
import { viewsRouter  } from "./routes/view.routes.js";
import { iniPassport } from './config/passport.config.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import { authRouter } from "./routes/auth.router.js";
import errorHandler from "./middlewares/error.js";
import { addLogger } from "./middlewares/logger.js";


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
iniPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


app.use(express.static(__dirname + '/public'));

app.use('/vista/chat', routerVistaChatSocket);
app.use("/api/carts", cartsRouter );
app.use('/api/products', productManagerRouter );
app.use('/', viewsRouter ); 
app.use(addLogger);
app.use('/products', viewsRouter );
app.use("/api/sessions", authRouter);

app.get("/mockingproducts", (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push({
      _id: `6483de46fc7349e7c00e547${i}`,
      title: `Mock ${i}`,
      description: `Mock desc ${i}`,
      price: 100 * i,
      thumbnail: `/img${i}.png`,
      code: `abc${i}`,
      stock: 5,
      status: true,
      category: `Mock`,
      __v: 0,
    });
  }
  return res.status(200).json({
    status: "success",
    msg: "Products created",
    docs: products,
  });
});

app.get("/loggerTest", (req, res) => {
  req.logger.debug("debug alert!!");
  req.logger.http("http alert!!");
  req.logger.info("info alert!!");
  req.logger.warning("warning alert!!!");
  req.logger.error("error alert!!!");
  req.logger.fatal("fatal error!!");
  res.send({ message: "test logger" });
});

app.get("*", (req, res) => {
  return res.status(404).json({
    status: "error",
    msg: "Route not found",
    data: {},
  });
});

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'error esa ruta no existe',
    data: {},
  });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

