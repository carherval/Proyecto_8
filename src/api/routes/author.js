/* Rutas de autores */

// Enrutador para los "endpoints" de los autores
const authorRouter = require('express').Router()
const { authorController } = require('../controllers/author')
const { isAuthorizedUser } = require('../../middlewares/auth')
const { ROLES } = require('../models/user')

authorRouter.get('/get/all/', authorController.getAllAuthors)
authorRouter.get('/get/id/:id', authorController.getAuthorById)
authorRouter.get('/get/name/:name', authorController.getAuthorsByName)
authorRouter.get('/get/book-id/:id', authorController.getAuthorByBookId)
authorRouter.get(
  '/get/book-title/:title',
  authorController.getAuthorsByBookTitle
)
authorRouter.post(
  '/create/',
  isAuthorizedUser(ROLES.admin),
  authorController.createAuthor
)
authorRouter.put(
  '/update/id/:id',
  isAuthorizedUser(ROLES.admin),
  authorController.updateAuthorById
)
authorRouter.delete(
  '/delete/id/:id',
  isAuthorizedUser(ROLES.admin),
  authorController.deleteAuthorById
)

module.exports = { authorRouter }
