# Library

**_Library_** es una Base de Datos sencilla que implementa un **CRUD** completo sobre tres colecciones de datos relacionadas, la de libros (**_book_**), la de autores (**_author_**) y la de usuarios (**_user_**).

Se recomienda el uso de alguna aplicación que permita probar la **API** de la aplicación mediante el envío de peticiones **HTTP** y la recepción de sus correspondientes respuestas, como puede ser [Insomnia].

## Colección _book_

A continuación se detallan los datos que almacena un libro de la colección **_book_**:

| CAMPO                 | DESCRIPCIÓN                     | TIPO        | OBLIGATORIO | ÚNICO | VALOR                                                                                                                                                                  |
| --------------------- | ------------------------------- | ----------- | ----------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **\__id_**            | Identificador del libro         | Hexadecimal | Sí          | Sí    | **Automático**                                                                                                                                                         |
| **_title_**           | Título del libro                | Texto       | Sí          | Sí    | Texto libre                                                                                                                                                            |
| **_genre_**           | Género del libro                | Texto       | Sí          | No    | _Biografía, Ciencia ficción, Ensayo, Fantasía, Histórico, Informativo, Literatura infantil y juvenil, Misterio y suspense, Narrativa, Poesía, Romance, Teatro, Terror_ |
| **_isbn_**            | ISBN del libro                  | Texto       | Sí          | Sí    | ISBN válido                                                                                                                                                            |
| **_publicationDate_** | Fecha de publicación del libro  | Texto       | Sí          | No    | Fecha válida (año a partir de 1500) en formato _DD/MM/AAAA_                                                                                                            |
| **_numCopies_**       | Número de copias del libro      | Número      | Sí          | No    | Entre 0 y 5                                                                                                                                                            |
| **_abstract_**        | Resumen del libro               | Texto       | No          | No    | Texto libre                                                                                                                                                            |
| **_author_**          | Autor del libro                 | Texto       | No          | No    | **Automático**                                                                                                                                                         |
| **_\_\_v_**           | Versión del libro               | Número      | No          | No    | **Automático** (se incrementa con cada modificación del libro)                                                                                                         |
| **_createdAt_**       | Fecha de creación del libro     | Fecha       | No          | No    | **Automático** (fecha en formato _DD/MM/AAAA HH:MM:SS_)                                                                                                                |
| **_updatedAt_**       | Fecha de modificación del libro | Fecha       | No          | No    | **Automático** (fecha en formato _DD/MM/AAAA HH:MM:SS_)                                                                                                                |

## Colección _author_

A continuación se detallan los datos que almacena un autor de la colección **_author_**:

| CAMPO           | DESCRIPCIÓN                     | TIPO        | OBLIGATORIO | ÚNICO                         | VALOR                                                                        |
| --------------- | ------------------------------- | ----------- | ----------- | ----------------------------- | ---------------------------------------------------------------------------- |
| **\__id_**      | Identificador del autor         | Hexadecimal | Sí          | Sí                            | **Automático**                                                               |
| **_surnames_**  | Apellidos del autor             | Texto       | Sí          | Sí (junto con **_name_**)     | Texto libre                                                                  |
| **_name_**      | Nombre del autor                | Texto       | Sí          | Sí (junto con **_surnames_**) | Texto libre                                                                  |
| **_birthYear_** | Año de nacimiento del autor     | Texto       | Sí          | No                            | Año válido (a partir de 1500) en formato _AAAA_                              |
| **_books_**     | Libros del autor                | Lista       | No          | Sí                            | Identificadores válidos de libros (colección **_book_**) separados por comas |
| **_\_\_v_**     | Versión del autor               | Número      | No          | No                            | **Automático** (se incrementa con cada modificación del autor)               |
| **_createdAt_** | Fecha de creación del autor     | Fecha       | No          | No                            | **Automático** (fecha en formato _DD/MM/AAAA HH:MM:SS_)                      |
| **_updatedAt_** | Fecha de modificación del autor | Fecha       | No          | No                            | **Automático** (fecha en formato _DD/MM/AAAA HH:MM:SS_)                      |

## Colección _user_

A continuación se detallan los datos que almacena un usuario de la colección **_user_**:

| CAMPO           | DESCRIPCIÓN                               | TIPO        | OBLIGATORIO | ÚNICO | VALOR                                                                        |
| --------------- | ----------------------------------------- | ----------- | ----------- | ----- | ---------------------------------------------------------------------------- |
| **\__id_**      | Identificador del usuario                 | Hexadecimal | Sí          | Sí    | **Automático**                                                               |
| **_userName_**  | Nombre de usuario del usuario             | Texto       | Sí          | Sí    | Texto libre                                                                  |
| **_password_**  | Contraseña del usuario (**campo oculto**) | Texto       | Sí          | No    | Contraseña válida                                                            |
| **_email_**     | Correo electrónico del usuario            | Texto       | Sí          | Sí    | Correo electrónico válido                                                    |
| **_role_**      | Rol del usuario                           | Texto       | Sí          | No    | _user, admin_                                                                |
| **_books_**     | Libros prestados al usuario               | Lista       | No          | No    | Identificadores válidos de libros (colección **_book_**) separados por comas |
| **_\_\_v_**     | Versión del usuario                       | Número      | No          | No    | **Automático** (se incrementa con cada modificación del usuario)             |
| **_createdAt_** | Fecha de creación del usuario             | Fecha       | No          | No    | **Automático** (fecha en formato _DD/MM/AAAA HH:MM:SS_)                      |
| **_updatedAt_** | Fecha de modificación del usuario         | Fecha       | No          | No    | **Automático** (fecha en formato _DD/MM/AAAA HH:MM:SS_)                      |

## Instalación y ejecución de la aplicación

Una vez descargada la aplicación del repositorio de [GitHub] se debe ir al directorio raíz (**_Proyecto_7_**) y ejecutar el siguiente comando de **Node.js**:

```sh
npm run dev
```

Si se desea, se puede ejecutar **previamente** una carga inicial de datos en las colecciones **_book_** y **_author_** mediante el siguiente comando de **Node.js**:

```sh
npm run createData
```

**`IMPORTANTE:`** `la carga inicial elimina todos los datos almacenados previamente en las colecciones` **_`book`_** `y` **_`author`_** `y elimina los libros prestados a los usuarios en la colección` **_`user`_**

**`USUARIO INICIAL ADMIN:`** `usuario:` **_`admin`_** ` y contraseña:` **_`adminadmin`_**

## Endpoints de la colección _book_

A continuación se detallan las peticiones **HTTP** de la **API** de la colección **_book_** y sus posibles respuestas:

| MÉTODO | URL                                         | DESCRIPCIÓN                  | LOGIN       | PARÁMETROS                             | CUERPO DE LA PETICIÓN                         | CÓDIGO DE RESPUESTA | RESPUESTA                                                                         |
| ------ | ------------------------------------------- | ---------------------------- | ----------- | -------------------------------------- | --------------------------------------------- | ------------------- | --------------------------------------------------------------------------------- |
| GET    | http://localhost:3000/book/get/all/         | Búsqueda de todos los libros | NO          |                                        |                                               | 200                 | Lista de todos los libros ordenados por título                                    |
| GET    | http://localhost:3000/book/get/id/          | Búsqueda de un libro         | NO          | Identificador del libro                |                                               | 200                 | Libro                                                                             |
| GET    | http://localhost:3000/book/get/title/       | Búsqueda filtrada            | NO          | Título del libro                       |                                               | 200                 | Lista de libros filtrados por título y ordenados por título                       |
| GET    | http://localhost:3000/book/get/genre/       | Búsqueda filtrada            | NO          | Género del libro                       |                                               | 200                 | Lista de libros filtrados por género y ordenados por título                       |
| GET    | http://localhost:3000/book/get/isbn/        | Búsqueda filtrada            | NO          | ISBN del libro                         |                                               | 200                 | Lista de libros filtrados por ISBN y ordenados por título                         |
| GET    | http://localhost:3000/book/get/author-name/ | Búsqueda filtrada            | NO          | Apellidos o nombre del autor del libro |                                               | 200                 | Lista de libros filtrados por apellidos o nombre del autor y ordenados por título |
| POST   | http://localhost:3000/book/create/          | Creación de un libro         | **_admin_** |                                        | **JSON** con los campos del libro a crear     | 201                 | Libro creado                                                                      |
| PUT    | http://localhost:3000/book/update/id/       | Modificación de un libro     | **_admin_** | Identificador del libro                | **JSON** con los campos a modificar del libro | 201                 | Libro modificado                                                                  |
| DEL    | http://localhost:3000/book/delete/id/       | Eliminación de un libro      | **_admin_** | Identificador del libro                |                                               | 200                 | Mensaje de confirmación de eliminación del libro                                  |

- El código de respuesta también puede ser **401** cuando se intenta acceder a un método sin estar autorizado
- El código de respuesta también puede ser **404** cuando no se encuentran resultados de búsqueda (métodos **GET**)
- El código de respuesta también puede ser **500** cuando se produce un error interno del servidor al procesar la petición (por ejemplo, durante la validación de los campos del **JSON** en los métodos **POST** y **PUT**)

> La información devuelta de un libro también incluye los **apellidos** y el **nombre** de su autor

> Los métodos **POST** y **PUT** requieren en la petición un cuerpo en formato **JSON** con la información necesaria de los campos:

```sh
{"campo1":"valor1",...,"campoN":"valorN"}
```

**`IMPORTANTE:`** `un error de` **_`cast`_** `(conversión) se produce cuando el campo` **_`numCopies`_** `no es numérico`

**`IMPORTANTE:`** `el número de copias de un libro no puede ser inferior al número de copias prestadas a los usuarios`

**`IMPORTANTE:`** `cuando se elimina un libro, también se elimina de la lista de libros de su autor`

**`IMPORTANTE:`** `no se puede eliminar un libro que está siendo prestado a un usuario`

## Endpoints de la colección _author_

A continuación se detallan las peticiones **HTTP** de la **API** de la colección **_author_** y sus posibles respuestas:

| MÉTODO | URL                                          | DESCRIPCIÓN                   | LOGIN       | PARÁMETROS                        | CUERPO DE LA PETICIÓN                         | CÓDIGO DE RESPUESTA | RESPUESTA                                                                            |
| ------ | -------------------------------------------- | ----------------------------- | ----------- | --------------------------------- | --------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------ |
| GET    | http://localhost:3000/author/get/all/        | Búsqueda de todos los autores | NO          |                                   |                                               | 200                 | Lista de todos los autores ordenados por apellidos y nombre                          |
| GET    | http://localhost:3000/author/get/id/         | Búsqueda de un autor          | NO          | Identificador del autor           |                                               | 200                 | Autor                                                                                |
| GET    | http://localhost:3000/author/get/name/       | Búsqueda filtrada             | NO          | Apellidos o nombre del autor      |                                               | 200                 | Lista de autores filtrados por apellidos o nombre y ordenados por apellidos y nombre |
| GET    | http://localhost:3000/author/get/book-id/    | Búsqueda de un autor          | NO          | Identificador del libro del autor |                                               | 200                 | Autor                                                                                |
| GET    | http://localhost:3000/author/get/book-title/ | Búsqueda filtrada             | NO          | Título del libro del autor        |                                               | 200                 | Lista de autores filtrados por título del libro y ordenados por apellidos y nombre   |
| POST   | http://localhost:3000/author/create/         | Creación de un autor          | **_admin_** |                                   | **JSON** con los campos del autor a crear     | 201                 | Autor creado                                                                         |
| PUT    | http://localhost:3000/author/update/id/      | Modificación de un autor      | **_admin_** | Identificador del autor           | **JSON** con los campos a modificar del autor | 201                 | Autor modificado                                                                     |
| DEL    | http://localhost:3000/author/delete/id/      | Eliminación de un autor       | **_admin_** | Identificador del autor           |                                               | 200                 | Mensaje de confirmación de eliminación del autor                                     |

- El código de respuesta también puede ser **401** cuando se intenta acceder a un método sin estar autorizado
- El código de respuesta también puede ser **404** cuando no se encuentran resultados de búsqueda (métodos **GET**)
- El código de respuesta también puede ser **500** cuando se produce un error interno del servidor al procesar la petición (por ejemplo, durante la validación de los campos del **JSON** en los métodos **POST** y **PUT**)

> La información devuelta de un autor se puebla con el **identificador** y el **título** de sus libros ordenados por título

> Los métodos **POST** y **PUT** requieren en la petición un cuerpo en formato **JSON** con la información necesaria de los campos:

```sh
{"campo1":"valor1",...,"campoN":"valorN"}
```

**`IMPORTANTE:`** `un error de` **_`cast`_** `(conversión) se produce cuando el campo` **_`books`_** `no contiene identificadores válidos de libros`

**`IMPORTANTE:`** `cuando se relaciona un autor con un libro, éste debe existir en la colección` **_`book`_** `y no pertenecer a otro autor`

## Endpoints de la colección _user_

A continuación se detallan las peticiones **HTTP** de la **API** de la colección **_user_** y sus posibles respuestas:

| MÉTODO | URL                                        | DESCRIPCIÓN                                     | LOGIN             | PARÁMETROS                                  | CUERPO DE LA PETICIÓN                                                          | CÓDIGO DE RESPUESTA | RESPUESTA                                                                                          |
| ------ | ------------------------------------------ | ----------------------------------------------- | ----------------- | ------------------------------------------- | ------------------------------------------------------------------------------ | ------------------- | -------------------------------------------------------------------------------------------------- |
| GET    | http://localhost:3000/user/get/            | Búsqueda del usuario que ha iniciado sesión     | **_user, admin_** |                                             |                                                                                | 200                 | Usuario que ha iniciado sesión                                                                     |
| GET    | http://localhost:3000/user/get/all/        | Búsqueda de todos los usuarios                  | **_admin_**       |                                             |                                                                                | 200                 | Lista de todos los usuarios ordenados por nombre de usuario                                        |
| GET    | http://localhost:3000/user/get/id/         | Búsqueda de un usuario                          | **_admin_**       | Identificador del usuario                   |                                                                                | 200                 | Usuario                                                                                            |
| GET    | http://localhost:3000/user/get/userName/   | Búsqueda filtrada                               | **_admin_**       | Nombre de usuario del usuario               |                                                                                | 200                 | Lista de usuarios filtrados por nombre de usuario y ordenados por nombre de usuario                |
| GET    | http://localhost:3000/user/get/role/       | Búsqueda filtrada                               | **_admin_**       | Rol del usuario                             |                                                                                | 200                 | Lista de usuarios filtrados por rol y ordenados por nombre de usuario                              |
| GET    | http://localhost:3000/user/get/book-id/    | Búsqueda filtrada                               | **_admin_**       | Identificador del libro prestado al usuario |                                                                                | 200                 | Lista de usuarios filtrados por identificador del libro prestado y ordenados por nombre de usuario |
| GET    | http://localhost:3000/user/get/book-title/ | Búsqueda filtrada                               | **_admin_**       | Título del libro prestado al usuario        |                                                                                | 200                 | Lista de usuarios filtrados por título del libro prestado y ordenados por nombre de usuario        |
| POST   | http://localhost:3000/user/login/          | Inicio de sesión de un usuario                  | NO                |                                             | **JSON** con el nombre de usuario y la contraseña del usuario a iniciar sesión | 200                 | Token de autorización generado                                                                     |
| POST   | http://localhost:3000/user/create/         | Creación de un usuario                          | **_admin_**       |                                             | **JSON** con los campos del usuario a crear                                    | 201                 | Usuario creado                                                                                     |
| PUT    | http://localhost:3000/user/update/         | Modificación del usuario que ha iniciado sesión | **_user, admin_** |                                             | **JSON** con los campos a modificar del usuario que ha iniciado sesión         | 201                 | Usuario que ha iniciado sesión modificado                                                          |
| PUT    | http://localhost:3000/user/update/id/      | Modificación de un usuario                      | **_admin_**       | Identificador del usuario                   | **JSON** con los campos a modificar del usuario                                | 201                 | Usuario modificado                                                                                 |
| DEL    | http://localhost:3000/user/delete/         | Eliminación del usuario que ha iniciado sesión  | **_user, admin_** |                                             |                                                                                | 200                 | Mensaje de confirmación de eliminación del usuario que ha iniciado sesión                          |
| DEL    | http://localhost:3000/user/delete/id/      | Eliminación de un usuario                       | **_admin_**       | Identificador del usuario                   |                                                                                | 200                 | Mensaje de confirmación de eliminación del usuario                                                 |

- El código de respuesta también puede ser **400** cuando no se consigue realizar el inicio de sesión
- El código de respuesta también puede ser **401** cuando se intenta acceder a un método sin estar autorizado
- El código de respuesta también puede ser **404** cuando no se encuentran resultados de búsqueda (métodos **GET**)
- El código de respuesta también puede ser **500** cuando se produce un error interno del servidor al procesar la petición (por ejemplo, durante la validación de los campos del **JSON** en los métodos **POST** y **PUT**)

> La información devuelta de un usuario se puebla con el **identificador** y el **título** de sus libros prestados ordenados por título

> Los métodos **POST** y **PUT** requieren en la petición un cuerpo en formato **JSON** con la información necesaria de los campos:

```sh
{"campo1":"valor1",...,"campoN":"valorN"}
```

**`IMPORTANTE:`** `un error de` **_`cast`_** `(conversión) se produce cuando el campo` **_`books`_** `no contiene identificadores válidos de libros prestados`

**`IMPORTANTE:`** `cuando se relaciona un usuario con un libro, éste debe existir en la colección` **_`book`_** `y que tenga copias disponibles para prestar (sólo se presta una copia del mismo libro a un usuario)`

**`IMPORTANTE:`** `un usuario sólo puede ser creado con rol` **_`user`_**

**`IMPORTANTE:`** `se puede crear un usuario con libros prestados inicialmente`

**`IMPORTANTE:`** `el rol y los libros prestados sólo pueden ser modificados por un usuario con rol` **_`admin`_**

**`IMPORTANTE:`** `no se puede eliminar un usuario que tiene libros prestados`

**`IMPORTANTE:`** `un usuario se puede eliminar a sí mismo`

**`IMPORTANTE:`** `ya existe el usuario inicial` **_`admin`_** `que no puede ser eliminado de la colección` **_`user`_**

[//]: # 'Lista de enlaces:'
[Insomnia]: https://insomnia.rest/
[GitHub]: https://github.com/carherval/Proyecto_7
