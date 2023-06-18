//@ts-check
import express from "express";
import { cartService } from '../services/carts.service.js';
//import { CartManager } from '../CartManager.js';
//const cartService = new CartManager();
export const routerCarts = express.Router();


routerCarts.post("/", async (req, res) => {
    const assignedId = await cartService.createCart();
  res.status(201).send({
    status: "success",
    msg: "Cart created successfully",
    data: assignedId,
  })});
  

routerCarts.get("/:id", async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await cartService.getById(cartId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

routerCarts.post("/:id/product/:pid", async (req, res) => {
    const cartId  = req.params.id;
    const productId  = req.params.pid;
    const quantity = req.body.quantity
    const productAdded = await cartService.addProduct(cartId,productId,quantity);
    if (productAdded != null) {
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

routerCarts.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.removeProduct(cid, pid);
    res
      .status(200)
      .json({ status: "success", message: "Product removed from cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
  });
  
  routerCarts.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await cartService.updateCart(cid, products);
    res
      .status(200)
      .json({ status: "success", message: "Cart updated successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
  });
  
  routerCarts.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateProductQuantity(cid, pid, quantity);
    res
      .status(200)
      .json({ status: "success", message: "Product quantity updated", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
  });
  
  routerCarts.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    await cartService.deleteCart(cid);
    res
      .status(200)
      .json({ status: "success", message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
  });