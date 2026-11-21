// Estudios que respaldan las actividades y los videos de Pausa.
// Cada estudio tiene un resumen corto (para la biblioteca) y una
// explicación más larga en lenguaje sencillo (para su página).

export const ESTUDIOS = [
  {
    id: 'internet-movil',
    categoria: 'Hábitos digitales',
    titulo: 'Menos conexión constante, más atención',
    autores: 'Castelo y colaboradores',
    anio: 2025,
    revista: 'PNAS Nexus',
    diseno: 'Ensayo aleatorizado',
    resumenCorto: 'Bloquear internet en el celular dos semanas mejoró la atención sostenida.',
    queHicieron:
      'Pidieron a un grupo de adultos que bloquearan el internet de su celular durante dos semanas con una aplicación. Podían seguir haciendo llamadas, mandando mensajes de texto y usando internet en la computadora. Antes y después midieron su atención con una tarea en la computadora y su bienestar con cuestionarios.',
    queEncontraron:
      'Después de las dos semanas, las personas mantenían mejor la atención en la tarea y reportaron mejoras en su salud mental y en cómo se sentían con su vida.',
    limites:
      'Cumplir fue difícil: solo 119 de 467 personas comprometidas cumplieron el criterio que los investigadores definieron. Tampoco se sabe cuánto duran los beneficios a largo plazo.',
    cita: 'Castelo, N., Kushlev, K., Ward, A. F., Esterman, M., & Reiner, P. B. (2025). Blocking mobile internet on smartphones improves sustained attention, mental health, and subjective well-being. PNAS Nexus, 4(2), pgaf017. https://doi.org/10.1093/pnasnexus/pgaf017',
    url: 'https://pubmed.ncbi.nlm.nih.gov/39967678/',
  },
  {
    id: 'notificaciones',
    categoria: 'Hábitos digitales',
    titulo: 'El costo de una notificación',
    autores: 'Stothart, Mitchum y Yehnert',
    anio: 2015,
    revista: 'Journal of Experimental Psychology: Human Perception and Performance',
    diseno: 'Experimento de laboratorio',
    resumenCorto: 'Recibir una notificación distrae casi tanto como contestar el teléfono.',
    queHicieron:
      'Los participantes hicieron una tarea en la computadora que exige mucha atención. Mientras tanto, algunos recibían notificaciones en su celular (una llamada o un mensaje), pero no las contestaban. Compararon su rendimiento con el de personas que sí usaban el teléfono durante la tarea.',
    queEncontraron:
      'Solo recibir la notificación empeoró el rendimiento en la tarea, y el efecto fue parecido al de usar el celular de verdad. Los autores proponen que la notificación hace que la mente se vaya a otros pensamientos, aunque la persona no toque el teléfono.',
    limites:
      'Es un efecto inmediato medido en el laboratorio. No demuestra que las notificaciones causen un daño permanente en la atención.',
    cita: 'Stothart, C., Mitchum, A., & Yehnert, C. (2015). The attentional cost of receiving a cell phone notification. Journal of Experimental Psychology: Human Perception and Performance, 41(4), 893–897. https://doi.org/10.1037/xhp0000100',
    url: 'https://pubmed.ncbi.nlm.nih.gov/26121498/',
  },
  {
    id: 'multitarea',
    categoria: 'Hábitos digitales',
    titulo: 'La multitarea en clase afecta a todos',
    autores: 'Sana, Weston y Cepeda',
    anio: 2013,
    revista: 'Computers & Education',
    diseno: 'Dos experimentos',
    resumenCorto: 'Hacer otras cosas en la laptop durante una clase bajó la comprensión, incluso de quien estaba al lado.',
    queHicieron:
      'Estudiantes universitarios escucharon una clase y tomaron notas en una laptop. A algunos les pidieron hacer tareas en internet al mismo tiempo. En un segundo experimento, otros estudiantes tomaban notas en papel sentados donde podían ver la pantalla de alguien que hacía multitarea. Al final todos hicieron un examen sobre la clase.',
    queEncontraron:
      'Quienes hicieron multitarea entendieron menos la clase. También salieron peor quienes solo podían ver la laptop de un compañero haciendo multitarea.',
    limites:
      'Se estudió una clase grabada en un entorno controlado. Los resultados pueden variar según la materia, la persona y el tipo de distracción.',
    cita: 'Sana, F., Weston, T., & Cepeda, N. J. (2013). Laptop multitasking hinders classroom learning for both users and nearby peers. Computers & Education, 62, 24–31. https://doi.org/10.1016/j.compedu.2012.10.003',
    url: 'https://user.it.uu.se/~hesc0353/introIT/2012-Sana-Weston-Cepeda.pdf',
  },
  {
    id: 'atencion-plena',
    categoria: 'Atención plena',
    titulo: 'Aprender a volver al presente',
    autores: 'Mrazek y colaboradores',
    anio: 2013,
    revista: 'Psychological Science',
    diseno: 'Intervención con grupo de comparación',
    resumenCorto: 'Dos semanas de atención plena redujeron la divagación mental en universitarios.',
    queHicieron:
      'Asignaron a estudiantes universitarios a uno de dos cursos de dos semanas: uno de atención plena (mindfulness) y otro de nutrición. Antes y después midieron su memoria de trabajo, su comprensión lectora en una prueba tipo examen de admisión y cuántas veces su mente se iba a otra parte.',
    queEncontraron:
      'El grupo de atención plena mejoró en memoria de trabajo y comprensión lectora, y su mente divagó menos. El grupo de nutrición no mostró esos cambios.',
    limites:
      'Se estudió a universitarios durante poco tiempo. Practicar cinco minutos en Pausa no equivale al programa completo ni garantiza los mismos resultados.',
    cita: 'Mrazek, M. D., Franklin, M. S., Phillips, D. T., Baird, B., & Schooler, J. W. (2013). Mindfulness training improves working memory capacity and GRE performance while reducing mind wandering. Psychological Science, 24(5), 776–781. https://doi.org/10.1177/0956797612459659',
    url: 'https://pubmed.ncbi.nlm.nih.gov/23538911/',
  },
  {
    id: 'pausas-breves',
    categoria: 'Bienestar',
    titulo: 'Pausas pequeñas en tareas largas',
    autores: 'Ariga y Lleras',
    anio: 2011,
    revista: 'Cognition',
    diseno: 'Experimento de laboratorio',
    resumenCorto: 'Cambiar de objetivo un par de veces evitó que la atención cayera en una tarea larga.',
    queHicieron:
      'Los participantes hicieron una tarea visual larga y repetitiva en la computadora, en la que tenían que estar atentos todo el tiempo. Un grupo, además, debía recordar unos números y responder a ellos un par de veces durante la tarea, es decir, cambiaba brevemente de objetivo.',
    queEncontraron:
      'En la mayoría de los grupos el rendimiento fue bajando con el tiempo. El grupo que hizo esos cambios breves mantuvo su rendimiento. Los autores lo explican así: el cerebro deja de "notar" una meta que lleva mucho tiempo activa, y una pausa corta la reactiva.',
    limites:
      'Las pausas del estudio eran muy específicas. El estudio no dice cada cuántos minutos hay que descansar.',
    cita: 'Ariga, A., & Lleras, A. (2011). Brief and rare mental "breaks" keep you focused: Deactivation and reactivation of task goals preempt vigilance decrements. Cognition, 118(3), 439–443. https://doi.org/10.1016/j.cognition.2010.12.007',
    url: 'https://pubmed.ncbi.nlm.nih.gov/21211793/',
  },
  {
    id: 'ejercicio',
    categoria: 'Bienestar',
    titulo: 'Mover el cuerpo, apoyar el control mental',
    autores: 'Hillman y colaboradores',
    anio: 2014,
    revista: 'Pediatrics',
    diseno: 'Ensayo aleatorizado · 221 niños',
    resumenCorto: 'Nueve meses de actividad física mejoraron un poco el control de la atención en niños.',
    queHicieron:
      'Asignaron al azar a 221 niños de siete a nueve años a un programa de actividad física después de clases durante nueve meses, o a un grupo que esperó. Midieron con tareas en computadora qué tan bien controlaban sus respuestas y cambiaban de una regla a otra.',
    queEncontraron:
      'Los niños del programa mejoraron de forma modesta en inhibir respuestas automáticas y en flexibilidad mental, comparados con el grupo que esperó.',
    limites:
      'La población fue infantil y el programa duró meses. No demuestra que una sesión corta de ejercicio tenga el mismo efecto.',
    cita: 'Hillman, C. H., et al. (2014). Effects of the FITKids randomized controlled trial on executive control and brain function. Pediatrics, 134(4), e1063–e1071. https://doi.org/10.1542/peds.2013-3219',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4179093/',
  },
  {
    id: 'naturaleza',
    categoria: 'Bienestar',
    titulo: 'Un respiro en la naturaleza',
    autores: 'Berman, Jonides y Kaplan',
    anio: 2008,
    revista: 'Psychological Science',
    diseno: 'Dos experimentos',
    resumenCorto: 'Caminar en un parque o ver fotos de naturaleza mejoró la atención a corto plazo.',
    queHicieron:
      'En un experimento, los participantes caminaron por un parque con árboles o por calles de la ciudad. En otro, solo vieron fotos de naturaleza o de ciudad. Antes y después hicieron pruebas de atención y memoria.',
    queEncontraron:
      'Después de caminar en la naturaleza o ver fotos de naturaleza, mejoraron en algunas pruebas de atención dirigida y memoria de trabajo. Con la ciudad no pasó lo mismo.',
    limites:
      'Son mejoras en pruebas específicas y de corto plazo. No prueban un aumento permanente de la atención.',
    cita: 'Berman, M. G., Jonides, J., & Kaplan, S. (2008). The cognitive benefits of interacting with nature. Psychological Science, 19(12), 1207–1212. https://doi.org/10.1111/j.1467-9280.2008.02225.x',
    url: 'https://pubmed.ncbi.nlm.nih.gov/19121124/',
  },
  {
    id: 'sueno',
    categoria: 'Bienestar',
    titulo: 'El descanso también cuenta',
    autores: 'Van Dongen y colaboradores',
    anio: 2003,
    revista: 'Sleep',
    diseno: 'Experimento de restricción de sueño',
    resumenCorto: 'Dormir 4 o 6 horas por dos semanas fue acumulando fallos de atención.',
    queHicieron:
      'Durante catorce noches, limitaron el tiempo que los participantes podían dormir a cuatro, seis u ocho horas. Otro grupo pasó varias noches sin dormir. Cada día midieron su atención y su memoria.',
    queEncontraron:
      'Con cuatro o seis horas, los fallos de atención fueron aumentando día con día. Al final, quienes durmieron seis horas o menos rendían parecido a alguien que pasó hasta dos noches sin dormir. Además, las personas no se sentían tan somnolientas como mostraban sus resultados.',
    limites:
      'El estudio no determina cuántas horas necesita cada persona. Llevar un registro de sueño ayuda a ver patrones, pero no es un tratamiento.',
    cita: 'Van Dongen, H. P. A., Maislin, G., Mullington, J. M., & Dinges, D. F. (2003). The cumulative cost of additional wakefulness: Dose-response effects on neurobehavioral functions and sleep physiology from chronic sleep restriction and total sleep deprivation. Sleep, 26(2), 117–126. https://doi.org/10.1093/sleep/26.2.117',
    url: 'https://pubmed.ncbi.nlm.nih.gov/12683469/',
  },
]

export const CATEGORIAS_ESTUDIOS = ['Todos', 'Hábitos digitales', 'Atención plena', 'Bienestar']

export function buscarEstudio(id) {
  return ESTUDIOS.find((e) => e.id === id)
}
