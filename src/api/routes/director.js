/* Rutas de directores */

// Enrutador para los "endpoints" de los directores
const directorRouter = require('express').Router()
const { directorController } = require('../controllers/director')
const { isAuthorizedUser } = require('../../middlewares/auth')
const { ROLES } = require('../models/user')

directorRouter.get('/get/all/', directorController.getAllDirectors)
directorRouter.get('/get/id/:id', directorController.getDirectorById)
directorRouter.get('/get/name/:name', directorController.getDirectorsByName)
directorRouter.get('/get/movie-id/:id', directorController.getDirectorByMovieId)
directorRouter.get(
  '/get/movie-title/:title',
  directorController.getDirectorsByMovieTitle
)
directorRouter.post(
  '/create/',
  isAuthorizedUser(ROLES.admin),
  directorController.createDirector
)
directorRouter.put(
  '/update/id/:id',
  isAuthorizedUser(ROLES.admin),
  directorController.updateDirectorById
)
directorRouter.delete(
  '/delete/id/:id',
  isAuthorizedUser(ROLES.admin),
  directorController.deleteDirectorById
)

module.exports = { directorRouter }
