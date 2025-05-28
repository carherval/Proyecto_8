/* Datos para la semilla de autores */

const { books } = require('./book')

const authors = [
  {
    surnames: 'Dumas',
    name: 'Alejandro',
    birthYear: '1802',
    books: [books[0].title, books[1].title]
  },
  {
    surnames: 'García Márquez',
    name: 'Gabriel',
    birthYear: '1927',
    books: [books[2].title, books[3].title]
  },
  {
    surnames: 'King',
    name: 'Stephen',
    birthYear: '1947',
    books: [books[4].title, books[5].title]
  },
  {
    surnames: 'Orwell',
    name: 'George',
    birthYear: '1903',
    books: [books[6].title, books[7].title]
  },
  {
    surnames: 'Reilly',
    name: 'Matthew',
    birthYear: '1965',
    books: [books[8].title, books[9].title]
  }
]

module.exports = { authors }
