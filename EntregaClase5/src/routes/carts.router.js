import express from "express";
import { CartManager } from '../CartManager.js';
const manager = new CartManager();
export const routerCarts = express.Router();


routerCarts.post("/", async (req, res) => {
    const assignedId = await manager.createCart();
  res.status(201).send({
    status: "success",
    msg: "Cart created successfully",
    data: assignedId,
  })});
  

routerCarts.get("/:id", async (req, res) => {
  const id  = req.params.id;
  const cart = await manager.getById(id);
  if (cart != 'Not found') {
    const productsInCart = cart.products;
    if (productsInCart) {
      res.status(200).send({
          status: 200,
          data: {
            products: productsInCart,
          },
          message: "Cart products found",
        });
        return;
      } else {
        res.status(400).send({
          status: 400,
          message: "There are no products in the cart",
        });
        return;
      }
    }
    res.status(400).send({
      status: 400,
      data: {
        productsInCart,
      },
      message: "This cart does not exist",
    });
});

routerCarts.post("/:id/product/:pid", async (req, res) => {
    const cartId  = req.params.id;
    const productId  = req.params.pid;
    const quantity = req.body.quantity
    const productAdded = await manager.addProduct(cartId,productId,quantity);
    if (productAdded == 'The product was successfully created in the cart') {
      res.status(201).send({
          status: 201,
          message: "Product added successfully",
      });
      return;
    }else{
      res.status(400).send({
        status: 400,
        data: {
          productAdded,
        },
        message: "This cart does not exist",
      });
    }
});