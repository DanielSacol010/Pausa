# Pausa

Aplicación web para enfocarse al estudiar o trabajar. Durante una sesión, una
extensión de Chrome bloquea los sitios que más distraen.

Este repo tiene las **Fases 0, 1 y 2** del plan y una **demo de la Fase 3**:

- `web/`: la app web (React + Vite + Tailwind) con cuatro módulos:
  - **Sesión de enfoque:** temporizador, intención, pantalla completa, conteo
    de salidas de la pestaña, resumen, historial y descanso.
  - **Videos:** feed vertical 9:16 estilo TikTok con 5 videos (MP4 en
    `web/public/videos`) con figuras animadas, voz y subtítulos. Controles de
    reproducir, pausar, reiniciar, sonido y barra para adelantar.
  - **Actividades de desintoxicación:** 9 actividades (la meta son unas 20).
    «Empezar con la actividad» abre una pantalla oscura con el tiempo, los
    pasos y el botón «Actividad realizada». Mientras dura, la extensión bloquea
    los sitios.
  - **Documentación científica:** biblioteca de 8 estudios y una página para
    cada uno, explicada en palabras sencillas, con enlace al original.
  - Cada video y cada actividad enlaza al estudio que la respalda, y cada
    estudio muestra en qué videos y actividades se usa.
- `extension/`: la extensión de Chrome (Manifest V3). Bloquea los sitios,
  silencia sus notificaciones y cuenta los intentos.
- `videos-generador/`: los guiones y el programa que crea los videos.
- `desktop/`: vacío por ahora (Fase 4).

## Requisitos

- [Node.js](https://nodejs.org) 20.19 o más nuevo (recomendado: la versión LTS 22).
  Para revisar: `node -v`
- Google Chrome o Microsoft Edge

## Cómo correrlo en local

### 1. Levantar la web

```bash
cd web
npm install
npm run dev
```

Abre <http://localhost:5173>. La web tiene que correr en el puerto **5173**,
porque la extensión solo se conecta con esa dirección.

### 2. Cargar la extensión

1. En Chrome abre `chrome://extensions` (en Edge: `edge://extensions`).
2. Activa el **Modo de desarrollador** (arriba a la derecha).
3. Clic en **Cargar descomprimida** y elige la carpeta `extension` de este repo.
4. Recarga la página de Pausa. Arriba a la derecha debe decir
   «Extensión activa · 8 sitios se bloquearán».

Tip: fija el ícono de Pausa en la barra de Chrome (el ícono de rompecabezas → el pin).

### 3. Probarlo

1. Escribe en qué vas a trabajar.
2. Para no esperar 25 minutos, activa **Modo demo** (cada minuto dura 1 segundo)
   y elige «Otra» → 60.
3. Clic en **Empezar sesión**.
4. Abre una pestaña nueva y entra a youtube.com: debe salir la página
   «Estás en Pausa».
5. Regresa a Pausa: el contador de bloqueos sube. Si te vas a otra pestaña o
   a otra aplicación y regresas, sube el de salidas.
6. Para terminar antes hay que escribir «Elijo distraerme».

## Si cambian el código

- **Web:** se actualiza sola al guardar.
- **Extensión:** en `chrome://extensions`, botón de recargar (flecha circular)
  de Pausa, y luego recargar la página de la web.

## Cómo está armado

```
web/src/
  App.jsx               decide qué pantalla se ve según la URL (#/videos, #/actividades, ...)
  pages/                una página por módulo + las pantallas de la sesión de enfoque
  components/           menú (Layout), video vertical, pantalla oscura de actividad, etc.
  data/                 el contenido: estudios.js, actividades.js, videos.js
  hooks/                temporizador, detector de salidas, detector de la extensión, rutas
  lib/                  sitios bloqueados, mensajes a la extensión, historial, voz, tiempo

extension/
  manifest.json         permisos y archivos de la extensión
  background.js         la lógica: activa y quita las reglas de bloqueo
  puente.js             pasa mensajes entre la web y background.js
  blocked.html/.js      la página «Estás en Pausa»
  popup.html/.js        la ventanita del ícono
  config.js             dirección de la web (localhost:5173)
```

### Cómo hablan la web y la extensión

Una página web no puede llamar directo a una extensión. Por eso la extensión
mete `puente.js` en la página de Pausa: la web manda mensajes con
`window.postMessage`, el puente los pasa a `background.js` y devuelve la
respuesta.

| Mensaje | Quién lo manda | Qué hace |
| --- | --- | --- |
| `PING` | web | Saber si la extensión está instalada |
| `START_SESSION` | web | Activa el bloqueo hasta `terminaEn` |
| `END_SESSION` | web | Quita el bloqueo y devuelve los intentos |
| `GET_STATUS` | web, popup, blocked.html | Estado actual de la sesión |
| `BLOCKED_HIT` | blocked.html | Suma un intento bloqueado |

El bloqueo usa `chrome.declarativeNetRequest`: una regla por sitio que
redirige la página a `blocked.html`. Las notificaciones de esos sitios se
silencian con `chrome.contentSettings` y se restauran al terminar.

## Cómo agregar contenido

Todo el contenido está en `web/src/data/`:

- **Un estudio:** agrega un objeto a `estudios.js` con un `id` nuevo.
- **Una actividad:** agrega un objeto a `actividades.js`. En `estudio` va el
  `id` del estudio que la respalda.
- **Un video:** escribe su guion en `videos-generador/guiones.json` y sigue
  los pasos de `videos-generador/README.md`. Todo lo que diga el video tiene
  que estar en el estudio enlazado.

## Cosas que todavía no hace

- La lista de sitios está fija en `web/src/lib/sitios.js`.
- La voz de los videos es un modelo libre básico (Piper); se puede cambiar
  por una voz de mejor calidad regenerando los videos.
- Hay 9 actividades y 8 estudios; la meta son unas 20 actividades.
- Si alguien desactiva la extensión o usa modo incógnito, puede saltarse el bloqueo.
- Solo bloquea páginas completas: un video de YouTube incrustado en otro sitio sí se ve.
- No bloquea aplicaciones de Windows ni el celular (Fase 4 y fuera del MVP).
- Si publican la web en otra dirección (Vercel, Netlify), hay que agregarla en
  `extension/config.js` y en `matches` de `extension/manifest.json`.
