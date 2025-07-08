/* Middlewares de directores */

const DIRECTOR_FOLDER_NAME = 'Directors'

// Permite gestionar archivos enviados a través de una solicitud HTTP (formulario HTML)
const multer = require('multer')
const { storageConfig } = require('./file')
const { directorSchema } = require('../api/models/director')
const { validation } = require('../utils/validation')

// Subida de directores
const uploadDirector = (req, res, next) => {
  // Se pasa como parámetro el nombre del campo de la solicitud HTTP (formulario HTML) de tipo "file"
  multer({ storage: storageConfig(DIRECTOR_FOLDER_NAME) }).single('photo')(
    req,
    res,
    (error) => {
      if (error != null || (req.file != null && req.file.path == null)) {
        return res
          .status(400)
          .send(
            `Se ha producido un error al subir la foto del director a "Cloudinary"${
              error != null ? ':' + validation.LINE_BREAK + error.message : ''
            }`
          )
      }

      next()
    }
  )
}

// Transformación de los datos de los directores antes de su validación
const preValidateDirector = directorSchema.pre('validate', function (next) {
  // Normalización de cadena
  if (this.surnames != null) {
    this.surnames = validation.normalizeString(this.surnames)
  }

  // Normalización de cadena
  if (this.name != null) {
    this.name = validation.normalizeString(this.name)
  }

  next()
})

// Transformación de los datos de los directores después de su validación
const postValidateDirector = directorSchema.post('validate', function () {
  // Eliminación de duplicados
  if (validation.isNotEmptyArray(this.movies)) {
    this.movies = validation.removeDuplicates(this.movies)
  }
})

// Validación de los datos de los directores antes de su guardado
const preSaveDirector = directorSchema.pre('save', async function (next) {
  // Validación de apellidos y nombre únicos
  const { Director } = require('../api/models/director')
  const director = await Director.findOne({
    surnames: validation.normalizeString(this.surnames),
    name: validation.normalizeString(this.name)
  })

  // No hay que tener en cuenta el identificador del propio director
  if (director != null && director._id.toJSON() !== this._id.toJSON()) {
    return next(new Error(`surnames + name: ${validation.UNIQUE_MSG}`))
  }

  next()
})

module.exports = {
  DIRECTOR_FOLDER_NAME,
  uploadDirector,
  preValidateDirector,
  postValidateDirector,
  preSaveDirector
}
