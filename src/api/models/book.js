/* Modelo de datos de libros */

const mongoose = require('mongoose')
const {
  BOOK_COLLECTION_NAME: bookCollectionName,
  USER_COLLECTION_NAME: userCollectionName,
  validation
} = require('../../utils/validation')

// Géneros
const GENRES = {
  biography: 'Biografía',
  sciFi: 'Ciencia ficción',
  essay: 'Ensayo',
  fantasy: 'Fantasía',
  historical: 'Histórico',
  informative: 'Informativo',
  literature: 'Literatura infantil y juvenil',
  mystery: 'Misterio y suspense',
  narrative: 'Narrativa',
  poetry: 'Poesía',
  romance: 'Romance',
  theater: 'Teatro',
  fear: 'Terror'
}

// Esquema
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      unique: [true, `title: ${validation.UNIQUE_MSG}`]
    },
    genre: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      enum: {
        values: Object.values(GENRES),
        message: `${
          validation.ALLOWED_VALUES_MSG
        }: ${validation.getObjectValues(GENRES)}`
      }
    },
    isbn: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      validate: {
        validator: validation.isIsbn,
        message: validation.INVALID_ISBN_MSG
      },
      unique: [true, `isbn: ${validation.UNIQUE_MSG}`]
    },
    publicationDate: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      validate: [
        {
          validator: validation.isFormattedDate,
          message: validation.DATE_FORMAT_MSG
        },
        {
          validator: validation.isValidDateYear,
          message: validation.INVALID_YEAR_MSG
        },
        {
          validator: validation.isValidDate,
          message: validation.INVALID_DATE_MSG
        }
      ]
    },
    numCopies: {
      type: Number,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      validate: [
        {
          validator: validation.isNumber,
          message: validation.INVALID_NUMBER_MSG
        },
        {
          validator: validation.isValidNumCopies,
          message: validation.INVALID_NUM_COPIES_MSG
        },
        // Valida si las copias del libro no son inferiores a las copias actualmente prestadas a los usuarios
        {
          validator: async function (numCopies) {
            const { User } = require('./user')

            return (
              numCopies >=
              (await User.find({ books: { $in: this._id } })).length
            )
          },
          message: validation.getCopiesLessThanBorrowingsMsg(
            bookCollectionName,
            userCollectionName
          )
        }
      ]
    },
    abstract: { type: String, trim: true }
  },
  {
    timestamps: true
  }
)

module.exports = { bookSchema }

// Middlewares
const { preValidateBook } = require('../../middlewares/book')
preValidateBook

// Modelo, esquema y colección de los libros
// Si no se especifica, por defecto, la colección es el plural del modelo
const Book = mongoose.model(bookCollectionName, bookSchema, bookCollectionName)

module.exports = { GENRES, Book }
