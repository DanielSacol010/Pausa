// Guiones de los videos verticales. En la demo cada video es una
// animación con escenas de texto y voz del navegador; el video final
// se generaría con IA a partir de estos mismos guiones.
// Todo lo que dice cada escena tiene que estar en el estudio enlazado.

export const VIDEOS = [
  {
    id: 'estudiar-no-puedo',
    titulo: '¿Qué pasa en tu cerebro cuando quieres estudiar, pero no puedes?',
    estudio: 'pausas-breves',
    color: 'verde',
    escenas: [
      { seg: 0, texto: 'Llevas mucho rato con el mismo tema…' },
      { seg: 4, texto: '…y de pronto ya no te entra nada.' },
      { seg: 8, texto: 'En un experimento, la atención fue bajando durante una tarea larga.' },
      { seg: 13, texto: 'Pero quienes cambiaron de objetivo un par de veces mantuvieron su rendimiento.' },
      { seg: 18, texto: 'La explicación: el cerebro deja de "notar" una meta que lleva mucho tiempo activa.' },
      { seg: 23, texto: 'Prueba una pausa corta y vuelve con el siguiente paso claro.' },
    ],
    duracion: 28,
  },
  {
    id: 'celular-sin-tocar',
    titulo: '¿Por qué el celular te distrae aunque no lo toques?',
    estudio: 'notificaciones',
    color: 'naranja',
    escenas: [
      { seg: 0, texto: 'Te llega una notificación. No la abres.' },
      { seg: 4, texto: '¿Ya no te distrajo? Un estudio dice que sí.' },
      { seg: 8, texto: 'Solo recibirla empeoró el rendimiento en una tarea de atención.' },
      { seg: 13, texto: 'El efecto fue parecido al de contestar el teléfono.' },
      { seg: 18, texto: 'La notificación hace que tu mente se vaya a otra parte.' },
      { seg: 22, texto: 'Mientras estudias: modo No molestar.' },
    ],
    duracion: 26,
  },
  {
    id: 'dos-semanas',
    titulo: 'Tips rápidos para tu atención: el reto de dos semanas',
    estudio: 'internet-movil',
    color: 'azul',
    escenas: [
      { seg: 0, texto: '¿Y si tu celular no tuviera internet por dos semanas?' },
      { seg: 4, texto: 'Llamadas y mensajes de texto, sí. Redes sociales, no.' },
      { seg: 9, texto: 'En un estudio de 2025, las personas que lo hicieron mantuvieron mejor la atención.' },
      { seg: 14, texto: 'También dijeron sentirse mejor con su vida.' },
      { seg: 18, texto: 'Ojo: a la mayoría le costó cumplirlo.' },
      { seg: 22, texto: 'Empieza más pequeño: un rato al día sin datos.' },
    ],
    duracion: 26,
  },
  {
    id: 'caminar-arboles',
    titulo: '¿Por qué caminar entre árboles te ayuda a concentrarte?',
    estudio: 'naturaleza',
    color: 'verde',
    escenas: [
      { seg: 0, texto: 'Un experimento comparó dos caminatas.' },
      { seg: 4, texto: 'Unos caminaron por un parque. Otros, por calles de la ciudad.' },
      { seg: 9, texto: 'Después del parque, rindieron mejor en pruebas de atención y memoria.' },
      { seg: 14, texto: 'Hasta ver fotos de naturaleza ayudó un poco.' },
      { seg: 18, texto: 'Es un efecto de corto plazo, pero útil antes de estudiar.' },
    ],
    duracion: 22,
  },
  {
    id: 'seis-horas',
    titulo: 'Dormir 6 horas: ¿alcanza?',
    estudio: 'sueno',
    color: 'naranja',
    escenas: [
      { seg: 0, texto: '"Con seis horas estoy bien." ¿Seguro?' },
      { seg: 4, texto: 'En un estudio, durmieron seis horas durante dos semanas.' },
      { seg: 9, texto: 'Los fallos de atención aumentaron día con día.' },
      { seg: 13, texto: 'Al final rendían parecido a alguien que no durmió hasta dos noches.' },
      { seg: 18, texto: 'Y lo peor: no se sentían tan cansados como estaban.' },
    ],
    duracion: 23,
  },
]
