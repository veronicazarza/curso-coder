import { productService, ticketService } from "./index.js";
import ErrorCustom from "./errors/ErrorCustom.js";
import EnumsErrors from "./errors/EnumsErrors.js";

export class CartService {
  constructor(dao) {
    this.dao = dao;
  }

  async createCart() {
    try {
      const newCart = await this.dao.createCart();
      return newCart;
    } catch (error) {
      ErrorCustom.createError({
        name: "Cart creation failed",
        cause: "You need to register and login",
        message: `Error: not logged in`,
        code: EnumsErrors.ERROR_AUTH,
      });
    }
  }

  async getCartId(id) {
    try {
      const cart = await this.dao.getCartId(id);

      return cart;
    } catch (error) {
      ErrorCustom.createError({
        name: "Database error",
        cause: "Cart not found",
        message: `Error al traer el carrito, ${id}`,
        code: EnumsErrors.NOT_FOUND,
      });
    }
  }

  async addProductToCart(cId, pId) {
    try {
      const productToAdd = await productService.getProductById(pId);

      if (!productToAdd) {
        ErrorCustom.createError({
          name: "Database error",
          cause: "Product not found",
          message: `Error al traer el producto, ${pId}`,
          code: EnumsErrors.NOT_FOUND,
        });
      }

      let cart = await this.dao.addProductToCart(cId, productToAdd);

      return cart;
    } catch (error) {
      ErrorCustom.createError({
        name: "Database error",
        cause: "Cart not found",
        message: `Error al traer el carrito, ${cId}`,
        code: EnumsErrors.NOT_FOUND,
      });
    }
  }

  async deleteProductFromCart(cId, pId) {
    try {
      const productToDelete = await productService.getProductById(pId);

      if (!productToDelete) {
        ErrorCustom.createError({
          name: "Database error",
          cause: "Product not found",
          message: `Error al traer el producto, ${pId}`,
          code: EnumsErrors.NOT_FOUND,
        });
      }

      let cart = await this.dao.deleteProductFromCart(cId, pId);

      return cart;
    } catch (error) {
      ErrorCustom.createError({
        name: "Database error",
        cause: "Cart not found",
        message: `Error al traer el carrito, ${cId}`,
        code: EnumsErrors.NOT_FOUND,
      });
    }
  }

  async deleteProductFromCartComplete(cId, pId) {
    try {
      const productToDelete = await productService.getProductById(pId);

      if (!productToDelete) {
        ErrorCustom.createError({
          name: "Database error",
          cause: "Product not found",
          message: `Error al traer el producto, ${pId}`,
          code: EnumsErrors.NOT_FOUND,
        });
      }

      let cart = await this.dao.deleteProductFromCartComplete(
        cId,
        productToDelete
      );

      return cart;
    } catch (error) {
      ErrorCustom.createError({
        name: "Database error",
        cause: "Cart not found",
        message: `Error al traer el carrito, ${cId}`,
        code: EnumsErrors.NOT_FOUND,
      });
    }
  }

  async updateQuantityProductFromCart(cId, pId, quantity) {
    try {
      const productToUpdate = await productService.getProductById(pId);

      if (!productToUpdate) {
        ErrorCustom.createError({
          name: "Database error",
          cause: "Product not found",
          message: `Error al traer el producto, ${pId}`,
          code: EnumsErrors.NOT_FOUND,
        });
      }

      if (
        quantity.quantity < 0 ||
        quantity.quantity === 0 ||
        quantity.quantity === null ||
        quantity.quantity === undefined ||
        typeof quantity.quantity === "string"
      ) {
        ErrorCustom.createError({
          name: "Cart error",
          cause: `Cart quantity error, ${quantity.quantity}`,
          message: `Quantity must be a positive number`,
          code: EnumsErrors.ERROR_CART,
        });
      }

      let cart = await this.dao.updateQuantityProductFromCart(
        cId,
        productToUpdate,
        quantity
      );

      return cart + ` QUANTITY updated to ${quantity.quantity}`;
    } catch (error) {
      ErrorCustom.createError({
        name: "Database error",
        cause: "Cart not found",
        message: `Error al traer el carrito, ${cId}`,
        code: EnumsErrors.NOT_FOUND,
      });
    }
  }

  async updateCartArray(cId, productArray) {
    try {
      let newCartProducts = productArray.products.map((product) => {
        return {
          product: product._id,
          quantity: product.quantity,
        };
      });

      for (let i = 0; i < newCartProducts.length; i++) {
        if (
          newCartProducts[i].quantity < 0 ||
          newCartProducts[i].quantity === 0 ||
          newCartProducts[i].quantity === null ||
          newCartProducts[i].quantity === undefined ||
          typeof newCartProducts[i].quantity === "string"
        ) {
          newCartProducts[i].quantity = 1;
        }
      }

      let cart = await this.dao.findByIdAndUpdate(cId, newCartProducts);
      return cart;
    } catch (error) {
      ErrorCustom.createError({
        name: "Database error",
        cause: "Cart not found",
        message: `Error al traer el carrito, ${cId}`,
        code: EnumsErrors.NOT_FOUND,
      });
    }
  }

  async deleteAllProductsFromCart(cId) {
    try {
      await this.dao.findByIdAndUpdate(cId, { products: [] });
      return "Cart empty";
    } catch (error) {
      ErrorCustom.createError({
        name: "Cart error",
        cause: "Cart not found",
        message: `Error al traer el carrito, ${cId}`,
        code: EnumsErrors.NOT_FOUND,
      });
    }
  }

  async purchase(cid, user) {
    try {
      const cart = await this.dao.getCartId(cid);

      if (cart.products.length === 0) {
        throw new Error("Cart is empty");
      }

      const purchasedProducts = [];
      const notPurchasedProducts = [];

      for (const item of cart.products) {
        if (item.product.stock >= item.quantity) {
          await productService.updateProduct(item.product._id.toString(), {
            stock: item.product.stock - item.quantity,
          });
          purchasedProducts.push(item);
        } else {
          notPurchasedProducts.push(item);
        }
      }

      let ticket;
      if (purchasedProducts.length > 0) {
        const amount = purchasedProducts.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );

        ticket = await ticketService.createTicket({
          amount,
          code: " ",
          purchaser: user.email,
        });
      } else {
        throw new Error("Cart is empty");
      }

      if (notPurchasedProducts.length > 0) {
        await this.dao.updateCartProducts(
          cid,
          notPurchasedProducts.map((item) => ({
            id: item.product._id.toString(),
            quantity: item.quantity,
          }))
        );
      } else {
        await this.dao.findByIdAndUpdate(cid);
      }

      return {
        ticket,
        notPurchasedProducts: notPurchasedProducts.map((item) =>
          item._id.toString()
        ),
      };
    } catch (error) {
      throw new Error(error);
    } finally {
    }
  }
}