/* Controladores de libros */

const mongoose = require('mongoose')
const { Book } = require('../models/book')
const bookCollectionName = Book.collection.name
const { Author } = require('../models/author')
const { validation } = require('../../utils/validation')
const moment = require('moment')

const getBookNotFoundByIdMsg = (id) => {
  return `No se ha encontrado ningún libro en la colección "${bookCollectionName}" con el identificador "${id}"`
}

// Devuelve un libro añadiendo a su información el nombre de su autor (apellidos y nombre) y las fechas formateadas
const getBookWithAuthor = async (book) => {
  if (book != null) {
    const author = await Author.findOne({
      books: { $in: book._id }
    })

    book = book.toObject()
    book.author = author != null ? `${author.surnames}, ${author.name}` : ''

    book.createdAt = moment(book.createdAt).format('DD/MM/YYYY HH:mm:ss')
    book.updatedAt = moment(book.updatedAt).format('DD/MM/YYYY HH:mm:ss')
  }

  return book
}

// Devuelve los libros añadiendo a su información el nombre de su autor (apellidos y nombre) y las fechas formateadas
const getBooksWithAuthor = async (books) => {
  return await Promise.all(books.map((book) => getBookWithAuthor(book)))
}

// Devuelve todos los libros ordenados alfabéticamente por título
// Se añade a la información el nombre del autor del libro
const getAllBooks = async (req, res, next) => {
  try {
    const books = (await getBooksWithAuthor(await Book.find())).sort(
      validation.sortBooks
    )

    if (books.length > 0) {
      return res.status(200).send(books)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado libros en la colección "${bookCollectionName}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar los libros en la colección "${bookCollectionName}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve un libro mediante su identificador
// Se añade a la información el nombre del autor del libro
const getBookById = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const book = await getBookWithAuthor(await Book.findById(id))

    if (book != null) {
      return res.status(200).send(book)
    } else {
      return res.status(404).send(getBookNotFoundByIdMsg(id))
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${bookCollectionName}" el libro con el identificador "${id}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve los libros filtrados por título y ordenados alfabéticamente por título
// Se añade a la información el nombre del autor del libro
const getBooksByTitle = async (req, res, next) => {
  const title = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.title)
  )

  try {
    const books = (await getBooksWithAuthor(await Book.find({ title }))).sort(
      validation.sortBooks
    )

    if (books.length > 0) {
      return res.status(200).send(books)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado libros en la colección "${bookCollectionName}" cuyo título contenga "${validation.normalizeSearchString(
            title
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${bookCollectionName}" los libros cuyo título contenga "${validation.normalizeSearchString(
      title
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve los libros filtrados por género y ordenados alfabéticamente por título
// Se añade a la información el nombre del autor del libro
const getBooksByGenre = async (req, res, next) => {
  const genre = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.genre)
  )

  try {
    const books = (
      await getBooksWithAuthor(await Book.find({ genre: { $in: genre } }))
    ).sort(validation.sortBooks)

    if (books.length > 0) {
      return res.status(200).send(books)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado libros en la colección "${bookCollectionName}" cuyo género contenga "${validation.normalizeSearchString(
            genre
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${bookCollectionName}" los libros cuyo género contenga "${validation.normalizeSearchString(
      genre
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve los libros filtrados por ISBN y ordenados alfabéticamente por título
// Se añade a la información el nombre del autor del libro
const getBooksByIsbn = async (req, res, next) => {
  const isbn = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.isbn)
  )

  try {
    const books = (await getBooksWithAuthor(await Book.find({ isbn }))).sort(
      validation.sortBooks
    )

    if (books.length > 0) {
      return res.status(200).send(books)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado libros en la colección "${bookCollectionName}" cuyo ISBN contenga "${validation.normalizeSearchString(
            isbn
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${bookCollectionName}" los libros cuyo ISBN contenga "${validation.normalizeSearchString(
      isbn
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve los libros filtrados por apellidos o nombre del autor y ordenados alfabéticamente por título
// Se añade a la información el nombre del autor del libro
const getBooksByAuthorName = async (req, res, next) => {
  const name = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.name)
  )
  const BOOKS_NOT_FOUND_BY_AUTHOR_NAME_MSG = `No se han encontrado libros en la colección "${bookCollectionName}" cuyo autor contenga en los apellidos o en el nombre "${validation.normalizeSearchString(
    name
  )}"`

  try {
    const authors = await Author.find({
      $or: [{ surnames: name }, { name }]
    }).populate('books')

    if (authors.length > 0) {
      const books = (
        await getBooksWithAuthor(
          authors.reduce((acc, author) => acc.concat(author.books), [])
        )
      ).sort(validation.sortBooks)

      if (books.length > 0) {
        return res.status(200).send(books)
      } else {
        return res.status(404).send(BOOKS_NOT_FOUND_BY_AUTHOR_NAME_MSG)
      }
    } else {
      return res.status(404).send(BOOKS_NOT_FOUND_BY_AUTHOR_NAME_MSG)
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${bookCollectionName}" los libros cuyo autor contenga en los apellidos o en el nombre "${validation.normalizeSearchString(
      name
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Crea un libro nuevo
const createBook = async (req, res, next) => {
  try {
    return res
      .status(201)
      .send(await getBookWithAuthor(await new Book(req.body).save()))
  } catch (error) {
    error.message = `Se ha producido un error al crear el libro en la colección "${bookCollectionName}":${
      validation.LINE_BREAK
    }${validation.formatErrorMsg(error.message)}`
    error.status = 500
    next(error)
  }
}

// Actualiza un libro existente mediante su identificador
const updateBookById = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const book = await Book.findById(id)

    if (book == null) {
      throw new Error(getBookNotFoundByIdMsg(id))
    }

    if (Object.keys(req.body).length === 0) {
      throw new Error(
        `No se ha introducido ningún dato para actualizar el libro con el identificador "${id}"`
      )
    }

    // Se obtiene la información del libro a actualizar y se sustituye por la introducida por el usuario
    let updatedBook = new Book(book)

    const { title, genre, isbn, publicationDate, numCopies, abstract } =
      req.body

    updatedBook.title = title ?? updatedBook.title
    updatedBook.genre = genre ?? updatedBook.genre
    updatedBook.isbn = isbn ?? updatedBook.isbn
    updatedBook.publicationDate = publicationDate ?? updatedBook.publicationDate
    updatedBook.numCopies = numCopies ?? updatedBook.numCopies
    updatedBook.abstract = abstract ?? updatedBook.abstract

    return res
      .status(201)
      .send(await getBookWithAuthor(await updatedBook.save()))
  } catch (error) {
    error.message = `Se ha producido un error al actualizar en la colección "${bookCollectionName}" el libro con el identificador "${id}":${
      validation.LINE_BREAK
    }${validation.formatErrorMsg(error.message)}`
    error.status = 500
    next(error)
  }
}

// Elimina un libro existente mediante su identificador
// Si un autor tiene relacionado el libro eliminado, se elimina de la lista de libros de su autor
// Se usa una sesión y una transacción para almacenar varias operaciones
const deleteBookById = async (req, res, next) => {
  const { id } = req.params
  // Inicio de la sesión
  const session = await mongoose.startSession()

  try {
    // Inicio de la transacción de la sesión
    session.startTransaction()

    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const book = await Book.findById(id)

    if (book == null) {
      throw new Error(getBookNotFoundByIdMsg(id))
    }

    const { User } = require('../models/user')

    if ((await User.find({ books: { $in: id } })).length > 0) {
      throw new Error(
        `El libro no se puede eliminar porque está siendo actualmente prestado a los usuarios en la colección "${User.collection.name}"`
      )
    }

    // Primero se elimina el libro
    await Book.deleteOne(book, { session })

    // Después se elimina el libro de la lista de libros de su autor
    const authors = await Author.find({ books: { $in: id } })
    const deletedBookFromAuthorMsg =
      authors.length > 0
        ? `${validation.LINE_BREAK}Se ha eliminado el libro con el identificador "${id}" de la lista de libros de su autor`
        : ''

    try {
      for (const author of authors) {
        author.books = author.books
          .map((id) => id.toJSON())
          .filter((bookId) => bookId !== id)

        // Se actualiza el autor
        await new Author(author).save({ session })
      }
    } catch (error) {
      throw new Error(
        `Se ha producido un error al eliminar el libro con el identificador "${id}" de la lista de libros de su autor:${validation.LINE_BREAK}${error.message}`
      )
    }

    // Commit de la transacción
    await session.commitTransaction()

    return res
      .status(200)
      .send(
        `Se ha eliminado en la colección "${bookCollectionName}" el libro con el identificador "${id}"${deletedBookFromAuthorMsg}`
      )
  } catch (error) {
    // Rollback de la transacción
    await session.abortTransaction()

    error.message = `Se ha producido un error al eliminar en la colección "${bookCollectionName}" el libro con el identificador "${id}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  } finally {
    // En cualquier caso, se finaliza la sesión
    session.endSession()
  }
}

const bookController = {
  getAllBooks,
  getBookById,
  getBooksByTitle,
  getBooksByGenre,
  getBooksByIsbn,
  getBooksByAuthorName,
  createBook,
  updateBookById,
  deleteBookById
}

module.exports = { bookController }
