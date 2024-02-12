//- DESAFIO ENTREGABLE BACKEND 06/02/2024

class ProductManager {
    //#products
    #ultimoId = 1

    constructor(){
        this.products = []
    }

    getProducts(){
        return this.products
    }

    //? Creación de Id autoincrementable
    #getNuevoId(){
        const id = this.#ultimoId
        this.#ultimoId += 1
        return id
    }


    //? Metodo de busqueda por ID
    getProductById(idABuscar){
        const busqueda = this.products.find((id)=>{
            return idABuscar === id
        })
        if(busqueda){
            return busqueda
        }
    }

    //? Método para agregar un nuevo producto
    addProduct(title, description, price, thumbnail, code, stock){

        //? Validacion de condiciones (ninguna clave vacia o en blanco)
        if(!title || !description || !price || !thumbnail || !code || !stock || title.trim() === "" || description.trim() === "" || price < 1 || thumbnail.trim() === "" || code.trim() === "" || stock < 1 ){
            console.log("ERROR EN LA CARGA DEL PRODUCTO. TODOS LOS DATOS SON OBLIGATORIOS Y NO PUEDEN ESTAR EN BLANCO. EL PRECIO Y EL STOCK DEBEN SER MAYORES QUE 1.");
            return
        }

        //? Validacion de no repeticion de clave "code"
        /* if(code === code){
            "No puede haber codigos iguales"
            return
        } */

        //? Creación del nuevo producto
        const newProduct = {
            id: this.#getNuevoId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        //? Agregar el nuevo producto
        this.products.push(newProduct)
        //console.log(kiosko.products)
    }

}






//-TESTING

//Creacion de instancia nueva
const kiosko = new ProductManager

//Agrego un producto a la instancia nueva
kiosko.addProduct("Alfajor Terrabussi", "Alfajor bañado en chocolate relleno de DDL", 400,  "URL/Alfajor", "abc001", 10)
kiosko.addProduct("Chocolate Aguila ", "Barra de chocolate 70% cacao", 1200, "URL/Aguila", "abc002", 15)


//console.log(kiosko.getProducts())
console.log(kiosko.getProductById(2))










//EJEMPLO
/* const ejemplo = {
    name: "Alfajor Terrabussi",
    description: "Alfajor bañao en chocolate relleno de DDL",
    price: 400,
    URL: "URL/Alfajor",
    code: "abc001",
    stock: 10
} */




//PROBANDO .trim()
/* const obj = {
    saludo: " ",
    despedida: "chau"
}

if(obj.saludo.trim().length>0){
    console.log("tiene letras");
}else{
    console.log("no tiene letras")
} */