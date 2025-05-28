/* Datos para la semilla de libros */

const { GENRES } = require('../api/models/book')

const books = [
  {
    title: 'El conde de Montecristo',
    genre: GENRES.narrative,
    isbn: '9788439730132',
    publicationDate: '28/07/1844',
    numCopies: 5,
    abstract:
      "Narra la historia de Edmond Dantès, un joven marinero que es injustamente acusado de traición y encarcelado en el Château d'If. Durante su tiempo en prisión, descubre un tesoro escondido en la isla de Montecristo. Tras escapar, se convierte en el enigmático y poderoso conde de Montecristo, y usa su nueva riqueza y astucia para vengarse de aquellos que lo traicionaron, ayudando también a quienes le fueron leales. La historia trata temas de justicia, venganza, amor y redención, y muestra cómo la búsqueda de venganza puede transformar a una persona."
  },
  {
    title: 'Los tres mosqueteros',
    genre: GENRES.narrative,
    isbn: '9788413626727',
    publicationDate: '14/03/1844',
    numCopies: 3,
    abstract:
      "Narra las aventuras de un joven llamado d'Artagnan, quien viaja a París para unirse a los mosqueteros del rey. Allí, hace amistad con tres valientes y leales mosqueteros: Athos, Porthos y Aramis. Juntos se enfrentan a intrigas políticas, traiciones y peligros, defendiendo el honor del rey y luchando por la justicia. La historia está llena de acción, amistad y valentía, y también incluye un romance con la hermosa condesa de Winter. Es una emocionante aventura llena de lealtad y coraje."
  },
  {
    title: 'Cien años de soledad',
    genre: GENRES.narrative,
    isbn: '9788439745358',
    publicationDate: '30/05/1967',
    numCopies: 4,
    abstract:
      'Narra la historia de la familia Buendía a lo largo de varias generaciones en el pueblo ficticio de Macondo. La historia combina elementos mágicos y realistas, explorando temas como el amor, la soledad, el destino y el paso del tiempo. A medida que las generaciones pasan, los personajes enfrentan repetidos patrones de conducta y tragedias, reflejando la naturaleza cíclica de la historia familiar y de la historia de América Latina. La novela es una obra maestra del realismo mágico y una profunda reflexión sobre la condición humana.'
  },
  {
    title: 'El amor en los tiempos del cólera',
    genre: GENRES.romance,
    isbn: '9788439735427',
    publicationDate: '30/09/1985',
    numCopies: 2,
    abstract:
      'Narra la historia de amor entre Florentino Ariza y Fermina Daza. Desde jóvenes, ambos sienten una profunda atracción, pero sus caminos se separan cuando Fermina se casa con el doctor Juvenal Urbino. A lo largo de los años, Florentino nunca deja de amarla y espera pacientemente el momento adecuado para confesarle sus sentimientos. La historia abarca varias décadas, mostrando cómo el amor puede perdurar a pesar del tiempo, las dificultades y las circunstancias. Finalmente, después de la muerte de Urbino, Florentino y Fermina se reencuentran y viven juntos su amor, demostrando que el amor verdadero puede resistir el paso del tiempo. Es una hermosa reflexión sobre la pasión, la paciencia y la esperanza.'
  },
  {
    title: 'El resplandor',
    genre: GENRES.mystery,
    isbn: '9788466357319',
    publicationDate: '28/01/1977',
    numCopies: 5,
    abstract:
      'Narra la historia de Jack Torrance, un escritor y exalcohólico que acepta un trabajo como cuidador del Hotel Overlook durante el invierno. Jack se muda allí con su esposa Wendy y su hijo pequeño, Danny, quien tiene habilidades psíquicas llamadas "el resplandor". A medida que pasa el tiempo, la presencia maligna del hotel comienza a influir en Jack, llevándolo a la locura. Danny, con su don especial, percibe la creciente amenaza y trata de advertir a su madre. La historia se desarrolla en un ambiente de tensión y terror, culminando en un enfrentamiento entre la familia y las fuerzas oscuras del hotel. La novela explora temas como la locura, el aislamiento y el poder de lo sobrenatural.'
  },
  {
    title: 'It',
    genre: GENRES.fear,
    isbn: '9788466345347',
    publicationDate: '15/09/1986',
    numCopies: 3,
    abstract:
      'Narra la historia de un grupo de amigos, conocidos como Los Perdedores, que en su infancia enfrentaron a una entidad maligna que tomaba la forma de un payaso llamado Pennywise. Este ser aterrador acecha la ciudad de Derry, Maine, y se alimenta del miedo y la violencia de los niños. Años después, cuando la criatura vuelve a aparecer, los amigos, ya adultos, deben reunirse para enfrentarse a sus miedos y derrotar a It de una vez por todas. La novela explora temas como la infancia, el miedo, la amistad y el paso del tiempo, mostrando cómo las experiencias del pasado influyen en el presente. Es una historia intensa y escalofriante que combina elementos de horror sobrenatural con una profunda reflexión sobre la vida y la memoria.'
  },
  {
    title: '1984',
    genre: GENRES.sciFi,
    isbn: '9788441440678',
    publicationDate: '08/06/1949',
    numCopies: 4,
    abstract:
      'Narra una historia distópica que nos muestra un futuro en el que un gobierno totalitario, liderado por el Partido y su enigmático líder, el Gran Hermano, controla todos los aspectos de la vida de las personas. La trama sigue a Winston Smith, un trabajador en el Ministerio de la Verdad, quien comienza a cuestionar el régimen y busca la verdad y la libertad en un mundo donde la vigilancia y la censura son constantes. La novela explora temas como la vigilancia masiva, la manipulación de la información, la pérdida de la privacidad y la lucha por la individualidad. Es una reflexión profunda sobre el poder y la resistencia en una sociedad opresiva.'
  },
  {
    title: 'Rebelión en la granja',
    genre: GENRES.literature,
    isbn: '9788499890951',
    publicationDate: '17/08/1945',
    numCopies: 2,
    abstract:
      'Narra la historia de una granja donde los animales, cansados de la opresión del granjero humano, se rebelan y toman el control, buscando crear una sociedad igualitaria y justa. Sin embargo, con el tiempo, los cerdos, que lideran la revolución, empiezan a adoptar comportamientos similares a los humanos, acumulando poder y privilegios. La novela muestra cómo los ideales de igualdad y libertad pueden ser traicionados por aquellos que buscan el poder, y cómo la corrupción puede infiltrarse incluso en los movimientos más nobles. Es una crítica a los regímenes totalitarios y a la naturaleza del poder.'
  },
  {
    title: 'Las siete pruebas',
    genre: GENRES.narrative,
    isbn: '9788408077619',
    publicationDate: '15/05/2010',
    numCopies: 3,
    abstract:
      'Narra la historia de un grupo de personajes enfrentándose a desafíos peligrosos en un entorno lleno de misterio y tensión. La historia gira en torno a una serie de pruebas que deben superar para salvar el mundo o cumplir una misión crucial. Cada prueba presenta obstáculos mortales, enigmas y enemigos poderosos, poniendo a prueba la valentía, inteligencia y habilidades de los protagonistas. La novela combina escenas de acción rápidas, acertijos y una trama llena de suspenso, manteniendo al lector en vilo hasta el final.'
  },
  {
    title: 'El templo',
    genre: GENRES.narrative,
    isbn: '9788498007893',
    publicationDate: '10/09/2009',
    numCopies: 1,
    abstract:
      'Narra la historia de un grupo de personajes que se embarcan en una misión para encontrar un antiguo y misterioso templo en la selva de América Central. La historia comienza cuando un equipo de exploradores descubre un templo oculto que guarda secretos y peligros inimaginables. Sin embargo, pronto se enfrentan a una serie de obstáculos mortales, incluyendo trampas, enemigos y enigmas que deben resolver para avanzar. La trama combina escenas de acción trepidantes, tecnología avanzada y un misterio ancestral, manteniendo al lector en tensión desde el principio hasta el final. La novela explora temas de valentía, historia antigua y la lucha por descubrir verdades ocultas.'
  }
]

module.exports = { books }
