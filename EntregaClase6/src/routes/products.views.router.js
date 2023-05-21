import express from "express";
import data from "../products.json" assert { type: "json" };

export const routerViewProducts = express.Router();
routerViewProducts.get("/", (req, res) => {
  return res.render("home", {
    title: "TITULO: PRODUCTOS",
    products: data,
  });
});  