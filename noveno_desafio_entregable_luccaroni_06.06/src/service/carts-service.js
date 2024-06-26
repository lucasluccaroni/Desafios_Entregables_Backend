// Service - Repository
const ProductModel = require("../dao/models/product.model")
const CartModel = require("../dao/models/cart.model")
const UserModel = require("../dao/models/user.model")

const { ProductsDAO } = require("../dao/mongo/products.dao")
const { ProductsService } = require("./products-service")
const productsDAO = new ProductsDAO()
const productsService = new ProductsService(productsDAO)

const { UsersDAO } = require("../dao/mongo/users.dao")
const { UsersService } = require("./users-service")
const usersDAO = new UsersDAO()
const usersService = new UsersService(usersDAO)

const { CartsDTO } = require("../dao/dtos/carts.dto")
const TicketModel = require("../dao/models/ticket.model")

const { ErrorCodes } = require("./errors/errorCodes")
const { CustomError } = require("./errors/CustomError")
const errors = require("./errors/errors")

class CartsService {
    constructor(dao) {
        this.dao = dao
    }

    async getCarts() {
        const carts = await this.dao.getCarts()
        if (!carts) {
            throw CustomError.createError({
                name: "Database Error",
                cause: "Database problem caused failure in opreation",
                message: errors.databaseProblem(),
                code: ErrorCodes.DATABASE_ERROR
            })
        }

        // Transformacion de carts usando DTO
        const cartsTransformed = carts.map(c => {
            const dto = new CartsDTO(c)
            const transformation = dto.trasnformOneCart()
            return transformation
        })

        return cartsTransformed
        // return carts
    }

    async getCartById(id) {

        if (id.length < 24) {
            throw CustomError.createError({
                name: "Not Found <24",
                cause: "Cart Not Found in Database",
                message: errors.generateInvalidCartIdError({ id }),
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        const cart = await this.dao.getCartById(id)
        // console.log("RESPUESTA getCartById DAO => ", cart)

        if (cart === false) {
            // throw new Error("Cart not found!")
            throw CustomError.createError({
                name: "Not Found false",
                cause: "Cart not found in Database.",
                message: errors.generateInvalidCartIdError({ id }),
                code: ErrorCodes.NOT_FOUND
            })

        } else if (cart === null) {
            throw CustomError.createError({
                name: "Invalid Data",
                cause: "Cart not found in Database.",
                message: errors.generateInvalidProductIdError({ id }),
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        // Transformacion de cart usando DTO
        const dto = new CartsDTO(cart)
        const cartTransformed = dto.trasnformOneCart()

        return cartTransformed
    }

    async createCart() {
        const result = await this.dao.createCart()

        if (!result) {
            throw CustomError.createError({
                name: "Database Error",
                cause: "Database problem caused failure in opreation",
                message: errors.databaseProblem(),
                code: ErrorCodes.DATABASE_ERROR
            })
        }

        // Transformacion de cart usando DTO
        const dto = new CartsDTO(result)
        const cartTransformed = dto.trasnformOneCart()

        return cartTransformed
    }

    async addProductToExistingCart(cartId, productId, quantity, userInfo) {
        // try {
        let productExistInCart

        // Busco el carrito
        const cart = await CartModel.findOne({ _id: cartId })
        if (!cart) {
            throw CustomError.createError({
                name: "Not Found",
                cause: "Cart not found in Database.",
                message: errors.generateInvalidCartIdError(cartId),
                code: ErrorCodes.NOT_FOUND
            })
        }
        console.log("CARRITO ENCONTRADO => ", cart)

        // Busco el carrito que le corresponde al User cuando se registró
        const user = await usersService.getUserById(userInfo.id)
        console.log("USER ENCONTRADO EN CARTS-SERVICE => ", user)

        const userCart = user.cart.toString()
        console.log("USER CART => ", userCart)

        // Comparo los carritos. El usuario registrado solo puede añadir carritos al carrito que le corresponde.
        if (userCart !== cart.id) {
            throw CustomError.createError({
                name: "This Cart in not yours!",
                cause: "Cart not found in Database.",
                message: errors.generateWrongCartError(cartId),
                code: ErrorCodes.UNAUTHORIZED
            })
        }

        // Busco el producto
        const productToAdd = await ProductModel.findById(productId)
        if (productToAdd === false) {
            throw CustomError.createError({
                name: "Not Found false",
                cause: "Product not found in Database.",
                message: errors.generateInvalidProductIdError(productId),
                code: ErrorCodes.NOT_FOUND
            })
        } else if (productToAdd === null) {
            throw CustomError.createError({
                name: "Invalid Data",
                cause: "Product not found in Database.",
                message: errors.generateInvalidProductIdError(productId),
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }
        console.log("PRODUCTO ENCONTRADO => ", productToAdd)

        // Busco si el producto ya existe en el carrito
        let found = cart.products.find(productToAdd => {
            return (productToAdd._id.toString() === productId)
        })
        console.log("BUSQUEDA SERVICE => ", found)


        // Si no existe, lo agrego al carrito
        if (!found) {

            // Verifico la cantidad actual, la que se quiere ingresar y el stock disponible
            if (quantity < 0 || quantity > productToAdd.stock) {
                throw CustomError.createError({
                    name: "Wrong quantity!",
                    cause: "Wrong quantity!",
                    message: errors.generateWrongQuantityError(quantity),
                    code: ErrorCodes.INVALID_TYPES_ERROR
                })
            }

            productExistInCart = false
            const cartUpdate = this.dao.addProductToExistingCart(productExistInCart, cartId, productId, quantity)
            return cartUpdate

            // Si existe, sumo la cantidad ingresada + la que que tenia y actualizo el producto    
        } else if (found) {
            console.log("FOUND ENCONTRADO => ", found)

            // Verifico la cantidad actual, la que se quiere actualizar y el stock disponible
            if (found.quantity < 0 || quantity < 0 || quantity > productToAdd.stock) {
                throw CustomError.createError({
                    name: "Wrong quantity!",
                    cause: "Wrong quantity!",
                    message: errors.generateWrongQuantityError(quantity),
                    code: ErrorCodes.INVALID_TYPES_ERROR
                })
            }

            quantity += found.quantity
            productExistInCart = true

            const cartUpdate = this.dao.addProductToExistingCart(productExistInCart, cartId, productId, quantity)
            return cartUpdate
        }
        // }
        // catch (err) {
        //     console.log(err)
        //     throw new Error(err)
        // }
    }

    async updateProductFromExistingCart(cartId, productId, quantity, userInfo) {

        // Busco el carrito
        const cart = await this.getCartById(cartId)

        // Busco el carrito que le corresponde al User cuando se registró
        const user = await usersService.getUserById(userInfo.id)
        console.log("USER ENCONTRADO EN CARTS-SERVICE => ", user)

        const userCart = user.cart.toString()
        console.log("USER CART => ", userCart)

        // Comparo los carritos. El usuario registrado solo puede añadir carritos al carrito que le corresponde.
        if (userCart !== cart.id) {
            throw CustomError.createError({
                name: "This Cart in not yours!",
                cause: "Cart not found in Database.",
                message: errors.generateWrongCartError(cartId),
                code: ErrorCodes.UNAUTHORIZED
            })
        }

        // Busco el producto
        const productToAdd = await productsService.getProductById(productId)

        // Verificacion si el producto ya esta en el carrito
        let found = cart.products.find(productToAdd => {
            return (productToAdd.id.toString() === productId)
        })

        // Si está, primero verifico si tiene el stock solicitado antes de actualizar la cantidad.
        if (found) {

            // Verifico la cantidad actual, la que se quiere actualizar y el stock disponible
            if (found.quantity < 0 || quantity < 0 || quantity > productToAdd.stock) {
                throw CustomError.createError({
                    name: "Wrong quantity!",
                    cause: "Wrong quantity!",
                    message: errors.generateWrongQuantityError(quantity),
                    code: ErrorCodes.INVALID_TYPES_ERROR
                })
            }

            found.quantity = quantity

            const cartUpdate = await this.dao.updateProductFromExistingCart(cartId, productId, quantity)
            return cartUpdate

            // Si no está, arrojo un error
        } else if (!found) {
            throw CustomError.createError({
                name: "Not Found ",
                cause: "Product not found in Cart.",
                message: errors.generateInvalidProductIdError(productId),
                code: ErrorCodes.NOT_FOUND
            })
        }
    }

    async deleteProductFromExistingCart(cartId, productId) {

        // Busco el carrito
        const cart = await this.getCartById(cartId)
        console.log("CART => ", cart)

        // Busco el producto
        const productToDelete = await productsService.getProductById(productId)
        console.log("PRODUCT TO DELETE => ", productToDelete)

        // Verificacion si el producto ya esta en el carrito
        let found = cart.products.find(productToDelete => {
            return (productToDelete.id.toString() === productId)
        })

        // Si esta, actualizo el carrito quitando ese producto
        if (found) {
            const deleteProduct = await this.dao.deleteProductFromExistingCart(cartId, productToDelete.id)

            if (!deleteProduct) {
                throw CustomError.createError({
                    name: "Database Error",
                    cause: "Database problem caused failure in opreation",
                    message: errors.databaseProblem(),
                    code: ErrorCodes.DATABASE_ERROR
                })
            }

            return deleteProduct

            // Si no esta, arrojo un error
        } else if (!found) {
            throw CustomError.createError({
                name: "Not Found ",
                cause: "Product not found in Cart.",
                message: errors.generateInvalidProductIdError(productId),
                code: ErrorCodes.NOT_FOUND
            })
        }
    }

    async clearCart(id) {

        const cart = await CartModel.findOne({ _id: id })
        if (!cart) {
            throw CustomError.createError({
                name: "Not Found",
                cause: "Cart not found in Database.",
                message: errors.generateInvalidCartIdError(id),
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        const result = await this.dao.clearCart(id)
        console.log("RESULT SERVICE => ", result)
        if (!result) {
            throw CustomError.createError({
                name: "Database Error",
                cause: "Database problem caused failure in opreation",
                message: errors.databaseProblem(),
                code: ErrorCodes.DATABASE_ERROR
            })
        }

        return result
    }

    async deleteCart(id) {

        const deletedCart = await this.dao.deleteCart(id)

        if (!deletedCart) {
            throw CustomError.createError({
                name: "Database Error",
                cause: "Database problem caused failure in opreation",
                message: errors.databaseProblem(),
                code: ErrorCodes.DATABASE_ERROR
            })

        } else if (deletedCart.deletedCount == 0) {
            console.log("DELETED CART SERVICE", deletedCart.deletedCount)
            throw CustomError.createError({
                name: "Not Found",
                cause: "Cart not found in Database.",
                message: errors.generateInvalidCartIdError(id),
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        console.log("DELETED PRODUCT SERVICE", deletedCart.deletedCount)
        return (deletedCart)

    }

    async purchaseCart(cartId, userInfo) {

        // Traigo el carrito y el usuario
        const cart = await this.getCartById(cartId)
        const user = await usersService.getUserById(userInfo.id)

        // Verifico que el carrito pertenezca al usuario
        if (user.cart.toString() !== cart.id) {
            throw CustomError.createError({
                name: "This Cart in not yours!",
                cause: "Cart not found in Database.",
                message: errors.generateWrongCartError(cartId),
                code: ErrorCodes.UNAUTHORIZED
            })
        }

        // Inicializo el total de la compra
        let totalAmount = 0

        // Itero sobre cada producto en el carrito
        for (let i = 0; i < cart.products.length; i++) {
            // Obtengo la cantidad y el ID del producto
            const quantity = cart.products[i].quantity
            const productId = cart.products[i].id.toString()

            // Busca el producto en la base de datos
            const productToPurchase = await productsService.getProductById(productId)

            // Calculo el monto de este producto y lo añado al total
            const amount = productToPurchase.price * quantity
            totalAmount += amount

            // Actualizo el stock del producto
            const remainingStock = productToPurchase.stock - quantity
            await productsService.updateProduct(productId, { stock: remainingStock })
        }

        // Genero el ticket con el total de la compra
        const ticket = await TicketModel.create({
            code: parseInt(Math.random() * 1000),
            purchase_datetime: Date.now(),
            amount: totalAmount,
            purchaser: user.email
        })

        return ticket
    }
}

module.exports = { CartsService }