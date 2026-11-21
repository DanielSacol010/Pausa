// Ventanita que sale al hacer clic en el ícono de la extensión.
// A propósito no tiene botón para terminar la sesión: eso solo se hace desde la web.
import { PATRONES_PAUSA, URL_PAUSA } from './config.js'

const caja = document.getElementById('estado')

function formatearReloj(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

async function mostrar() {
  const estado = await chrome.runtime.sendMessage({ tipo: 'GET_STATUS' })
  if (!estado?.activa) {
    caja.innerHTML = '<p class="suave">No hay ninguna sesión activa.</p>'
    return
  }
  caja.innerHTML = ''
  const reloj = document.createElement('p')
  reloj.className = 'reloj numeros'
  const detalle = document.createElement('p')
  detalle.className = 'suave'
  detalle.textContent = `${estado.sitios.length} sitios bloqueados · ${estado.intentos} intentos evitados`
  caja.append(reloj, detalle)

  const actualizar = () => {
    reloj.textContent = formatearReloj(estado.terminaEn - Date.now())
  }
  actualizar()
  setInterval(actualizar, 500)
}

document.getElementById('abrir').addEventListener('click', async () => {
  const [pestana] = await chrome.tabs.query({ url: PATRONES_PAUSA })
  if (pestana) {
    await chrome.tabs.update(pestana.id, { active: true })
    await chrome.windows.update(pestana.windowId, { focused: true })
  } else {
    await chrome.tabs.create({ url: URL_PAUSA })
  }
  window.close()
})

mostrar()
