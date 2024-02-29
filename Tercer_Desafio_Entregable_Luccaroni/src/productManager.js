

const fs = require("fs")

const fileName = `${__dirname}/../assets/products.json`



class ProductManager{
    #products
    #ultimoId = 1
    #path

    constructor(pathToUse){
        this.#path = pathToUse
        this.#products
    }


    // Método para iniciar la clase y cargar los productos en memoria.
    async initialize(){
        this.#products = await this.readProductsFromFile()
    }


    // Leer los productos cargados en el archivo
    async readProductsFromFile(){
        try{
            const productsFileContent = await fs.promises.readFile(this.#path, "utf-8")
            return JSON.parse(productsFileContent)


        } catch(err){
            return []
        }
    }


    // Actualizar el archivo
    async #updateFile(){
        await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, "\t"))
    }


    //Actualizar un producto
    async updateProduct(updatedProduct){
        try{
            console.log(updatedProduct)
            const exsitingProductIndex = this.#products.findIndex(p => p.code === updatedProduct.code)

            if(exsitingProductIndex < 0){
                console.log(exsitingProductIndex)
                throw "Codigo invalido. 0 coincidencias para actualización"
            }

            //actualizar los datos de ese product en el array
            const productData = {...this.#products[exsitingProductIndex], ...updatedProduct}
            this.#products[exsitingProductIndex] = productData

            await this.#updateFile()

        }catch(err){
            console.log(`Error actualizando el producto => ${err}`)
        }
        
    }


    // Eliminar producto
    async deleteProduct(productId){
        try{

            //Validar si existe el producto con ese ID
            const validation = this.#products.find(p => p.id === productId)
            console.log(validation);
            if(validation === undefined || validation == null || !validation){
                throw "Error.No se encontró ID."
            }


            const arrayWithoutDeletedProduct = this.#products.filter(product => product.id !== productId)
            this.#products = arrayWithoutDeletedProduct
    
            await this.#updateFile()
            console.log(`El producto con ID:${productId} fue eliminado exitosamente.`)

        }catch(err){
            console.log(`Error en la eliminación de producto => ${err}`)
        }
    }


    // Mostrar los productos cargados en memoria
    async getProducts(){
        return this.#products
        //return await this.readProductsFromFile()
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
            console.log("Error. No se encontró ID.")
        }
    }

    
    // Método para agregar un nuevo producto
    async addProduct(title, description, price, thumbnail, code, stock){

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
        await this.#updateFile()
    }
}




//TESTING
/*
const main = async () =>{
    try{
        //creacion de instancia
        const manager = new ProductManager(fileName) 

        // - inicializacion del manejador de productos
        await manager.initialize() 
        
        // - muestra que productos hay en el archivo
        console.log(await manager.readProductsFromFile())

        // - muestra que productos hay en memoria
        console.log(manager.getProducts())

        // - carga de un producto
        await manager.addProduct("Alfajor Terrabussi", "Alfajor bañado en chocolate relleno de DDL.", 400,  "URL/Alfajor", "abc001", 10) 


        // - carga de un producto
        await manager.addProduct("Chocolate Aguila ", "Barra de chocolate 70% cacao.", 1200, "URL/Aguila", "abc002", 15) 


        // - carga de un producto
        await manager.addProduct("Gomitas Mogul", "Gomitas de caramelo masticables sabor frutilla.", 300, "URL/Gomitas Mogul", "abc003", 20) 


        // - carga de un producto
        await manager.addProduct("Chicles Beldent", "Chicle masticable sabor menta.", 100, "URL/ChicleBeldent", "abc004", 100)
        
        // - carga de un producto
        await manager.addProduct("Coca-Cola 500ml", "Bebida cola envase de 500ml.", 500, "URL/Coca-Cola500ml", "abc005", 300)
        
        // - carga de un producto
        await manager.addProduct("Agua Mineral KIN 500ml", "Agua mineral baja en sodio envase 500ml.", 500, "URL/AguaKin500ml", "abc006", 500) 

        // - carga de un producto
        await manager.addProduct("Caramelos SugusMax", "Caramelo masticable sabor frutilla.", 50, "URL/SugusMaxFrutilla", "abc007", 200)
        
        // - carga de un producto
        await manager.addProduct("Bizcochos 9 De Oro", "Bizcochos de grasa.", 450, "URL/9DeOro", "abc008", 90)

        // - carga de un producto
        await manager.addProduct("Papas Fritas Lays", "Snack de Papas fritas clasicas", 700, "URL/Lays", "abc009", 200)

        // - carga de un producto
        await manager.addProduct("Helado Conogol", "Helado de chocolate relleno de dulce de leche en cono.", 1200, "URL/Conogol", "abc010", 300)
        

        // - busqueda por id
        //console.log(manager.getProductById(2)) 
        

        // - actualizo un producto sin modificar / borrar el ID ni el idice en el array
        //await manager.updateProduct({id:2, title: "Chocolate BONAFIDE ", description: "Barra de chocolate 70% cacao.", price: 900, thumbnail: "URL/Aguila", code: "abc002", stock: 15})
        
        // - Eliminacion de un producto
        //await manager.deleteProduct(2)

        // - confirmacion de que el producto fue agregado a memoria y archivo correctamente
        //console.log(manager.getProducts())
        console.log(await manager.readProductsFromFile()) 

    }catch(err){
        console.log(err)
    }
}
main()
*/

module.exports = { ProductManager }