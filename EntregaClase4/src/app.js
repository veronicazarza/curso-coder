const express = require('express');
const ProductManager = require('./ProductManager')
const app = express();

const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const manager = new ProductManager()

app.get("/products", async (req, res) => {
    const productos = await manager.getProducts()
    const limite = req.query.limit;
    if (req.query && limite) {
      const productosConLimite = await manager.getProductsWithLimit(limite);
      if(productosConLimite){
        return res.status(200).json({
        status: "success",
        msg: 'Se muestran '+ limite + ' productos',
        data: productosConLimite,
      });
      }
    } else {
      return res.status(200).json({
        status: "success",
        msg:'Todos los productos existentes',
        data: productos,
      });
    }
  });
  
    app.get("/products/:id", async (req, res) => {
    const id = req.params.id;
    const producto = await manager.getProductById(id);
    if (producto != 'Not found') {
      return res.status(200).json({
        status: "success",
        msg: "producto encontrado con exito",
        data: producto,
      });
    } else {
      return res.status(400).json({
        status: "error",
        msg: "no se encontro el producto",
        data: {},
      });
    }
  });
  
app.get("*", (req, res) => {
    return res.status(404).json({
      status: "error",
      msg: "error esa ruta no existe",
      data: {},
    });
  });
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });