/* Datos para la semilla de directores */

const { movies } = require('./movie')

const directors = [
  {
    surnames: 'Cameron',
    name: 'James',
    birthYear: '1954',
    movies: [movies[0].title, movies[1].title]
  },
  {
    surnames: 'Nolan',
    name: 'Christopher',
    birthYear: '1970',
    movies: [movies[2].title, movies[3].title]
  },
  {
    surnames: 'Scott',
    name: 'Ridley',
    birthYear: '1937',
    movies: [movies[4].title, movies[5].title]
  },
  {
    surnames: 'Shyamalan',
    name: 'M. Night',
    birthYear: '1970',
    movies: [movies[6].title, movies[7].title]
  },
  {
    surnames: 'Spielberg',
    name: 'Steven',
    birthYear: '1946',
    movies: [movies[8].title, movies[9].title]
  }
]

module.exports = { directors }
