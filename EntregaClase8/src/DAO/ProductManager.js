import * as fs from "fs";
export class ProductManager {
    constructor(){
        this.products = [];
        this.path = './src/products.json';
        this.createFile();
    }

    async createFile() {
        if (!fs.existsSync(this.path)) {
          return await fs.promises.writeFile(this.path, "[]");
        }
      };

    async readProducts(){
        const productsString = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(productsString);
    }

    async getProducts(){
        const products = await this.readProducts();
        this.products = products;
        return this.products;
    }

    async getProductById(id){
        const products = await this.readProducts();
        this.products = products;
        const productFound = this.products.find((prod) => prod.id == id);
        return productFound??'Not found';
    }

    async getProductsWithLimit(limit){
        const products = await this.getProducts();
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

    async addProduct(product){
        this.products = await this.readProducts();
        if(product.id === undefined){
            product.id = this.products.length+1;
        }
        this.products.push(product);
        const productsString2 = JSON.stringify(this.products);
        await fs.promises.writeFile(this.path,productsString2);
        return product;     
    } 

    async updateProduct(product, id){
        let productId = id;
        let productFound = await this.getProductById(productId);
        if(!productFound){
            throw 'Cannot update product with submitted data due to non-existent id';
        }else{
            await this.deleteProduct(productFound.id)
            return this.addProduct(product);
        }
    }

    async deleteProduct(id){
        let productFound = await this.getProductById(id);
        if(productFound === 'Not found'){
            return 'Cannot delete product due to non-existent id';
        }else{
            this.products.splice(this.products.indexOf(this.products.find(p => p.id === id)), 1)
            await fs.promises.writeFile(this.path, JSON.stringify(this.products))
            return 'Successfully removed product with id: ' + id; 
        }
    }
}
