/* Semilla de datos de libros y autores */

const mongoose = require('mongoose')
const { Book } = require('../api/models/book')
const bookCollectionName = Book.collection.name
const { Author } = require('../api/models/author')
const authorCollectionName = Author.collection.name
const { validation } = require('./validation')

// Crea los libros y los autores en ambas colecciones
const createData = async () => {
  // Permite cargar variables de entorno desde un archivo ".env"
  require('dotenv').config()
  const dbUrl = process.env.DB_URL
  const dbName = dbUrl.substring(dbUrl.lastIndexOf('/') + 1, dbUrl.indexOf('?'))

  try {
    console.log(
      `Se van a generar los datos en la colecciones "${bookCollectionName}" y "${authorCollectionName}"`
    )

    await mongoose.connect(dbUrl)
    console.log(
      `Conexión con la Base de Datos "${dbName}" realizada correctamente`
    )

    await Author.collection.drop()
    console.log(
      `Se han eliminado los datos antiguos en la colección "${authorCollectionName}"`
    )

    await Book.collection.drop()
    console.log(
      `Se han eliminado los datos antiguos en la colección "${bookCollectionName}"`
    )

    const { User } = require('../api/models/user')
    const userCollectionName = User.collection.name

    try {
      // Es necesario leer el campo oculto de la contraseña
      const users = await User.find().select('+password')

      for (const user of users) {
        user.books = []
        // Se actualiza el usuario
        await new User(user).save()
      }

      console.log(
        `Se han eliminado los libros prestados a los usuarios en la colección "${userCollectionName}"`
      )
    } catch (error) {
      throw new Error(
        `Se ha producido un error durante la eliminación de los libros prestados a los usuarios en la colección "${userCollectionName}":${validation.CONSOLE_LINE_BREAK}${error}`
      )
    }

    try {
      const { books } = require('../data/book')

      await Book.insertMany(books)
      console.log(
        `Se han creado los nuevos datos en la colección "${bookCollectionName}"`
      )
    } catch (error) {
      throw new Error(
        `Se ha producido un error durante la carga de los datos en la colección "${bookCollectionName}":${validation.CONSOLE_LINE_BREAK}${error}`
      )
    }

    try {
      const { authors } = require('../data/author')

      // Los datos de cada autor hacen referencia al título de sus libros
      // Se hace la búsqueda por título de cada libro y se asocia su identificador al autor
      for (const author of authors) {
        if (author.books.length > 0) {
          author.books = await Promise.all(
            validation.normalizeArray(author.books).map(async (title) => {
              const book = await Book.findOne({
                title: validation.normalizeString(title)
              })

              return book != null ? book._id : null
            })
          )

          // Se comprueba si algún libro no existe en la colección
          if (author.books.some((id) => id == null)) {
            throw new Error(
              validation.getBookDoesNotExistMsg(bookCollectionName)
            )
          }
        } else {
          author.books = []
        }
      }

      // Se eliminan los posibles duplicados del array de libros de cada autor y se concatenan en un mismo array
      const books = authors.reduce(
        (acc, author) => acc.concat(validation.removeDuplicates(author.books)),
        []
      )

      // Se comprueba si algún libro ya pertenece a otro autor (eliminando los posibles duplicados del array resultante anterior)
      // Al no existir ningún autor (ya que se insertan todos a la vez con "insertMany"), no se puede comprobar en la validación del modelo
      if (books.length !== validation.removeDuplicates(books).length) {
        throw new Error(
          validation.getBookWithAuthorMsg(
            authorCollectionName,
            validation.CONSOLE_LINE_BREAK
          )
        )
      }

      await Author.insertMany(authors)
      console.log(
        `Se han creado los nuevos datos en la colección "${authorCollectionName}"`
      )
    } catch (error) {
      throw new Error(
        `Se ha producido un error durante la carga de los datos en la colección "${authorCollectionName}":${validation.CONSOLE_LINE_BREAK}${error}`
      )
    }
  } catch (error) {
    console.log(
      `Se ha producido un error durante la carga de los datos:${validation.CONSOLE_LINE_BREAK}${error}`
    )
  } finally {
    await mongoose.disconnect()
    console.log(
      `Se ha realizado la desconexión con la Base de Datos "${dbName}"`
    )
  }
}

createData()
