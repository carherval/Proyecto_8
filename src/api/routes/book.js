/* Rutas de libros */

// Enrutador para los "endpoints" de los libros
const bookRouter = require('express').Router()
const { bookController } = require('../controllers/book')
const { isAuthorizedUser } = require('../../middlewares/auth')
const { ROLES } = require('../models/user')

bookRouter.get('/get/all/', bookController.getAllBooks)
bookRouter.get('/get/id/:id', bookController.getBookById)
bookRouter.get('/get/title/:title', bookController.getBooksByTitle)
bookRouter.get('/get/genre/:genre', bookController.getBooksByGenre)
bookRouter.get('/get/isbn/:isbn', bookController.getBooksByIsbn)
bookRouter.get('/get/author-name/:name', bookController.getBooksByAuthorName)
bookRouter.post(
  '/create/',
  isAuthorizedUser(ROLES.admin),
  bookController.createBook
)
bookRouter.put(
  '/update/id/:id',
  isAuthorizedUser(ROLES.admin),
  bookController.updateBookById
)
bookRouter.delete(
  '/delete/id/:id',
  isAuthorizedUser(ROLES.admin),
  bookController.deleteBookById
)

module.exports = { bookRouter }
