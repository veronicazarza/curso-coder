import express from 'express';
import { productService } from '../services/products.service.js';
import { ProductModel } from '../DAO/models/products.model.js';
import { cartService }  from "../services/carts.service.js";

export const routerView = express.Router();

routerView.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.render('error-page', { msg: 'no se pudo cerrar la session' });
    }
    return res.redirect('/login');
  });
});

routerView.get('/login', (req, res) => {
  res.render('login-form');
});

routerView.get('/register', (req, res) => {
  res.render('register-form');
});

routerView.get('/', async (req, res)=> {
  return res.redirect('/login');
});

routerView.get('/products', async (req, res)=> {
    try{
        const { page, limit, sort, query }= req.query;
        const queryResult = await productService.getAllProducts(page, limit, sort, query);
        const {docs, ...paginationInfo} = queryResult;
        const productsToShow = docs.map((product) => {
            return {
                _id: product._id.toString(),
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock,
                category: product.category,
                status: product.status              
            }
        });
        const response = {
            status: 'success',
            payload: productsToShow,
            totalPages: paginationInfo.totalPages,
            prevPage: paginationInfo.prevPage,
            nextPage: paginationInfo.nextPage,
            page: parseInt(paginationInfo.page),
            hasPrevPage: paginationInfo.hasPrevPage,
            hasNextPage: paginationInfo.hasNextPage,
        };
        const prevPage = parseInt(page) - 1;
        response.hasPrevPage ? response.prevLink = `localhost:3000/products/?page=${prevPage}&sort=${sort}` : response.prevLink = null;
        const nextPage = parseInt(page) + 1;
        response.hasNextPage ? response.nextLink = `localhost:3000/products/?page=${nextPage}&sort=${sort}` : response.nextLink = null;
        if (parseInt(page) > paginationInfo.totalPages || parseInt(page) < 1) {
            throw new Error('La página solicitada no existe');
        }
        const nextPageUrl = `/?page=${nextPage}&limit=${limit}&sort=${sort}`;
        res.render('products', {productsToShow, paginationInfo, nextPageUrl, sort, query})
        console.log(response);
    } catch(error) {
        console.error(error);
        return res.status(400).json({
        status: 'error',
        msg: error.message,
        });
    }
})



routerView.get("/products/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id);
      const productSimplificado = {
        _id: product._id.toString(),
        title: product.title,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail,
        code: product.code,
        stock: product.stock,
        category: product.category,
      };
      res.render("product", { product: productSimplificado });
    } catch (error) {
      next(error);
    }
  });


  routerView.get("/carts/:id", async (req, res, next) => {
    try {
      const { cid } = req.params;
      const cart = await cartService.get(id);
  
      const cartValues = cart.products.map((item) => {
        if (item.product) {
          return {
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
          };
        }
        return null;
      });
      res.render("carts", { cart: cartValues });
    } catch (error) {
      next(error);
    }
  });

