const PORT = 3000

const express = require('express')
const library = express()
const { bookRouter } = require('./src/api/routes/book')
const { authorRouter } = require('./src/api/routes/author')
const { userRouter } = require('./src/api/routes/user')
const { validation } = require('./src/utils/validation')
const { connectToDataBase } = require('./src/config/db')

// Permite interpretar las solicitudes HTTP en formato JSON
library.use(express.json())
// Permite interpretar las solicitudes HTTP a través del "req.body" de las rutas
library.use(express.urlencoded({ extended: false }))

// Se definen las rutas de las colecciones
library.use('/book', bookRouter)
library.use('/author', authorRouter)
library.use('/user', userRouter)

// Gestión de ruta no encontrada
library.use((req, res, next) => {
  const error = new Error(
    `Ruta no encontrada${validation.LINE_BREAK}Comprueba la URL y sus parámetros`
  )

  error.status = 404

  next(error)
})

// Gestión de errores
library.use((error, req, res, next) => {
  console.log(
    `Error ${error.status}: ${error.message.replaceAll(
      validation.LINE_BREAK,
      validation.CONSOLE_LINE_BREAK
    )}`
  )

  return res.status(error.status).send(error.message)
})

library.listen(PORT, () => {
  console.log(`Servidor express ejecutándose en "http://localhost:${PORT}"`)
  connectToDataBase()
})
