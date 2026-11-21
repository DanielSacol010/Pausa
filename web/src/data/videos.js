// Videos verticales de Pausa (MP4 9:16 en public/videos).
// Se generan con la carpeta videos-generador/ a partir de guiones.json.
// guion = lo que dice el video; todo tiene que estar en el estudio enlazado.

export const VIDEOS = [
  {
    id: "estudiar-no-puedo",
    titulo: "¿Qué pasa en tu cerebro cuando quieres estudiar, pero no puedes?",
    estudio: "pausas-breves",
    src: '/videos/estudiar-no-puedo.mp4',
    poster: '/videos/estudiar-no-puedo.jpg',
    duracion: 39,
    guion: [
      "Llevas mucho rato con el mismo tema, y de pronto ya no te entra nada.",
      "En un experimento, la atención de las personas fue bajando durante una tarea larga.",
      "Pero el grupo que cambió brevemente de objetivo un par de veces mantuvo su rendimiento.",
      "Los autores lo explican así: el cerebro deja de notar una meta que lleva mucho tiempo activa.",
      "Una pausa corta la vuelve a encender. Detente, respira y regresa con el siguiente paso claro.",
    ],
  },
  {
    id: "celular-sin-tocar",
    titulo: "¿Por qué el celular te distrae aunque no lo toques?",
    estudio: "notificaciones",
    src: '/videos/celular-sin-tocar.mp4',
    poster: '/videos/celular-sin-tocar.jpg',
    duracion: 37,
    guion: [
      "Te llega una notificación. No la abres. ¿Ya no te distrajo?",
      "En un experimento, las personas hacían una tarea que exige mucha atención, mientras su celular recibía llamadas y mensajes.",
      "Solo recibir la notificación empeoró su rendimiento, casi tanto como contestar el teléfono.",
      "La notificación hace que tu mente se vaya a otros pensamientos.",
      "Mientras estudias, activa el modo No molestar.",
    ],
  },
  {
    id: "dos-semanas",
    titulo: "Tips rápidos para tu atención: el reto de dos semanas",
    estudio: "internet-movil",
    src: '/videos/dos-semanas.mp4',
    poster: '/videos/dos-semanas.jpg',
    duracion: 40,
    guion: [
      "¿Y si tu celular no tuviera internet durante dos semanas?",
      "Llamadas y mensajes de texto, sí. Internet en el celular, no.",
      "En un estudio de 2025, quienes lo hicieron mantuvieron mejor la atención y dijeron sentirse mejor.",
      "Pero cumplirlo fue difícil: solo 119 de 467 personas lo lograron.",
      "Así que empieza pequeño: un rato al día sin datos mientras estudias.",
    ],
  },
  {
    id: "caminar-arboles",
    titulo: "¿Por qué caminar entre árboles te ayuda a concentrarte?",
    estudio: "naturaleza",
    src: '/videos/caminar-arboles.mp4',
    poster: '/videos/caminar-arboles.jpg',
    duracion: 35,
    guion: [
      "Un experimento comparó dos caminatas.",
      "Unas personas caminaron por un parque con árboles. Otras, por calles de la ciudad.",
      "Después del parque, rindieron mejor en pruebas de atención y memoria.",
      "Incluso ver fotos de naturaleza ayudó un poco.",
      "Es un efecto de corto plazo, pero una caminata antes de estudiar puede ayudarte.",
    ],
  },
  {
    id: "seis-horas",
    titulo: "Dormir 6 horas: ¿alcanza?",
    estudio: "sueno",
    src: '/videos/seis-horas.mp4',
    poster: '/videos/seis-horas.jpg',
    duracion: 37,
    guion: [
      "«Con 6 horas estoy bien». ¿Seguro?",
      "En un estudio, limitaron el sueño a 4, 6 u 8 horas por noche durante dos semanas.",
      "Con 4 y 6 horas, los fallos de atención aumentaron noche tras noche.",
      "Al final, dormir 6 horas o menos los dejaba casi como si hubieran pasado hasta dos noches sin dormir.",
      "Y lo peor: no se sentían tan cansados como en realidad estaban.",
    ],
  },
]
