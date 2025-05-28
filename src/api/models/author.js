/* Modelo de datos de autores */

const mongoose = require('mongoose')
const {
  BOOK_COLLECTION_NAME: bookCollectionName,
  AUTHOR_COLLECTION_NAME: authorCollectionName,
  validation
} = require('../../utils/validation')

// Esquema
const authorSchema = new mongoose.Schema(
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
    books: {
      ref: bookCollectionName,
      type: [mongoose.Types.ObjectId],
      trim: true,
      validate: [
        {
          validator: validation.booksExistInCollection,
          message: validation.getBookDoesNotExistMsg(bookCollectionName)
        },
        // Valida si los libros del array no pertenecen a otro autor
        {
          validator: async function (books) {
            const {
              getAuthorByBookIdValidator
            } = require('../controllers/author')

            for (const id of books) {
              const author = await getAuthorByBookIdValidator(id)

              // No hay que tener en cuenta el identificador del propio autor
              if (author != null && author._id.toJSON() !== this._id.toJSON()) {
                return false
              }
            }

            return true
          },
          message: validation.getBookWithAuthorMsg(
            authorCollectionName,
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

module.exports = { authorSchema }

// Middlewares
const {
  preValidateAuthor,
  postValidateAuthor,
  preSaveAuthor
} = require('../../middlewares/author')
preValidateAuthor
postValidateAuthor
preSaveAuthor

// Modelo, esquema y colección de los autores
// Si no se especifica, por defecto, la colección es el plural del modelo
const Author = mongoose.model(
  authorCollectionName,
  authorSchema,
  authorCollectionName
)

module.exports = { Author }
