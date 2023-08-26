import { CartModel } from "./models/carts.model.js";

export class CartsDao {
  constructor() {}

  async createCart() {
    const newCart = await CartModel.create({ products: [] });
    return newCart;
  }

  async getCartId(id) {
    const cart = await CartModel.findById(id);
    return cart;
  }

  async addProductToCart(cId, productToAdd) {
    let cart = await CartModel.findOneAndUpdate(
      { _id: cId, "products.product": productToAdd._id },
      {
        $inc: { "products.$.quantity": 1 },
      }
    );

    if (!cart) {
      cart = await CartModel.findByIdAndUpdate(cId, {
        $push: { products: { product: productToAdd._id, quantity: 1 } },
      });
    }

    return cart;
  }

  async updateQuantityProductFromCart(cId, productToUpdate, quantity) {
    const cart = await cartsModel.findOneAndUpdate(
      { _id: cId, "products.product": productToUpdate._id },
      {
        $set: { "products.$.quantity": quantity.quantity },
      }
    );
    return cart;
  }

  async findByIdAndUpdate(cId, newCartProducts) {
    const cart = await CartModel.findByIdAndUpdate(cId, {
      products: newCartProducts,
    });

    return cart;
  }

  async deleteProductFromCart(cId, productToDelete) {
    const cart = await CartModel.findOneAndUpdate(
      { _id: cId, "products.product": productToDelete._id },
      {
        $inc: { "products.$.quantity": -1 },
      }
    );

    let findIndexArray = cart.products.findIndex(
      (product) => product.product.toString() === pId
    );

    if (cart.products[findIndexArray].quantity <= 1) {
      await CartModel.findByIdAndUpdate(cId, {
        $pull: { products: { product: productToDelete._id } },
      });
    }

    return cart;
  }
}