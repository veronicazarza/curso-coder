import { ProductModel } from "./models/products.model.js";

export class ProductDao {
  constructor() {}

  async addProduct(product) {
    const newProduct = await ProductModel.create(product);

    return newProduct;
  }

  async getProducts(filter, options) {
    const allProducts = await ProductModel.paginate(filter, options);

    return allProducts;
  }

  async getProductById(id) {
    const foundProduct = await ProductModel.findById(id);

    return foundProduct;
  }

  async updateProduct(id, product) {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, product);

    return updatedProduct;
  }

  async deleteProduct(id) {
    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    return deletedProduct;
  }
}