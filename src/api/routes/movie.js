/* Rutas de películas */

// Enrutador para los "endpoints" de las películas
const movieRouter = require('express').Router()
const { movieController } = require('../controllers/movie')
const { isAuthorizedUser } = require('../../middlewares/auth')
const { ROLES } = require('../models/user')

movieRouter.get('/get/all/', movieController.getAllMovies)
movieRouter.get('/get/id/:id', movieController.getMovieById)
movieRouter.get('/get/title/:title', movieController.getMoviesByTitle)
movieRouter.get('/get/genre/:genre', movieController.getMoviesByGenre)
movieRouter.get(
  '/get/age-rating/:ageRating',
  movieController.getMoviesByAgeRating
)
movieRouter.get(
  '/get/director-name/:name',
  movieController.getMoviesByDirectorName
)
movieRouter.post(
  '/create/',
  isAuthorizedUser(ROLES.admin),
  movieController.createMovie
)
movieRouter.put(
  '/update/id/:id',
  isAuthorizedUser(ROLES.admin),
  movieController.updateMovieById
)
movieRouter.delete(
  '/delete/id/:id',
  isAuthorizedUser(ROLES.admin),
  movieController.deleteMovieById
)

module.exports = { movieRouter }
