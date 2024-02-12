// DESAFIO ENTREGABLE BACKEND 06/02/2024

class ProductManager {
    #products
    #ultimoId = 1

    constructor(){
        this.#products = []
    }

    getProducts(){
        return this.#products
    }

    // Creación de Id autoincrementable
    #getNuevoId(){
        const id = this.#ultimoId
        this.#ultimoId += 1
        return id
    }


    // Metodo de busqueda por ID
    getProductById(idABuscar){
        const busqueda = this.#products.find((product)=>{
            return product.id === idABuscar
        })
        if(busqueda){
            return busqueda
        }else{
            console.log("Error. Not found.")
        }
    }


    // Método para agregar un nuevo producto
    addProduct(title, description, price, thumbnail, code, stock){

        // Validacion de condiciones (ninguna clave vacia o en blanco)
        if(!title || !description || !price || !thumbnail || !code || !stock || title.trim() === "" || description.trim() === "" || price < 1 || thumbnail.trim() === "" || code.trim() === "" || stock < 1 ){
            console.log("ERROR EN LA CARGA DEL PRODUCTO. Todos los datos son obligatorios y no pueden estar en blanco. El precio y el stock deben ser mayores que 1.");
            return
        }


        // Validacion de no repeticion de clave "code"
        const ExistingProduct = this.#products.some(product => product.code === code)
        if(ExistingProduct){
            console.log("Error. El código del producto ya existe. Cargue otro código.")
            return
        }


        // Creación del nuevo producto
        const newProduct = {
            id: this.#getNuevoId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        
        // Agregar el nuevo producto
        this.#products.push(newProduct)
    }

}





//TESTING

//Creacion de instancia nueva
const kiosko = new ProductManager



//LLamado a "getProducts()" con el array vacio
console.log(kiosko.getProducts())



//Agrego varios productos a la instancia nueva llamando a "addProduct()"
kiosko.addProduct("Alfajor Terrabussi", "Alfajor bañado en chocolate relleno de DDL.", 400,  "URL/Alfajor", "abc001", 10)

kiosko.addProduct("Chocolate Aguila ", "Barra de chocolate 70% cacao.", 1200, "URL/Aguila", "abc002", 15)

kiosko.addProduct("Gomitas Mogul", "Gomitas de caramelo masticables sabor frutilla.", 300, "URL/Gomitas Mogul", "abc003", 20)



//Llamado a "getProducts()". El array ya tiene varios productos. Cada uno tiene un id unico y autoincrementable con cada nuevo producto agregado.
console.log(kiosko.getProducts())



// Llamado a "addProduct()" con un "code" existente. Como resultado se arroja un error.
kiosko.addProduct("Alfajor Terrabussi", "Alfajor bañado en chocolate relleno de DDL.", 400,  "URL/Alfajor", "abc001", 10)



// Llamado a "addProduct()" con campos vacios o en blanco. Los mismos son obligatorios, por lo que se arroja un error.
kiosko.addProduct("Gomitas Mogul", " ", 300, "URL/Gomitas Mogul", 20)



//Busqueda de productos usando el método "getProductById()" con resultado positivo.
console.log(kiosko.getProductById(2))



//Busqueda de productos usando el método "getProductById()" con resultado negativo.
console.log(kiosko.getProductById(5))
