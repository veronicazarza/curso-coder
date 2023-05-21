class ProductManager {
    constructor(){
        this.products = [];
    }

    getProducts(){
        return this.products;
    }

    getProductById(id){
        const productFound = this.products.find((prod) => prod.id == id);
        return productFound??'Not found';
    }

    validateCode(code){
        return this.products.find((prod) => prod.code == code);
    }

    addProduct(title,description,price,thumbnail,code,stock){
        try{
            let validFields = title && description && price && thumbnail && code && stock;
            if(!validFields){
                throw new Error('Por favor ingrese datos válidos');
            }
            let existingProductCode = this.validateCode(code);
            if(existingProductCode){
                throw new Error('Ya existe el código de producto, por favor ingrese uno distinto');
            }
            const newProduct = {title,description,price,thumbnail,code,stock};
            newProduct.id = this.products.length+1;
            this.products = [...this.products, newProduct];
            return true; 
        }catch(e){
            console.log(e);
        }    
    }  

}

//DESAFÍO ENTREGABLE - PROCESO DE TESTING

//Se creará una instancia de la clase “ProductManager”
const pm = new ProductManager();


//Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log('Se espera un array vacío');
console.log(pm.getProducts());


/*
Se llamará al método “addProduct” con los campos:
title: “producto prueba”
description:”Este es un producto prueba”
price:200,
thumbnail:”Sin imagen”
code:”abc123”,
stock:25
El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
*/
pm.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25);


//Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
console.log('Se espera un array con el producto creado');
console.log(pm.getProducts());


//Se generan otros productos de prueba
pm.addProduct('producto prueba 2','Este es otro producto prueba',500,'Sin imagen','def456',50);
pm.addProduct('producto prueba 3','Este es otro producto prueba',700,'Sin imagen','ghj789',75);

//Se busca obtener errores a partir de las validaciones que se realizan de los parámetros para la creación del producto
console.log('Se espera que falle por contener valor nulo');
pm.addProduct('producto prueba 4','Este es otro producto prueba',900,'Sin imagen',null,10);
console.log('Se espera que falle por no tener todos los parámetros requeridos');
pm.addProduct('producto prueba 4','Este es otro producto prueba',900,'klm123',10);
console.log('Se espera que falle por tener valor en 0 en el stock');
pm.addProduct('producto prueba 4','Este es otro producto prueba',900,'klm123',0);


/*Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error 
porque el código estará repetido.(el primer producto)*/
console.log('Se espera que falle por tener el code repetido');
pm.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25);


//Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
console.log('Se espera que devuelva Not found');
console.log(pm.getProductById(5));

console.log('Se espera que devuelva el producto con code def456 ingresado segundo');
console.log(pm.getProductById(2));