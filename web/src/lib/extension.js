// Comunicación entre la web y la extensión de Chrome.
//
// Una página web no puede llamar a la extensión directamente. Por eso la
// extensión mete un pequeño script (puente.js) en esta página: la web le
// manda mensajes con window.postMessage y el puente se los pasa a la
// extensión. La respuesta regresa por el mismo camino.

let siguienteId = 0

export function enviarAExtension(tipo, datos = {}, esperaMs = 1500) {
  return new Promise((resolve, reject) => {
    const id = `${Date.now()}-${siguienteId++}`

    const temporizador = setTimeout(() => {
      window.removeEventListener('message', alRecibir)
      reject(new Error('La extensión no respondió'))
    }, esperaMs)

    function alRecibir(evento) {
      if (evento.source !== window) return
      const msg = evento.data
      if (!msg || msg.origen !== 'pausa-extension' || msg.id !== id) return

      clearTimeout(temporizador)
      window.removeEventListener('message', alRecibir)
      if (msg.error) reject(new Error(msg.error))
      else resolve(msg.respuesta)
    }

    window.addEventListener('message', alRecibir)
    window.postMessage({ origen: 'pausa-web', id, tipo, datos }, window.location.origin)
  })
}

export async function hayExtension() {
  try {
    const respuesta = await enviarAExtension('PING', {}, 800)
    return respuesta?.ok === true
  } catch {
    return false
  }
}
