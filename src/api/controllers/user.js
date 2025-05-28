/* Controladores de usuarios */

const mongoose = require('mongoose')
const { ROLES, User } = require('../models/user')
const userCollectionName = User.collection.name
const {
  BOOK_COLLECTION_NAME: bookCollectionName,
  validation
} = require('../../utils/validation')
// Permite cifrar contraseñas y verificar su autenticidad de forma segura
const bcrypt = require('bcrypt')

const getUserNotFoundByIdMsg = (id) => {
  return `No se ha encontrado ningún usuario en la colección "${userCollectionName}" con el identificador "${id}"`
}

// Devuelve los usuarios mediante el identificador de uno de sus libros prestados
// Validador
const getUsersByBookIdValidator = async (id) => {
  return await User.find({ books: { $in: id } })
}

// Devuelve el usuario que ha iniciado sesión
// Se pueblan los libros prestados con su título y ordenados alfabéticamente por título
const getUser = async (req, res, next) => {
  try {
    return res
      .status(200)
      .send(
        validation.getDocumentWithSortedBooks(
          await User.findOne(req.user).populate('books', 'title')
        )
      )
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${userCollectionName}" tu usuario:${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve todos los usuarios ordenados alfabéticamente por nombre de usuario
// Se pueblan los libros prestados con su título y ordenados alfabéticamente por título
const getAllUsers = async (req, res, next) => {
  try {
    const users = validation
      .getDocumentsWithSortedBooks(await User.find().populate('books', 'title'))
      .sort(validation.sortUsers)

    if (users.length > 0) {
      return res.status(200).send(users)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado usuarios en la colección "${userCollectionName}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar los usuarios en la colección "${userCollectionName}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve un usuario mediante su identificador
// Se pueblan los libros prestados con su título y ordenados alfabéticamente por título
const getUserById = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const user = validation.getDocumentWithSortedBooks(
      await User.findById(id).populate('books', 'title')
    )

    if (user != null) {
      return res.status(200).send(user)
    } else {
      return res.status(404).send(getUserNotFoundByIdMsg(id))
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${userCollectionName}" el usuario con el identificador "${id}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve los usuarios filtrados por nombre de usuario y ordenados alfabéticamente por nombre de usuario
// Se pueblan los libros prestados con su título y ordenados alfabéticamente por título
const getUsersByUserName = async (req, res, next) => {
  const userName = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.userName)
  )

  try {
    const users = validation
      .getDocumentsWithSortedBooks(
        await User.find({ userName }).populate('books', 'title')
      )
      .sort(validation.sortUsers)

    if (users.length > 0) {
      return res.status(200).send(users)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado usuarios en la colección "${userCollectionName}" cuyo nombre de usuario contenga "${validation.normalizeSearchString(
            userName
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${userCollectionName}" los usuarios cuyo nombre de usuario contenga "${validation.normalizeSearchString(
      userName
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve los usuarios filtrados por rol y ordenados alfabéticamente por nombre de usuario
// Se pueblan los libros prestados con su título y ordenados alfabéticamente por título
const getUsersByRole = async (req, res, next) => {
  const role = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.role)
  )

  try {
    const users = validation
      .getDocumentsWithSortedBooks(
        await User.find({ role }).populate('books', 'title')
      )
      .sort(validation.sortUsers)

    if (users.length > 0) {
      return res.status(200).send(users)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado usuarios en la colección "${userCollectionName}" cuyo rol contenga "${validation.normalizeSearchString(
            role
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${userCollectionName}" los usuarios cuyo rol contenga "${validation.normalizeSearchString(
      role
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve los usuarios filtrados por identificador de libro prestado y ordenados alfabéticamente por nombre de usuario
// Se pueblan los libros prestados con su título y ordenados alfabéticamente por título
const getUsersByBookId = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const users = validation.getDocumentsWithSortedBooks(
      await User.find({ books: { $in: id } }).populate('books', 'title')
    )

    if (users.length > 0) {
      return res.status(200).send(users)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado usuarios en la colección "${userCollectionName}" con el identificador "${id}" en alguno de sus libros prestados`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${userCollectionName}" los usuarios con el identificador "${id}" en alguno de sus libros prestados:${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve los usuarios filtrados por título de libro prestado y ordenados alfabéticamente por nombre de usuario
// Se pueblan los libros prestados con su título y ordenados alfabéticamente por título
const getUsersByBookTitle = async (req, res, next) => {
  const title = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.title)
  )

  try {
    const users = validation
      .getDocumentsWithSortedBooks(await User.find().populate('books', 'title'))
      .filter((user) =>
        user.books.some((book) =>
          title.test(validation.getIgnoreAccentCaseText(book.title))
        )
      )
      .sort(validation.sortUsers)

    if (users.length > 0) {
      return res.status(200).send(users)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado usuarios en la colección "${userCollectionName}" con algún libro prestado cuyo título contenga "${validation.normalizeSearchString(
            title
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${userCollectionName}" los usuarios con algún libro prestado cuyo título contenga "${validation.normalizeSearchString(
      title
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Realiza el inicio de sesión de un usuario
const loginUser = async (req, res, next) => {
  const INVALID_USER_PASSWORD_MSG = 'Usuario o contraseña incorrectos'

  let user

  try {
    if (req.body.userName == null) {
      throw new Error('Se debe introducir el usuario')
    }
    if (req.body.password == null) {
      throw new Error('Se debe introducir la contraseña')
    }

    // Es necesario leer el campo oculto de la contraseña
    user = await User.findOne({ userName: req.body.userName }).select(
      '+password'
    )
    if (user == null) {
      return res.status(400).send(INVALID_USER_PASSWORD_MSG)
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const { getJwtToken } = require('../../utils/token')

      return res.status(200).json(getJwtToken(user._id, user.userName))
    } else {
      return res.status(400).send(INVALID_USER_PASSWORD_MSG)
    }
  } catch (error) {
    error.message = `Se ha producido un error al realizar el inicio de sesión del usuario:${
      validation.LINE_BREAK
    }${validation.formatErrorMsg(error.message)}`
    error.status = 500
    next(error)
  }
}

// Crea un usuario nuevo
// Se pueblan los libros prestados con su título y ordenados alfabéticamente por título
const createUser = async (req, res, next) => {
  try {
    // Se valida aquí y no en el "validate" del modelo porque, si no, en el modelo se validaría el "hash" del cifrado de la contraseña, no la contraseña
    if (
      req.body.password != null &&
      !validation.isPassword(req.body.password)
    ) {
      throw new Error(validation.INVALID_PASSWORD_MSG)
    }

    if (req.body.role != null && req.body.role.trim() !== ROLES.user) {
      throw new Error(
        `Los usuarios sólo pueden ser creados con rol "${ROLES.user}"`
      )
    }

    // Cifrado de la contraseña
    // Se hace aquí y no en el "middleware" "pre save" para evitar que se cifre siempre aunque no se actualice
    if (req.body.password != null) {
      req.body.password = bcrypt.hashSync(req.body.password, 10)
    }

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
          await User.findById((await new User(req.body).save())._id).populate(
            'books',
            'title'
          )
        )
      )
  } catch (error) {
    error.message = `Se ha producido un error al crear el usuario en la colección "${userCollectionName}":${
      validation.LINE_BREAK
    }${validation.formatErrorMsg(error.message)}`
    error.status = 500
    next(error)
  }
}

// Actualiza el usuario que ha iniciado sesión
// Se pueblan los libros prestados con su título y ordenados alfabéticamente por título
const updateUser = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw new Error(
        'No se ha introducido ningún dato para actualizar tu usuario'
      )
    }

    // Se obtiene la información del usuario a actualizar (el usuario que ha iniciado sesión) y se sustituye por la introducida por el usuario
    // Es necesario leer el campo oculto de la contraseña
    let updatedUser = new User(await User.findOne(req.user).select('+password'))

    const { userName, password, email, role, books } = req.body

    // Se valida aquí y no en el "validate" del modelo porque, si no, en el modelo se validaría el "hash" del cifrado de la contraseña, no la contraseña
    if (password != null && !validation.isPassword(password)) {
      throw new Error(validation.INVALID_PASSWORD_MSG)
    }

    if ((role != null || books != null) && req.user.role === ROLES.user) {
      throw new Error(
        `El rol y los libros prestados sólo pueden ser actualizados por un usuario "${ROLES.admin}"`
      )
    }

    updatedUser.userName = userName ?? updatedUser.userName
    // Cifrado de la contraseña
    // Se hace aquí y no en el "middleware" "pre save" para evitar que se cifre siempre aunque no se actualice
    updatedUser.password =
      password != null ? bcrypt.hashSync(password, 10) : updatedUser.password
    updatedUser.email = email ?? updatedUser.email
    updatedUser.role = role ?? updatedUser.role

    // Se comprueba aquí y no en el "middleware" "pre validate" porque cualquier tratamiento omite el error de "cast" y toma por valor el array de libros prestados almacenado anteriormente en el usuario que ha iniciado sesión
    if (books != null) {
      updatedUser.books =
        books.length > 0 ? validation.normalizeArray(books) : []
    }

    // Sólo se permite la población de campos en funciones de búsqueda
    return res
      .status(201)
      .send(
        validation.getDocumentWithSortedBooks(
          await User.findById((await updatedUser.save())._id).populate(
            'books',
            'title'
          )
        )
      )
  } catch (error) {
    error.message = `Se ha producido un error al actualizar en la colección "${userCollectionName}" tu usuario:${
      validation.LINE_BREAK
    }${validation.formatErrorMsg(error.message)}`
    error.status = 500
    next(error)
  }
}

// Actualiza un usuario existente mediante su identificador
// Se pueblan los libros prestados con su título y ordenados alfabéticamente por título
const updateUserById = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    // Es necesario leer el campo oculto de la contraseña
    const user = await User.findById(id).select('+password')

    if (user == null) {
      throw new Error(getUserNotFoundByIdMsg(id))
    }

    if (Object.keys(req.body).length === 0) {
      throw new Error(
        `No se ha introducido ningún dato para actualizar el usuario con el identificador "${id}"`
      )
    }

    // Se obtiene la información del usuario a actualizar y se sustituye por la introducida por el usuario
    let updatedUser = new User(user)

    const { userName, password, email, role, books } = req.body

    // Se valida aquí y no en el "validate" del modelo porque, si no, en el modelo se validaría el "hash" del cifrado de la contraseña, no la contraseña
    if (password != null && !validation.isPassword(password)) {
      throw new Error(validation.INVALID_PASSWORD_MSG)
    }

    updatedUser.userName = userName ?? updatedUser.userName
    // Cifrado de la contraseña
    // Se hace aquí y no en el "middleware" "pre save" para evitar que se cifre siempre aunque no se actualice
    updatedUser.password =
      password != null ? bcrypt.hashSync(password, 10) : updatedUser.password
    updatedUser.email = email ?? updatedUser.email
    updatedUser.role = role ?? updatedUser.role

    // Se comprueba aquí y no en el "middleware" "pre validate" porque cualquier tratamiento omite el error de "cast" y toma por valor el array de libros prestados almacenado anteriormente en el usuario
    if (books != null) {
      updatedUser.books =
        books.length > 0 ? validation.normalizeArray(books) : []
    }

    // Sólo se permite la población de campos en funciones de búsqueda
    return res
      .status(201)
      .send(
        validation.getDocumentWithSortedBooks(
          await User.findById((await updatedUser.save())._id).populate(
            'books',
            'title'
          )
        )
      )
  } catch (error) {
    error.message = `Se ha producido un error al actualizar en la colección "${userCollectionName}" el usuario con el identificador "${id}":${
      validation.LINE_BREAK
    }${validation.formatErrorMsg(error.message)}`
    error.status = 500
    next(error)
  }
}

// Elimina el usuario que ha iniciado sesión
const deleteUser = async (req, res, next) => {
  try {
    if (req.user.userName === validation.ADMIN_USER_NAME) {
      throw new Error(
        `Tu usuario no se puede eliminar porque eres el usuario "${req.user.userName}" en la colección "${userCollectionName}"`
      )
    }

    if (req.user.books.length > 0) {
      throw new Error(
        `Tu usuario no se puede eliminar porque tienes libros actualmente prestados en la colección "${bookCollectionName}"`
      )
    }

    await User.deleteOne(req.user)

    return res
      .status(200)
      .send(
        `Se ha eliminado en la colección "${userCollectionName}" tu usuario`
      )
  } catch (error) {
    error.message = `Se ha producido un error al eliminar en la colección "${userCollectionName}" tu usuario:${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Elimina un usuario existente mediante su identificador
const deleteUserById = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const user = await User.findById(id)

    if (user == null) {
      throw new Error(getUserNotFoundByIdMsg(id))
    }

    if (user.userName === validation.ADMIN_USER_NAME) {
      throw new Error(
        `El usuario con el identificador "${id}" no se puede eliminar porque es el usuario "${user.userName}" en la colección "${userCollectionName}"`
      )
    }

    if (user.books.length > 0) {
      throw new Error(
        `El usuario con el identificador "${id}" no se puede eliminar porque tiene libros actualmente prestados en la colección "${bookCollectionName}"`
      )
    }

    await User.deleteOne(user)

    return res
      .status(200)
      .send(
        `Se ha eliminado en la colección "${userCollectionName}" el usuario con el identificador "${id}"`
      )
  } catch (error) {
    error.message = `Se ha producido un error al eliminar en la colección "${userCollectionName}" el usuario con el identificador "${id}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

const userController = {
  getUser,
  getAllUsers,
  getUserById,
  getUsersByUserName,
  getUsersByRole,
  getUsersByBookId,
  getUsersByBookTitle,
  loginUser,
  createUser,
  updateUser,
  updateUserById,
  deleteUser,
  deleteUserById
}

module.exports = { getUsersByBookIdValidator, userController }
