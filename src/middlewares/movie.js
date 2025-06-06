/* Middlewares de películas */

const { movieSchema } = require('../api/models/movie')
const { validation } = require('../utils/validation')

// Transformación de los datos de las películas antes de su validación
const preValidateMovie = movieSchema.pre('validate', function (next) {
  // Normalización de cadena
  if (this.title != null) {
    this.title = validation.normalizeString(this.title)
  }

  // Normalización de cadena
  if (this.genre != null) {
    this.genre = validation.normalizeString(this.genre)
  }

  // Normalización de cadena
  if (this.synopsis != null) {
    this.synopsis = validation.normalizeString(this.synopsis)
  }

  next()
})

module.exports = { preValidateMovie }
