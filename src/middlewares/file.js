/* Middlewares de archivos */

// Devuelve si un archivo tiene un tamaño válido
const isValidSize = (req, res, next) => {
  // MB
  const MAX_SIZE = 5

  // Longitud (tamaño) de un archivo enviado a través de una solicitud HTTP (formulario HTML)
  const contentLength = req.headers['content-length']

  if (
    contentLength != null &&
    parseInt(contentLength) > MAX_SIZE * 1024 * 1204
  ) {
    const { validation } = require('../utils/validation')

    return res
      .status(413)
      .send(
        `Se ha producido un error al subir el archivo a "Cloudinary":${validation.LINE_BREAK}El tamaño no debe ser superior a ${MAX_SIZE} MB`
      )
  }

  next()
}

module.exports = { isValidSize }
