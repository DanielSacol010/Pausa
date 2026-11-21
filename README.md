# Pausa

Aplicación web para enfocarse al estudiar o trabajar. Durante una sesión, una
extensión de Chrome bloquea los sitios que más distraen.

Este repo tiene lo de las **Fases 0, 1 y 2** del plan:

- `web/`: la app web (React + Vite + Tailwind). Temporizador, intención de la
  sesión, pantalla completa, conteo de salidas de la pestaña, resumen,
  historial y descanso.
- `extension/`: la extensión de Chrome (Manifest V3). Bloquea los sitios,
  silencia sus notificaciones y cuenta los intentos.
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
  App.jsx               decide qué pantalla se ve (inicio, sesión, resumen, descanso)
  pages/                las 4 pantallas
  components/           estado de la extensión y la ventana para rendirse
  hooks/                temporizador, detector de salidas, detector de la extensión
  lib/                  sitios bloqueados, mensajes a la extensión, historial, formatos de tiempo

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

## Cosas que todavía no hace

- La lista de sitios está fija en `web/src/lib/sitios.js` (se podrá editar en la Fase 3).
- Si alguien desactiva la extensión o usa modo incógnito, puede saltarse el bloqueo.
- Solo bloquea páginas completas: un video de YouTube incrustado en otro sitio sí se ve.
- No bloquea aplicaciones de Windows ni el celular (Fase 4 y fuera del MVP).
- Si publican la web en otra dirección (Vercel, Netlify), hay que agregarla en
  `extension/config.js` y en `matches` de `extension/manifest.json`.
