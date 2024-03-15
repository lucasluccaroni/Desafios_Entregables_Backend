const socket = io()

//POST
// Por cada producto generero una card con sus propiedades
socket.on("newProduct", (product)=>{
    const container = document.getElementById("productBox")
    
    container.innerHTML += `
    <div class="oneProduct">
        <h2> ${product.title} </h2>
        <h3> Description: ${product.description} </h3>
        <h3> Price: ${product.price} </h3>
        <h4> Category: ${product.category} </h4>
        <h5> Stock: ${product.stock} </h5>
        <h5> Code: ${product.code} </h5>
    </div>`
})


//DELETE
socket.on("productDeleted", (products) => {
    // Vacio el container para crear nuevamente todos los productos, pero esta vez sin el producto eliminado
    const container = document.getElementById("productBox");
    container.innerHTML = '';

    //Recorro cada producto y genero una "card"
    products.forEach((product) => {
        const divContainer = document.createElement("div")
        divContainer.classList.add('oneProduct')

        const title = document.createElement("h2")
        title.innerText = product.title;

        const description = document.createElement("h3")
        description.innerText = product.description;

        const price = document.createElement("h3")
        price.innerText = `Precio: ${product.price}`

        const category = document.createElement("h3")
        category.innerHTML = product.category

        const stock = document.createElement("h5")
        stock.innerText = `Stock: ${product.stock}`

        const code = document.createElement("h5")
        code.innerText = `Código: ${product.code}`

        const id = document.createElement("h6")
        id.innerText = product.id

        //Le agrego todas las propiedades a la card y las meto en un container
        divContainer.append(title, description, price, category, stock, code, id)
        container.append(divContainer)
    })
})