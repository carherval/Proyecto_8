/* Middlewares de usuarios */

// Permite gestionar archivos enviados a través de una solicitud HTTP (formulario HTML)
const multer = require('multer')
const { userSchema } = require('../api/models/user')
const { validation } = require('../utils/validation')

// Subida de usuarios
const uploadUser = (req, res, next) => {
  multer().none()(req, res, (error) => {
    if (error != null) {
      return res
        .status(400)
        .send(
          `Se ha producido un error al subir el usuario:${validation.LINE_BREAK}${error.message}`
        )
    }

    next()
  })
}

// Transformación de los datos de los usuarios antes de su validación
const preValidateUser = userSchema.pre('validate', function (next) {
  // Normalización de nombre de usuario
  if (this.userName != null) {
    this.userName = validation.normalizeUserName(this.userName)
  }

  // Normalización de cadena
  if (this.role != null) {
    this.role = validation.normalizeString(this.role)
  }

  next()
})

// Transformación de los datos de los usuarios después de su validación
const postValidateUser = userSchema.post('validate', function () {
  // Eliminación de duplicados
  if (validation.isNotEmptyArray(this.movies)) {
    this.movies = validation.removeDuplicates(this.movies)
  }
})

module.exports = { uploadUser, preValidateUser, postValidateUser }
