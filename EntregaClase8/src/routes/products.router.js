//@ts-check
import express from "express";
import { productService } from '../services/products.service.js';
//import { ProductManager } from '../ProductManager.js';
//const productService = new ProductManager();
export const routerProducts = express.Router();

routerProducts.get("/", async (req, res) => {
  const products = await productService.getAllProducts()
  const limit = req.query.limit;
  if (req.query && limit) {
    const productsWithLimit = await productService.getProductsWithLimit(limit);
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
  const product = await productService.getProductById(id);
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
  try{
    const { title, description, price, thumbnail, code, stock, category} = req.body;
    const status = true;
    const productCreated = await productService.createProduct(title, description, price, thumbnail,code, stock, category, status);
    return res.status(201).json({
      status: "success",
      msg: "Product created successfully",
      data: productCreated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});

routerProducts.put("/:id", async (req, res) => {
  const { title, description, price, thumbnail,code, stock, category } = req.body;
  const id = req.params.id;
  const response = await productService.updateProduct(id,title, description, price, thumbnail,code, stock, category);
  if (response != null) {
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
  const response = await productService.deleteProduct(id);
  if (response != null ) {
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

