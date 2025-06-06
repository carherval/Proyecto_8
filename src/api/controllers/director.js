/* Controladores de directores */

const mongoose = require('mongoose')
const { Director } = require('../models/director')
const directorCollectionName = Director.collection.name
const { validation } = require('../../utils/validation')

const getDirectorNotFoundByIdMsg = (id) => {
  return `No se ha encontrado ningún director en la colección "${directorCollectionName}" con el identificador "${id}"`
}

// Devuelve un director mediante el identificador de una de sus películas
// Validador
const getDirectorByMovieIdValidator = async (id) => {
  return await Director.findOne({ movies: { $in: id } })
}

// Devuelve todos los directores ordenados alfabéticamente por apellidos y nombre
// Se pueblan las películas con su título y ordenadas alfabéticamente por título
const getAllDirectors = async (req, res, next) => {
  try {
    const directors = validation
      .getDocumentsWithSortedMovies(
        await Director.find().populate('movies', 'title')
      )
      .sort(validation.sortDirectors)

    if (directors.length > 0) {
      return res.status(200).send(directors)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado directores en la colección "${directorCollectionName}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar los directores en la colección "${directorCollectionName}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve un director mediante su identificador
// Se pueblan las películas con su título y ordenadas alfabéticamente por título
const getDirectorById = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const director = validation.getDocumentWithSortedMovies(
      await Director.findById(id).populate('movies', 'title')
    )

    if (director != null) {
      return res.status(200).send(director)
    } else {
      return res.status(404).send(getDirectorNotFoundByIdMsg(id))
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${directorCollectionName}" el director con el identificador "${id}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve los directores filtrados por apellidos o nombre y ordenados alfabéticamente por apellidos y nombre
// Se pueblan las películas con su título y ordenadas alfabéticamente por título
const getDirectorsByName = async (req, res, next) => {
  const name = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.name)
  )

  try {
    const directors = validation
      .getDocumentsWithSortedMovies(
        await Director.find({ $or: [{ surnames: name }, { name }] }).populate(
          'movies',
          'title'
        )
      )
      .sort(validation.sortDirectors)

    if (directors.length > 0) {
      return res.status(200).send(directors)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado directores en la colección "${directorCollectionName}" cuyos apellidos o nombre contengan "${validation.normalizeSearchString(
            name
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${directorCollectionName}" los directores cuyos apellidos o nombre contengan "${validation.normalizeSearchString(
      name
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve un director mediante el identificador de una de sus películas
// Se pueblan las películas con su título y ordenadas alfabéticamente por título
const getDirectorByMovieId = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const director = validation.getDocumentWithSortedMovies(
      await Director.findOne({ movies: { $in: id } }).populate(
        'movies',
        'title'
      )
    )

    if (director != null) {
      return res.status(200).send(director)
    } else {
      return res
        .status(404)
        .send(
          `No se ha encontrado ningún director en la colección "${directorCollectionName}" con el identificador "${id}" en alguna de sus películas`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${directorCollectionName}" el director con el identificador "${id}" en alguna de sus películas:${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve los directores filtrados por título de película y ordenados alfabéticamente por apellidos y nombre
// Se pueblan las películas con su título y ordenadas alfabéticamente por título
const getDirectorsByMovieTitle = async (req, res, next) => {
  const title = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.title)
  )

  try {
    const directors = validation
      .getDocumentsWithSortedMovies(
        await Director.find().populate('movies', 'title')
      )
      .filter((director) =>
        director.movies.some((movie) =>
          title.test(validation.getIgnoreAccentCaseText(movie.title))
        )
      )
      .sort(validation.sortDirectors)

    if (directors.length > 0) {
      return res.status(200).send(directors)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado directores en la colección "${directorCollectionName}" con alguna película cuyo título contenga "${validation.normalizeSearchString(
            title
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${directorCollectionName}" los directores con alguna película cuyo título contenga "${validation.normalizeSearchString(
      title
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Crea un director nuevo
// Se pueblan las películas con su título y ordenadas alfabéticamente por título
const createDirector = async (req, res, next) => {
  try {
    // Se comprueba aquí y no en el "middleware" "pre validate" porque cualquier tratamiento omite el error de "cast" y toma por valor el array vacío
    if (req.body.movies != null) {
      req.body.movies =
        req.body.movies.length > 0
          ? validation.normalizeArray(req.body.movies)
          : []
    }

    // Sólo se permite la población de campos en funciones de búsqueda
    return res
      .status(201)
      .send(
        validation.getDocumentWithSortedMovies(
          await Director.findById(
            (
              await new Director(req.body).save()
            )._id
          ).populate('movies', 'title')
        )
      )
  } catch (error) {
    error.message = `Se ha producido un error al crear el director en la colección "${directorCollectionName}":${
      validation.LINE_BREAK
    }${validation.formatErrorMsg(error.message)}`
    error.status = 500
    next(error)
  }
}

// Actualiza un director existente mediante su identificador
// Se pueblan las películas con su título y ordenadas alfabéticamente por título
const updateDirectorById = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const director = await Director.findById(id)

    if (director == null) {
      throw new Error(getDirectorNotFoundByIdMsg(id))
    }

    if (Object.keys(req.body).length === 0) {
      throw new Error(
        `No se ha introducido ningún dato para actualizar el director con el identificador "${id}"`
      )
    }

    // Se obtiene la información del director a actualizar y se sustituye por la introducida por el usuario
    let updatedDirector = new Director(director)

    const { surnames, name, birthYear, movies } = req.body

    updatedDirector.surnames = surnames ?? updatedDirector.surnames
    updatedDirector.name = name ?? updatedDirector.name
    updatedDirector.birthYear = birthYear ?? updatedDirector.birthYear

    // Se comprueba aquí y no en el "middleware" "pre validate" porque cualquier tratamiento omite el error de "cast" y toma por valor el array de películas almacenado anteriormente en el director
    if (movies != null) {
      updatedDirector.movies =
        movies.length > 0 ? validation.normalizeArray(movies) : []
    }

    // Sólo se permite la población de campos en funciones de búsqueda
    return res
      .status(201)
      .send(
        validation.getDocumentWithSortedMovies(
          await Director.findById((await updatedDirector.save())._id).populate(
            'movies',
            'title'
          )
        )
      )
  } catch (error) {
    error.message = `Se ha producido un error al actualizar en la colección "${directorCollectionName}" el director con el identificador "${id}":${
      validation.LINE_BREAK
    }${validation.formatErrorMsg(error.message)}`
    error.status = 500
    next(error)
  }
}

// Elimina un director existente mediante su identificador
const deleteDirectorById = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const director = await Director.findById(id)

    if (director == null) {
      throw new Error(getDirectorNotFoundByIdMsg(id))
    }

    await Director.deleteOne(director)

    return res
      .status(200)
      .send(
        `Se ha eliminado en la colección "${directorCollectionName}" el director con el identificador "${id}"`
      )
  } catch (error) {
    error.message = `Se ha producido un error al eliminar en la colección "${directorCollectionName}" el director con el identificador "${id}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

const directorController = {
  getAllDirectors,
  getDirectorById,
  getDirectorsByName,
  getDirectorByMovieId,
  getDirectorsByMovieTitle,
  createDirector,
  updateDirectorById,
  deleteDirectorById
}

module.exports = { getDirectorByMovieIdValidator, directorController }
