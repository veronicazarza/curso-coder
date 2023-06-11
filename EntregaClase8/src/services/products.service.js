import { ProductModel } from '../DAO/models/products.model.js';

class ProductService {
  validatePostProduct(title, description, price, code, stock, category,status) {
    if (!title || !description || !price || !code || !stock|| !category || !status) {
      console.log('validation error: please complete title, description, price, code, stock and category.');
      throw 'VALIDATION ERROR';
    }
  }

  validateId(id) {
    if (!id) {
      console.log('validation error: please complete id.');
      throw 'VALIDATION ERROR';
    }
  }

  async getProductsWithLimit(limit){
    const products = await this.getAllProducts();
    const productsWithLimit = [];
    if(products.length > limit){
        for(const product of products){
            if(productsWithLimit.length < limit){
                productsWithLimit.push(product);
            };
        }
        return productsWithLimit;
    }else{
        return products;
    }
}

  async getProductById(id){
    const products = await this.getAllProducts();
    const productFound = products.find((prod) => prod.id == id);
    return productFound??'Not found';
  }

  async getAllProducts() {
    const products = await ProductModel.find({});
    return products;
  }

  async createProduct(title, description, price, thumbnail, code, stock, category, status) {
    this.validatePostProduct(title, description, price, code, stock, category,status);
    const productCreated = await ProductModel.create({ title, description, price, thumbnail, code, stock, category,status });
    return productCreated;
  }
  async updateProduct(id, title, description, price, thumbnail, code, stock, category) {
    this.validatePostProduct( title, description, price, code, stock, category);
    const productUptaded = await ProductModel.updateOne({ _id: id }, { title, description, price, thumbnail, code, stock, category });
    return productUptaded;
  }

  async deleteProduct(id) {
    this.validateId(id);
    const deleted = await ProductModel.deleteOne({ _id: id });
    return deleted;
  }
}

export const productService = new ProductService();
