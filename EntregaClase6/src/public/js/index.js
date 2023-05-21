const socket = io();

const createNewProduct = document.getElementById("submit");
createNewProduct.addEventListener("click",async() => {
let title = document.getElementById("input-title");
let description = document.getElementById("input-description");
let thumbnail = document.getElementById("input-thumbnail");
let code = document.getElementById("input-code");
let price = document.getElementById("input-price");
let stock = document.getElementById("input-stock");

let newProduct = {
    "title": title.value,
    "description":description.value,
    "price": price.value,
    "thumbnail": thumbnail.value,
    "code": code.value,
    "stock": stock.value
};

socket.emit("msg_front_to_back", newProduct);
});
let arrayProducts = "";
socket.on("todos_los_products",(products) => {
    arrayProducts = products[0];
    const divProducts = document.getElementById("div-products");
    let title = '<h1>TITULO: PRODUCTOS</h1>'
    let content = "";
    arrayProducts.forEach((pro) => {
        content = content + `<p>${pro.title}</p><p>$${pro.price}</p><hr />`;
    });
    let finalContent = title +content;
    divProducts.innerHTML = finalContent;
});
