/* Controladores de autores */

const mongoose = require('mongoose')
const { Author } = require('../models/author')
const authorCollectionName = Author.collection.name
const { validation } = require('../../utils/validation')

const getAuthorNotFoundByIdMsg = (id) => {
  return `No se ha encontrado ningún autor en la colección "${authorCollectionName}" con el identificador "${id}"`
}

// Devuelve un autor mediante el identificador de uno de sus libros
// Validador
const getAuthorByBookIdValidator = async (id) => {
  return await Author.findOne({ books: { $in: id } })
}

// Devuelve todos los autores ordenados alfabéticamente por apellidos y nombre
// Se pueblan los libros con su título y ordenados alfabéticamente por título
const getAllAuthors = async (req, res, next) => {
  try {
    const authors = validation
      .getDocumentsWithSortedBooks(
        await Author.find().populate('books', 'title')
      )
      .sort(validation.sortAuthors)

    if (authors.length > 0) {
      return res.status(200).send(authors)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado autores en la colección "${authorCollectionName}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar los autores en la colección "${authorCollectionName}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve un autor mediante su identificador
// Se pueblan los libros con su título y ordenados alfabéticamente por título
const getAuthorById = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const author = validation.getDocumentWithSortedBooks(
      await Author.findById(id).populate('books', 'title')
    )

    if (author != null) {
      return res.status(200).send(author)
    } else {
      return res.status(404).send(getAuthorNotFoundByIdMsg(id))
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${authorCollectionName}" el autor con el identificador "${id}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve los autores filtrados por apellidos o nombre y ordenados alfabéticamente por apellidos y nombre
// Se pueblan los libros con su título y ordenados alfabéticamente por título
const getAuthorsByName = async (req, res, next) => {
  const name = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.name)
  )

  try {
    const authors = validation
      .getDocumentsWithSortedBooks(
        await Author.find({ $or: [{ surnames: name }, { name }] }).populate(
          'books',
          'title'
        )
      )
      .sort(validation.sortAuthors)

    if (authors.length > 0) {
      return res.status(200).send(authors)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado autores en la colección "${authorCollectionName}" cuyos apellidos o nombre contengan "${validation.normalizeSearchString(
            name
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${authorCollectionName}" los autores cuyos apellidos o nombre contengan "${validation.normalizeSearchString(
      name
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve un autor mediante el identificador de uno de sus libros
// Se pueblan los libros con su título y ordenados alfabéticamente por título
const getAuthorByBookId = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const author = validation.getDocumentWithSortedBooks(
      await Author.findOne({ books: { $in: id } }).populate('books', 'title')
    )

    if (author != null) {
      return res.status(200).send(author)
    } else {
      return res
        .status(404)
        .send(
          `No se ha encontrado ningún autor en la colección "${authorCollectionName}" con el identificador "${id}" en alguno de sus libros`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${authorCollectionName}" el autor con el identificador "${id}" en alguno de sus libros:${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve los autores filtrados por título de libro y ordenados alfabéticamente por apellidos y nombre
// Se pueblan los libros con su título y ordenados alfabéticamente por título
const getAuthorsByBookTitle = async (req, res, next) => {
  const title = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.title)
  )

  try {
    const authors = validation
      .getDocumentsWithSortedBooks(
        await Author.find().populate('books', 'title')
      )
      .filter((author) =>
        author.books.some((book) =>
          title.test(validation.getIgnoreAccentCaseText(book.title))
        )
      )
      .sort(validation.sortAuthors)

    if (authors.length > 0) {
      return res.status(200).send(authors)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado autores en la colección "${authorCollectionName}" con algún libro cuyo título contenga "${validation.normalizeSearchString(
            title
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${authorCollectionName}" los autores con algún libro cuyo título contenga "${validation.normalizeSearchString(
      title
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Crea un autor nuevo
// Se pueblan los libros con su título y ordenados alfabéticamente por título
const createAuthor = async (req, res, next) => {
  try {
    // Se comprueba aquí y no en el "middleware" "pre validate" porque cualquier tratamiento omite el error de "cast" y toma por valor el array vacío
    if (req.body.books != null) {
      req.body.books =
        req.body.books.length > 0
          ? validation.normalizeArray(req.body.books)
          : []
    }

    // Sólo se permite la población de campos en funciones de búsqueda
    return res
      .status(201)
      .send(
        validation.getDocumentWithSortedBooks(
          await Author.findById(
            (
              await new Author(req.body).save()
            )._id
          ).populate('books', 'title')
        )
      )
  } catch (error) {
    error.message = `Se ha producido un error al crear el autor en la colección "${authorCollectionName}":${
      validation.LINE_BREAK
    }${validation.formatErrorMsg(error.message)}`
    error.status = 500
    next(error)
  }
}

// Actualiza un autor existente mediante su identificador
// Se pueblan los libros con su título y ordenados alfabéticamente por título
const updateAuthorById = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const author = await Author.findById(id)

    if (author == null) {
      throw new Error(getAuthorNotFoundByIdMsg(id))
    }

    if (Object.keys(req.body).length === 0) {
      throw new Error(
        `No se ha introducido ningún dato para actualizar el autor con el identificador "${id}"`
      )
    }

    // Se obtiene la información del autor a actualizar y se sustituye por la introducida por el usuario
    let updatedAuthor = new Author(author)

    const { surnames, name, birthYear, books } = req.body

    updatedAuthor.surnames = surnames ?? updatedAuthor.surnames
    updatedAuthor.name = name ?? updatedAuthor.name
    updatedAuthor.birthYear = birthYear ?? updatedAuthor.birthYear

    // Se comprueba aquí y no en el "middleware" "pre validate" porque cualquier tratamiento omite el error de "cast" y toma por valor el array de libros almacenado anteriormente en el autor
    if (books != null) {
      updatedAuthor.books =
        books.length > 0 ? validation.normalizeArray(books) : []
    }

    // Sólo se permite la población de campos en funciones de búsqueda
    return res
      .status(201)
      .send(
        validation.getDocumentWithSortedBooks(
          await Author.findById((await updatedAuthor.save())._id).populate(
            'books',
            'title'
          )
        )
      )
  } catch (error) {
    error.message = `Se ha producido un error al actualizar en la colección "${authorCollectionName}" el autor con el identificador "${id}":${
      validation.LINE_BREAK
    }${validation.formatErrorMsg(error.message)}`
    error.status = 500
    next(error)
  }
}

// Elimina un autor existente mediante su identificador
const deleteAuthorById = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const author = await Author.findById(id)

    if (author == null) {
      throw new Error(getAuthorNotFoundByIdMsg(id))
    }

    await Author.deleteOne(author)

    return res
      .status(200)
      .send(
        `Se ha eliminado en la colección "${authorCollectionName}" el autor con el identificador "${id}"`
      )
  } catch (error) {
    error.message = `Se ha producido un error al eliminar en la colección "${authorCollectionName}" el autor con el identificador "${id}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

const authorController = {
  getAllAuthors,
  getAuthorById,
  getAuthorsByName,
  getAuthorByBookId,
  getAuthorsByBookTitle,
  createAuthor,
  updateAuthorById,
  deleteAuthorById
}

module.exports = { getAuthorByBookIdValidator, authorController }
