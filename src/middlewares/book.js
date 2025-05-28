/* Middlewares de libros */

const { bookSchema } = require('../api/models/book')
const { validation } = require('../utils/validation')

// Transformación de los datos de los libros antes de su validación
const preValidateBook = bookSchema.pre('validate', function (next) {
  // Normalización de cadena
  if (this.title != null) {
    this.title = validation.normalizeString(this.title)
  }

  // Normalización de cadena
  if (this.genre != null) {
    this.genre = validation.normalizeString(this.genre)
  }

  // Normalización de cadena
  if (this.abstract != null) {
    this.abstract = validation.normalizeString(this.abstract)
  }

  next()
})

module.exports = { preValidateBook }
