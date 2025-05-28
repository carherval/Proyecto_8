/* Rutas de usuarios */

// Enrutador para los "endpoints" de los usuarios
const userRouter = require('express').Router()
const { userController } = require('../controllers/user')
const { isAuthorizedUser } = require('../../middlewares/auth')
const { ROLES } = require('../models/user')

userRouter.get('/get/', isAuthorizedUser(), userController.getUser)
userRouter.get(
  '/get/all/',
  isAuthorizedUser(ROLES.admin),
  userController.getAllUsers
)
userRouter.get(
  '/get/id/:id',
  isAuthorizedUser(ROLES.admin),
  userController.getUserById
)
userRouter.get(
  '/get/userName/:userName',
  isAuthorizedUser(ROLES.admin),
  userController.getUsersByUserName
)
userRouter.get(
  '/get/role/:role',
  isAuthorizedUser(ROLES.admin),
  userController.getUsersByRole
)
userRouter.get(
  '/get/book-id/:id',
  isAuthorizedUser(ROLES.admin),
  userController.getUsersByBookId
)
userRouter.get(
  '/get/book-title/:title',
  isAuthorizedUser(ROLES.admin),
  userController.getUsersByBookTitle
)
userRouter.post('/login/', userController.loginUser)
userRouter.post(
  '/create/',
  isAuthorizedUser(ROLES.admin),
  userController.createUser
)
userRouter.put('/update/', isAuthorizedUser(), userController.updateUser)
userRouter.put(
  '/update/id/:id',
  isAuthorizedUser(ROLES.admin),
  userController.updateUserById
)
userRouter.delete('/delete/', isAuthorizedUser(), userController.deleteUser)
userRouter.delete(
  '/delete/id/:id',
  isAuthorizedUser(ROLES.admin),
  userController.deleteUserById
)

module.exports = { userRouter }
