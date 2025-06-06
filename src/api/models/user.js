/* Modelo de datos de usuarios */

const mongoose = require('mongoose')
const {
  MOVIE_COLLECTION_NAME: movieCollectionName,
  USER_COLLECTION_NAME: userCollectionName,
  validation
} = require('../../utils/validation')

// Roles
const ROLES = {
  user: 'user',
  admin: 'admin'
}

// Esquema
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      unique: [true, `userName: ${validation.UNIQUE_MSG}`]
    },
    password: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      select: false
    },
    email: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      validate: {
        validator: validation.isEmail,
        message: validation.INVALID_EMAIL_MSG
      },
      unique: [true, `email: ${validation.UNIQUE_MSG}`]
    },
    role: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      enum: {
        values: Object.values(ROLES),
        message: `${
          validation.ALLOWED_VALUES_MSG
        }: ${validation.getObjectValues(ROLES)}`
      }
    },
    movies: {
      ref: movieCollectionName,
      type: [mongoose.Types.ObjectId],
      trim: true,
      validate: [
        {
          validator: validation.moviesExistInCollection,
          message: validation.getMovieDoesNotExistMsg(movieCollectionName)
        },
        // Valida si las películas del array pueden ser prestadas en función de las copias de la película y de sus copias actualmente prestadas a los usuarios
        {
          validator: async function (movies) {
            const { Movie } = require('./movie')
            const {
              getUsersByMovieIdValidator
            } = require('../controllers/user')

            for (const id of movies) {
              const movie = await Movie.findById(id)
              const users = await getUsersByMovieIdValidator(id)

              // Para poder prestar una película, tiene que haber alguna copia de la misma que no está siendo actualmente prestada a los usuarios
              // No hay que tener en cuenta el identificador del propio usuario
              if (
                movie != null &&
                users.find((user) => user._id.toJSON() === this._id.toJSON()) ==
                  null &&
                users.length >= movie.numCopies
              ) {
                return false
              }
            }

            return true
          },
          message: validation.getAllCopiesBorrowedMsg(userCollectionName)
        }
      ]
    }
  },
  {
    timestamps: true
  }
)

module.exports = { userSchema }

// Middlewares
const { preValidateUser, postValidateUser } = require('../../middlewares/user')
preValidateUser
postValidateUser

// Modelo, esquema y colección de los usuarios
// Si no se especifica, por defecto, la colección es el plural del modelo
const User = mongoose.model(userCollectionName, userSchema, userCollectionName)

module.exports = { ROLES, User }
