import * as fs from "fs";
import { ProductManager } from './ProductManager.js';
const pManager = new ProductManager();

export class CartManager {
    constructor(){
        this.carts = [];
        this.path = './src/carts.json';
        this.createFile();
    }

    async createFile() {
        if (!fs.existsSync(this.path)) {
          return await fs.promises.writeFile(this.path, "[]");
        }
      };

      async readCarts(){
        const cartsString = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(cartsString);
    }

    async getCarts(){
        this.carts = await this.readCarts();
        return this.carts;
    }

    async getById(id){
        this.carts = await this.readCarts();
        const cartFound = this.carts.find((cart) => cart.id == id);
        return cartFound??'Not found';
    }

    async createCart(){
        this.carts = await this.readCarts();
        const cartId = this.carts.length+1;
        const cart = {
            id:cartId,
            products: []
        }
        this.carts.push(cart);
        const cartsString2 = JSON.stringify(this.carts);
        await fs.promises.writeFile(this.path,cartsString2);
        return cart.id;     
    }  

    async addProduct(cartId,productId,quantity){
        const cart = await this.getById(cartId);
        if(cart != 'Not found'){
            const products = cart.products;
            const productFound = products.find((prod) => prod.id == productId);
            if(productFound){
                productFound.quantity = quantity;
            }else{
                const productFound = await pManager.getProductById(productId);
                productFound.quantity = quantity;
                products.push(productFound);
            }
            this.deleteCart(cartId);
            const cartsString = JSON.stringify(this.carts);
            await fs.promises.writeFile(this.path,cartsString);
            return 'The product was successfully created in the cart';
        }else{
            return 'The cart with the indicated id does not exist';
        }    
    }

    async deleteCart(cartId){
        this.carts.splice(this.carts.indexOf(this.carts.find(c => c.id === cartId)), 0)
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts))
        return cartId; 
    }
}