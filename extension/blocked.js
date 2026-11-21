// Página que aparece cuando alguien intenta abrir un sitio bloqueado.
import { PATRONES_PAUSA, URL_PAUSA } from './config.js'

const parametros = new URLSearchParams(location.search)
const sitio = parametros.get('sitio') ?? ''

const $ = (id) => document.getElementById(id)

function formatearReloj(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const min = Math.floor(total / 60)
  const seg = total % 60
  return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`
}

function mostrarSesionTerminada() {
  $('etiqueta').textContent = 'Sesión terminada'
  $('titulo').textContent = 'Ya puedes entrar'
  $('reloj').textContent = ''
  $('sitio').textContent = ''
  $('caja-intencion').hidden = true
  if (sitio) {
    $('ir-al-sitio').href = `https://${sitio}`
    $('ir-al-sitio').textContent = `Ir a ${sitio}`
    $('ir-al-sitio').hidden = false
  }
}

async function iniciar() {
  $('sitio').textContent = sitio ? `${sitio} está bloqueado mientras termina tu sesión.` : ''

  // Avisamos a la extensión para que cuente el intento
  await chrome.runtime.sendMessage({ tipo: 'BLOCKED_HIT', datos: { sitio } })
  const estado = await chrome.runtime.sendMessage({ tipo: 'GET_STATUS' })

  if (!estado?.activa) {
    mostrarSesionTerminada()
    return
  }

  if (estado.intencion) {
    $('intencion').textContent = estado.intencion
    $('caja-intencion').hidden = false
  }

  const actualizar = () => {
    const restante = estado.terminaEn - Date.now()
    if (restante <= 0) {
      clearInterval(intervalo)
      mostrarSesionTerminada()
      return
    }
    $('reloj').textContent = formatearReloj(restante)
    document.title = `${formatearReloj(restante)} · Estás en Pausa`
  }
  const intervalo = setInterval(actualizar, 500)
  actualizar()
}

// Si Pausa ya está abierta en otra pestaña, vamos a esa. Si no, la abrimos aquí.
$('volver').addEventListener('click', async () => {
  const [pestana] = await chrome.tabs.query({ url: PATRONES_PAUSA })
  if (pestana) {
    await chrome.tabs.update(pestana.id, { active: true })
    await chrome.windows.update(pestana.windowId, { focused: true })
    window.close()
  } else {
    location.href = URL_PAUSA
  }
})

iniciar()
