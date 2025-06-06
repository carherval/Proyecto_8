/* Semilla de datos de películas y directores */

const mongoose = require('mongoose')
const { Movie } = require('../api/models/movie')
const movieCollectionName = Movie.collection.name
const { Director } = require('../api/models/director')
const directorCollectionName = Director.collection.name
const { validation } = require('./validation')

// Crea las películas y los directores en ambas colecciones
const createData = async () => {
  // Permite cargar variables de entorno desde un archivo ".env"
  require('dotenv').config()
  const dbUrl = process.env.DB_URL
  const dbName = dbUrl.substring(dbUrl.lastIndexOf('/') + 1, dbUrl.indexOf('?'))

  try {
    console.log(
      `Se van a generar los datos en la colecciones "${movieCollectionName}" y "${directorCollectionName}"`
    )

    await mongoose.connect(dbUrl)
    console.log(
      `Conexión con la Base de Datos "${dbName}" realizada correctamente`
    )

    await Director.collection.drop()
    console.log(
      `Se han eliminado los datos antiguos en la colección "${directorCollectionName}"`
    )

    await Movie.collection.drop()
    console.log(
      `Se han eliminado los datos antiguos en la colección "${movieCollectionName}"`
    )

    const { User } = require('../api/models/user')
    const userCollectionName = User.collection.name

    try {
      // Es necesario leer el campo oculto de la contraseña
      const users = await User.find().select('+password')

      for (const user of users) {
        if (user.movies.length > 0) {
          user.movies = []
          // Se actualiza el usuario
          await new User(user).save()
        }
      }

      console.log(
        `Se han eliminado las películas prestadas a los usuarios en la colección "${userCollectionName}"`
      )
    } catch (error) {
      throw new Error(
        `Se ha producido un error durante la eliminación de las películas prestadas a los usuarios en la colección "${userCollectionName}":${validation.CONSOLE_LINE_BREAK}${error}`
      )
    }

    try {
      const { movies } = require('../data/movie')

      await Movie.insertMany(movies)
      console.log(
        `Se han creado los nuevos datos en la colección "${movieCollectionName}"`
      )
    } catch (error) {
      throw new Error(
        `Se ha producido un error durante la carga de los datos en la colección "${movieCollectionName}":${validation.CONSOLE_LINE_BREAK}${error}`
      )
    }

    try {
      const { directors } = require('../data/director')

      // Los datos de cada director hacen referencia al título de sus películas
      // Se hace la búsqueda por título de cada película y se asocia su identificador al director
      for (const director of directors) {
        if (director.movies.length > 0) {
          director.movies = await Promise.all(
            validation.normalizeArray(director.movies).map(async (title) => {
              const movie = await Movie.findOne({
                title: validation.normalizeString(title)
              })

              return movie != null ? movie._id : null
            })
          )

          // Se comprueba si alguna película no existe en la colección
          if (director.movies.some((id) => id == null)) {
            throw new Error(
              validation.getMovieDoesNotExistMsg(movieCollectionName)
            )
          }
        } else {
          director.movies = []
        }
      }

      // Se eliminan los posibles duplicados del array de películas de cada director y se concatenan en un mismo array
      const movies = directors.reduce(
        (acc, director) =>
          acc.concat(validation.removeDuplicates(director.movies)),
        []
      )

      // Se comprueba si alguna película ya pertenece a otro director (eliminando los posibles duplicados del array resultante anterior)
      // Al no existir ningún director (ya que se insertan todos a la vez con "insertMany"), no se puede comprobar en la validación del modelo
      if (movies.length !== validation.removeDuplicates(movies).length) {
        throw new Error(
          validation.getMovieWithDirectorMsg(
            directorCollectionName,
            validation.CONSOLE_LINE_BREAK
          )
        )
      }

      await Director.insertMany(directors)
      console.log(
        `Se han creado los nuevos datos en la colección "${directorCollectionName}"`
      )
    } catch (error) {
      throw new Error(
        `Se ha producido un error durante la carga de los datos en la colección "${directorCollectionName}":${validation.CONSOLE_LINE_BREAK}${error}`
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
