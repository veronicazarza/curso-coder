//DESAFÍO ENTREGABLE - PROCESO DE TESTING
//Manejo de archivos
const ProductManager = require('./ProductManager')


//Se creará una instancia de la clase “ProductManager”
const pm = new ProductManager();
//Se crea una función asíncrona para englobar las pruebas
async function test() {
//Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log('Se espera un array vacío');
console.log(await pm.getProducts());
/*Se llamará al método “addProduct” con los campos:
title: “producto prueba”
description:”Este es un producto prueba”
price:200,
thumbnail:”Sin imagen”
code:”abc123”,
stock:25
*/
let firstProduct = {
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
};
await pm.addProduct(firstProduct);
/*El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
*/
console.log('Se espera un array con el producto creado');
console.log(await pm.getProducts());
//Se crean 2 nuevos productos con otros datos para completar la prueba y se agregan
let secProduct = {
    title: 'producto prueba 2',
    description: 'Este es otro producto prueba',
    price: 500,
    thumbnail: 'Sin imagen',
    code: 'def456',
    stock: 50
};  

let thrProduct = {
    title: 'producto prueba 3',
    description: 'Este es otro producto prueba',
    price: 700,
    thumbnail: 'Sin imagen',
    code: 'ghj789',
    stock: 75
};  

//Se agregan los 2 nuevos productos
await pm.addProduct(secProduct);
await pm.addProduct(thrProduct);
//Se llamará el método “getProducts” nuevamente, esta vez debe aparecer los 2 productos recién agregados
console.log('Se espera un array con los 3 productos creados');
console.log(await pm.getProducts());
/*Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, 
debe arrojar un error.*/
console.log('Se espera el producto con el id 2')
console.log(await pm.getProductById(2));
console.log('Se espera un error por no existir el id buscado')
console.log(await pm.getProductById(5));
/*Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, 
se evaluará que no se elimine el id y que sí se haya hecho la actualización.*/
//Se crea el producto con id 1 pero con un dato distinto(stock)
let updatedProduct = {
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 92,
    id: 1
};
//Se actualiza el producto con id 1 con un nuevo stock
console.log('Retorno de producto actualizado con id 1');
console.log(await pm.updateProduct(updatedProduct));
/*Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.*/
console.log('Se espera la confirmación del producto eliminado');
console.log(await pm.deleteProduct(1));
console.log('Se espera un error por no existir producto con el id 5');
console.log(await pm.deleteProduct(5));
console.log('Se espera un array actualizado con 2 productos el de id 2 y 3 ');
console.log(await pm.getProducts());
}
//Llamo a la función test para probar que funcione todo correctamente
test();