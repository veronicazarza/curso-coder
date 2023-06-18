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
    const cart = await CartModel.findById(id).populate("products.product").lean()
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
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
  async updateCart(cartId, products) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products },
        { new: true }
      );
      return cart;
    } catch (error) {
      throw new Error("Error updating cart in database");
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await CartModel.findById(cartId);
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error("Product not found in cart");
      }
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error updating product quantity in cart");
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error("Product not found in cart");
      }
      cart.products.splice(productIndex, 1);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error removing product from cart");
    }
  }


  async deleteCart(id) {
    this.validateId(id);
    const deleted = await CartModel.deleteOne({ _id: id });
    return deleted;
  }
}

export const cartService = new CartService();
