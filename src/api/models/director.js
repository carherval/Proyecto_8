/* Modelo de datos de directores */

const mongoose = require('mongoose')
const {
  MOVIE_COLLECTION_NAME: movieCollectionName,
  DIRECTOR_COLLECTION_NAME: directorCollectionName,
  validation
} = require('../../utils/validation')

// Esquema
const directorSchema = new mongoose.Schema(
  {
    surnames: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG]
    },
    name: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG]
    },
    birthYear: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      validate: [
        {
          validator: validation.isYear,
          message: validation.YEAR_FORMAT_MSG
        },
        {
          validator: validation.isValidYear,
          message: validation.INVALID_YEAR_MSG
        }
      ]
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
        // Valida si las películas del array no pertenecen a otro director
        {
          validator: async function (movies) {
            const {
              getDirectorByMovieIdValidator
            } = require('../controllers/director')

            for (const id of movies) {
              const director = await getDirectorByMovieIdValidator(id)

              // No hay que tener en cuenta el identificador del propio director
              if (
                director != null &&
                director._id.toJSON() !== this._id.toJSON()
              ) {
                return false
              }
            }

            return true
          },
          message: validation.getMovieWithDirectorMsg(
            directorCollectionName,
            validation.LINE_BREAK
          )
        }
      ]
    }
  },
  {
    timestamps: true
  }
)

module.exports = { directorSchema }

// Middlewares
const {
  preValidateDirector,
  postValidateDirector,
  preSaveDirector
} = require('../../middlewares/director')
preValidateDirector
postValidateDirector
preSaveDirector

// Modelo, esquema y colección de los directores
// Si no se especifica, por defecto, la colección es el plural del modelo
const Director = mongoose.model(
  directorCollectionName,
  directorSchema,
  directorCollectionName
)

module.exports = { Director }
