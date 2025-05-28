/* Middlewares de autorización de usuarios */

const { ROLES } = require('../api/models/user')
const { validation } = require('../utils/validation')

// Devuelve si un usuario está autorizado para acceder a un "endpoint" en función de su rol
const isAuthorizedUser = (role = ROLES.user) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]

      if (token == null) {
        throw new Error(validation.getLoginMsg())
      }

      const { User } = require('../api/models/user')
      const { getDecodedToken } = require('../utils/token')

      req.user = await User.findById(getDecodedToken(token).id)

      // Aunque se encuentre el usuario puede dar error por "jwt expired", "invalid token" o "jwt malformed"
      // Si no se encuentra el usuario es porque ha sido eliminado estando el token todavía activo
      if (req.user == null) {
        throw new Error(validation.getLoginMsg())
      }

      if (req.user.role !== role && role === ROLES.admin) {
        throw new Error(validation.getLoginMsg(ROLES.admin))
      }

      next()
    } catch (error) {
      error.message = `Se ha producido un error al acceder al "endpoint":${validation.LINE_BREAK}${error.message}`
      error.status = 401
      next(error)
    }
  }
}

module.exports = { isAuthorizedUser }
