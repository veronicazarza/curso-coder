import express from "express";
import data from "../products.json" assert { type: "json" };

export const routerViewRealTimeProducts = express.Router();

routerViewRealTimeProducts.get("/", (req, res) => {
  return res.render("realTimeProducts", {
    title: "TITULO: PRODUCTOS",
    products: data,
  });
});  