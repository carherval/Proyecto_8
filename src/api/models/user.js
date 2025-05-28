/* Modelo de datos de usuarios */

const mongoose = require('mongoose')
const {
  BOOK_COLLECTION_NAME: bookCollectionName,
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
    books: {
      ref: bookCollectionName,
      type: [mongoose.Types.ObjectId],
      trim: true,
      validate: [
        {
          validator: validation.booksExistInCollection,
          message: validation.getBookDoesNotExistMsg(bookCollectionName)
        },
        // Valida si los libros del array pueden ser prestados en función de las copias del libro y de sus copias actualmente prestadas a los usuarios
        {
          validator: async function (books) {
            const { Book } = require('./book')
            const { getUsersByBookIdValidator } = require('../controllers/user')

            for (const id of books) {
              const book = await Book.findById(id)
              const users = await getUsersByBookIdValidator(id)

              // Para poder prestar un libro, tiene que haber alguna copia del mismo que no está siendo actualmente prestada a los usuarios
              // No hay que tener en cuenta el identificador del propio usuario
              if (
                book != null &&
                users.find((user) => user._id.toJSON() === this._id.toJSON()) ==
                  null &&
                users.length >= book.numCopies
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
