// Este script corre dentro de la página de Pausa (localhost:5173).
// Recibe los mensajes de la web y se los pasa al service worker de la
// extensión (background.js). Luego devuelve la respuesta a la web.

window.addEventListener('message', async (evento) => {
  if (evento.source !== window) return
  const msg = evento.data
  if (!msg || msg.origen !== 'pausa-web') return

  const responder = (contenido) =>
    window.postMessage({ origen: 'pausa-extension', id: msg.id, ...contenido }, window.location.origin)

  try {
    const respuesta = await chrome.runtime.sendMessage({ tipo: msg.tipo, datos: msg.datos })
    if (respuesta?.error) responder({ error: respuesta.error })
    else responder({ respuesta })
  } catch (error) {
    // Pasa si recargaron la extensión y esta página quedó con el puente viejo
    responder({ error: error.message })
  }
})
