import express from "express";
import { ProductManager } from '../ProductManager.js';
const manager = new ProductManager();
export const routerProducts = express.Router();

routerProducts.get("/", async (req, res) => {
  const products = await manager.getProducts()
  const limit = req.query.limit;
  if (req.query && limit) {
    const productsWithLimit = await manager.getProductsWithLimit(limit);
    if(productsWithLimit){
      return res.status(200).json({
      status: "success",
      msg:  limit + ' products are displayed',
      data: productsWithLimit,
    });
    }
  } else {
    return res.status(200).json({
      status: "success",
      msg:'All existing products',
      data: products,
    });
  }
});

routerProducts.get("/:id", async (req, res) => {
  const id = req.params.id;
  const product = await manager.getProductById(id);
  if (product != 'Not found') {
    return res.status(200).json({
      status: "success",
      msg: "Product found successfully",
      data: product,
    });
  } else {
    return res.status(400).json({
      status: "error",
      msg: "Product not found",
      data: {},
    });
  }
});

routerProducts.post("/", async (req, res) => {
  const product = req.body;
  product.status = true;
  if(req.body.title && req.body.description && req.body.code && req.body.price && req.body.stock && req.body.category){
  const productAdded = await manager.addProduct(product);
    if(productAdded){
    return res.status(201).json({
      status: "success",
      msg: "Product created successfully",
      data: product,
    });
  } else {
    return res.status(400).json({
      status: "error",
      msg: "Could not add product",
      data: {},
    });
  }
}else{
  return res.status(400).json({
  status: "error",
  msg: "Could not add product",
  data: {},
});
}});

routerProducts.put("/:id", async (req, res) => {
  const id = req.params.id;
  const product = req.body
  const response = await manager.updateProduct(product, id);
  if (response != 'Not found') {
    return res.status(200).json({
      status: "success",
      msg: "Product updated successfully",
      data: response,
    });
  } else {
    return res.status(400).json({
      status: "error",
      msg: "Could not modify the product",
      data: {},
    });
  }
});

routerProducts.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const response = await manager.deleteProduct(id);
  if (response != 'Cannot delete product due to non-existent id') {
    return res.status(200).json({
      status: "success",
      msg: "Product removed successfully",
      data: response,
    });
  } else {
    return res.status(400).json({
      status: "error",
      msg: "The product to delete was not found",
      data: {},
    });
  }
});

