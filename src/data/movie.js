/* Datos para la semilla de películas */

const { GENRES, AGE_RATING } = require('../api/models/movie')

const movies = [
  {
    title: 'Aliens: el regreso',
    genre: GENRES.sciFi,
    ageRating: AGE_RATING[16],
    releaseYear: '1986',
    minDuration: '137',
    numCopies: 5,
    synopsis:
      'Después de que la colonia en LV-426 desapareciera, Ripley regresa al planeta junto a un equipo de marines para investigar. Descubren que los aliens han evolucionado y representan una amenaza aún mayor. La batalla por la supervivencia se desata en un enfrentamiento intenso y lleno de tensión.'
  },
  {
    title: 'Titanic',
    genre: GENRES.drama,
    ageRating: AGE_RATING[12],
    releaseYear: '1997',
    minDuration: '195',
    numCopies: 3,
    synopsis:
      'Historia de amor que se desarrolla a bordo del famoso barco, que se hunde en su viaje inaugural. La película sigue a Jack y Rose, dos jóvenes de diferentes clases sociales, que encuentran el amor en medio de la tragedia. Es una emotiva mezcla de romance, aventura y drama que captura la magnitud del desastre y la fuerza del amor.'
  },
  {
    title: 'Batman Begins',
    genre: GENRES.action,
    ageRating: AGE_RATING[12],
    releaseYear: '2005',
    minDuration: '140',
    numCopies: 4,
    synopsis:
      'Bruce Wayne, tras la muerte de sus padres, viaja por el mundo para entender el crimen y la corrupción. Al regresar a Gotham, se convierte en Batman para luchar contra el mal y proteger a su ciudad. Es una historia de origen que muestra su transformación en el héroe que todos conocemos.'
  },
  {
    title: 'Interstellar',
    genre: GENRES.sciFi,
    ageRating: AGE_RATING[12],
    releaseYear: '2014',
    minDuration: '169',
    numCopies: 2,
    synopsis:
      'Al ver que la vida en la Tierra está llegando a su fin, un grupo de exploradores dirigidos por el piloto Cooper y la científica Amelia emprende una misión que puede ser la más importante de la historia de la humanidad: viajar más allá de nuestra galaxia para descubrir algún planeta que pueda garantizar el futuro de la raza humana.'
  },
  {
    title: 'Alien: el octavo pasajero',
    genre: GENRES.sciFi,
    ageRating: AGE_RATING[16],
    releaseYear: '1979',
    minDuration: '117',
    numCopies: 5,
    synopsis:
      'De regreso a la Tierra, la nave de carga Nostromo interrumpe su viaje y despierta a sus siete tripulantes. El ordenador central, MADRE, ha detectado la misteriosa transmisión de una forma de vida desconocida, procedente de un planeta cercano aparentemente deshabitado. La nave se dirige entonces al extraño planeta para investigar el origen de la comunicación.'
  },
  {
    title: 'Gladiator',
    genre: GENRES.action,
    ageRating: AGE_RATING[16],
    releaseYear: '2000',
    minDuration: '155',
    numCopies: 3,
    synopsis:
      'En el año 180, el Imperio Romano domina todo el mundo conocido. Tras una gran victoria sobre los bárbaros del norte, el anciano emperador Marco Aurelio decide transferir el poder a Máximo, bravo general de sus ejércitos y hombre de inquebrantable lealtad al imperio. Pero su hijo Cómodo, que aspiraba al trono, no lo acepta y trata de asesinar a Máximo.'
  },
  {
    title: 'El bosque',
    genre: GENRES.fear,
    ageRating: AGE_RATING[12],
    releaseYear: '2004',
    minDuration: '108',
    numCopies: 4,
    synopsis:
      'Los vecinos de una pequeña población rural de Pennsylvania viven atemorizados por culpa de unos extraños seres que habitan en los bosques circundantes. Saben perfectamente que para salvarse deben cumplir escrupulosamente ciertas reglas: evitar que vean el color rojo porque los atrae, mantenerse alejados del bosque, donde esperan agazapados la llegada de alguien, y obedecer la campana de alerta, que indica que se acercan a la aldea.'
  },
  {
    title: 'El sexto sentido',
    genre: GENRES.thriller,
    ageRating: AGE_RATING[16],
    releaseYear: '1999',
    minDuration: '107',
    numCopies: 2,
    synopsis:
      'El doctor Malcom Crowe es un conocido psicólogo infantil de Philadelphia que conoce a Cole Sear, un aterrorizado y confuso niño de ocho años que necesita tratamiento. Sin embargo, el doctor Crowe no está preparado para conocer la terrible verdad acerca del don sobrenatural de su paciente: recibe visitas no deseadas de espíritus atormentados.'
  },
  {
    title: 'Indiana Jones y el templo maldito',
    genre: GENRES.adventure,
    ageRating: AGE_RATING[12],
    releaseYear: '1984',
    minDuration: '118',
    numCopies: 3,
    synopsis:
      'Shanghai (1935). El intrépido arqueólogo Indiana Jones, tras meterse en jaleos en un local nocturno, consigue escapar junto a una bella cantante y su joven acompañante. Tras un accidentado vuelo, los tres acaban en la India, donde intentarán ayudar a los habitantes de un pequeño poblado, cuyos niños han sido raptados.'
  },
  {
    title: 'La lista de Schindler',
    genre: GENRES.historical,
    ageRating: AGE_RATING[16],
    releaseYear: '1993',
    minDuration: '195',
    numCopies: 1,
    synopsis:
      'Oskar Schindler fue un empresario alemán que salvó a más de mil judíos durante el Holocausto empleándolos en sus fábricas. La película muestra su transformación de un hombre interesado en el dinero a uno que arriesga todo para salvar vidas. Es una historia poderosa sobre la esperanza, la redención y la humanidad en tiempos oscuros.'
  }
]

module.exports = { movies }
