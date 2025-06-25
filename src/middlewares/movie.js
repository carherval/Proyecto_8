/* Middlewares de películas */

const MOVIE_FOLDER_NAME = 'Movies'

// Permite gestionar archivos en "cloudinary" mediante su API
const cloudinary = require('cloudinary').v2
// Permite gestionar archivos enviados a través de una solicitud HTTP (formulario HTML)
const multer = require('multer')
// Permite a "multer" almacenar archivos en "cloudinary"
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { movieSchema } = require('../api/models/movie')
const { validation } = require('../utils/validation')

// Configuración del almacenamiento de los carteles de las películas
const moviePosterStorageConfig = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: MOVIE_FOLDER_NAME,
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  }
})

// Subida de películas
const uploadMovie = (req, res, next) => {
  // Se pasa como parámetro el nombre del campo de la solicitud HTTP (formulario HTML) de tipo "file"
  multer({ storage: moviePosterStorageConfig }).single('poster')(
    req,
    res,
    (error) => {
      if (error != null || (req.file != null && req.file.path == null)) {
        return res
          .status(400)
          .send(
            `Se ha producido un error al subir el cartel de la película a "Cloudinary"${
              error != null ? ':' + validation.LINE_BREAK + error.message : ''
            }`
          )
      }

      next()
    }
  )
}

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

module.exports = {
  MOVIE_FOLDER_NAME,
  moviePosterStorageConfig,
  uploadMovie,
  preValidateMovie
}
