import { CartModel } from '../DAO/models/carts.model.js';
import { ProductModel } from '../DAO/models/products.model.js';
import { productService } from '../services/products.service.js';

class CartService {

  validateId(id) {
    if (!id) {
      console.log('validation error: please complete id.');
      throw 'VALIDATION ERROR';
    }
  }

  async getById(id){
    const carts = await this.getAllCarts();
    const cartFound = carts.find((cart) => cart.id == id);
    return cartFound??'Not found';
}

async addProduct(cartId,productId,quantity){
  const cart = await this.getById(cartId);
  if(cart != 'Not found'){
      const products = cart.products;
      const productFound = products.find((prod) => prod.id == productId);
      if(productFound){
          productFound.quantity = quantity;
      }else{
          const productFound = await productService.getProductById(productId);
          productFound.quantity = quantity;
          products.push(productFound);
      }
      return this.updateCart(cartId);
  }else{
      return null;
  }    
}

  async getAllCarts() {
    const carts = await CartModel.find({});
    return carts;
  }

  async createCart() {
    const cartCreated = await CartModel.create({ });
    return cartCreated;
  }
  async updateCart(id) {
    this.validateId(id);
    const cartUptaded = await CartModel.updateOne({ _id: id }, { });
    return cartUptaded;
  }

  async deleteCart(id) {
    this.validateId(id);
    const deleted = await CartModel.deleteOne({ _id: id });
    return deleted;
  }
}

export const cartService = new CartService();
