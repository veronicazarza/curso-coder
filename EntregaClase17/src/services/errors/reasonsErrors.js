export const reasonProductError = (product) => {
    return `
      No posee todas las propiedades requeridas o se ingresaron valores no permitidos:
      name: Por favor ingrese un texto. (${product.name})
      description: Por favor ingrese un texto. (${product.description})
      price: Por favor ingrese un número. (${product.price})
      stock: Por favor ingrese un número. (${product.stock})
      thumbnail: Por favor ingrese un texto. (${product.thumbnail})
      category: Por favor ingrese un texto. (${product.category})
      status: Por favor ingrese true o false. (${product.status})
      code: Por favor ingrese un texto. (${product.code})
      `;
  };
  
  export const reasonDBError = () => {
    return `
      Se produjo un error en la base de datos o no se encuentra loggeado. Intente más tarde por favor.
    `;
  };