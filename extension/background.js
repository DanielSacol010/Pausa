// Service worker de la extensión: aquí vive la lógica del bloqueo.
//
// Mensajes que entiende:
//   PING           -> la web pregunta si la extensión está instalada
//   START_SESSION  -> activa el bloqueo de sitios hasta "terminaEn"
//   END_SESSION    -> quita el bloqueo y devuelve los intentos bloqueados
//   GET_STATUS     -> estado actual (para la web, el popup y blocked.html)
//   BLOCKED_HIT    -> blocked.html avisa que bloqueó un intento
//
// El estado se guarda en chrome.storage porque Chrome apaga el service
// worker cuando no lo usa, y las variables normales se perderían.

import { URL_PAUSA } from './config.js'

const ALARMA_FIN = 'pausa-fin'

const ESTADO_VACIO = {
  activa: false,
  intencion: '',
  terminaEn: 0,
  sitios: [],
  intentos: 0,
  porSitio: {},
}

async function leerEstado() {
  const { estado } = await chrome.storage.local.get('estado')
  return estado ?? { ...ESTADO_VACIO }
}

async function guardarEstado(estado) {
  await chrome.storage.local.set({ estado })
}

// "https://www.YouTube.com/watch" -> "youtube.com"
function limpiarDominio(texto) {
  return String(texto)
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, '')
    .replace(/^www\./, '')
    .split(/[/?#:]/)[0]
}

// Una regla por sitio: cualquier página principal de ese dominio (y sus
// subdominios, como m.youtube.com) se redirige a blocked.html.
function crearReglas(sitios) {
  return sitios.map((sitio, i) => ({
    id: i + 1,
    priority: 1,
    action: {
      type: 'redirect',
      redirect: { extensionPath: `/blocked.html?sitio=${encodeURIComponent(sitio)}` },
    },
    condition: {
      requestDomains: [sitio],
      resourceTypes: ['main_frame'],
    },
  }))
}

async function quitarReglas() {
  const actuales = await chrome.declarativeNetRequest.getDynamicRules()
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: actuales.map((regla) => regla.id),
  })
}

async function bloquearNotificaciones(sitios) {
  for (const sitio of sitios) {
    try {
      await chrome.contentSettings.notifications.set({
        primaryPattern: `*://*.${sitio}/*`,
        setting: 'block',
      })
    } catch (error) {
      console.warn('No se pudieron bloquear las notificaciones de', sitio, error)
    }
  }
}

async function desbloquearNotificaciones() {
  try {
    // Borra solo lo que puso esta extensión; lo que el usuario configuró queda igual
    await chrome.contentSettings.notifications.clear({})
  } catch (error) {
    console.warn('No se pudieron restaurar las notificaciones', error)
  }
}

// Si el usuario ya tenía YouTube abierto, lo recargamos para que
// también le aparezca la página de bloqueo.
async function recargarPestanasBloqueadas(sitios) {
  const patrones = sitios.flatMap((sitio) => [`*://${sitio}/*`, `*://*.${sitio}/*`])
  const pestanas = await chrome.tabs.query({ url: patrones })
  for (const pestana of pestanas) {
    chrome.tabs.reload(pestana.id)
  }
}

async function iniciarSesion({ terminaEn, intencion, sitios }) {
  if (typeof terminaEn !== 'number' || terminaEn <= Date.now()) {
    throw new Error('La hora de fin no es válida')
  }
  const dominios = [...new Set((sitios ?? []).map(limpiarDominio).filter(Boolean))]

  await quitarReglas()
  await chrome.declarativeNetRequest.updateDynamicRules({ addRules: crearReglas(dominios) })
  await bloquearNotificaciones(dominios)

  await guardarEstado({
    activa: true,
    intencion: String(intencion ?? '').slice(0, 120),
    terminaEn,
    sitios: dominios,
    intentos: 0,
    porSitio: {},
  })

  await chrome.alarms.create(ALARMA_FIN, { when: terminaEn })
  await chrome.action.setBadgeBackgroundColor({ color: '#2f6f6a' })
  await chrome.action.setBadgeText({ text: 'ON' })
  await recargarPestanasBloqueadas(dominios)

  return { ok: true, sitios: dominios }
}

async function terminarSesion() {
  await quitarReglas()
  await desbloquearNotificaciones()
  await chrome.alarms.clear(ALARMA_FIN)
  await chrome.action.setBadgeText({ text: '' })

  // Guardamos los intentos aunque la sesión ya terminó, para que la web
  // los pueda mostrar en el resumen aunque llegue un poco tarde.
  const estado = await leerEstado()
  const final = { ...estado, activa: false }
  await guardarEstado(final)
  return { ok: true, intentos: final.intentos, porSitio: final.porSitio }
}

async function registrarIntento(sitio) {
  const estado = await leerEstado()
  if (!estado.activa) return { ok: false }
  const dominio = limpiarDominio(sitio)
  estado.intentos += 1
  estado.porSitio[dominio] = (estado.porSitio[dominio] ?? 0) + 1
  await guardarEstado(estado)
  return { ok: true, intentos: estado.intentos }
}

// Si la sesión ya debía haber terminado (por ejemplo, la compu estuvo
// suspendida), la cerramos. Si sigue activa, nos aseguramos de que exista la alarma.
async function revisarSesion() {
  const estado = await leerEstado()
  if (!estado.activa) {
    await quitarReglas()
    return estado
  }
  if (estado.terminaEn <= Date.now()) {
    await terminarSesion()
    return leerEstado()
  }
  const alarma = await chrome.alarms.get(ALARMA_FIN)
  if (!alarma) await chrome.alarms.create(ALARMA_FIN, { when: estado.terminaEn })
  return estado
}

// Solo la web de Pausa puede iniciar o terminar sesiones
function vieneDePausa(remitente) {
  return typeof remitente.url === 'string' && remitente.url.startsWith(URL_PAUSA)
}

async function atenderMensaje(mensaje, remitente) {
  switch (mensaje?.tipo) {
    case 'PING':
      return { ok: true, version: chrome.runtime.getManifest().version }

    case 'START_SESSION':
      if (!vieneDePausa(remitente)) throw new Error('No permitido')
      return iniciarSesion(mensaje.datos ?? {})

    case 'END_SESSION':
      if (!vieneDePausa(remitente)) throw new Error('No permitido')
      return terminarSesion()

    case 'GET_STATUS':
      return revisarSesion()

    case 'BLOCKED_HIT':
      return registrarIntento(mensaje.datos?.sitio)

    default:
      throw new Error(`Mensaje desconocido: ${mensaje?.tipo}`)
  }
}

chrome.runtime.onMessage.addListener((mensaje, remitente, responder) => {
  atenderMensaje(mensaje, remitente)
    .then(responder)
    .catch((error) => responder({ error: error.message }))
  return true // le dice a Chrome que vamos a responder después (async)
})

chrome.alarms.onAlarm.addListener((alarma) => {
  if (alarma.name === ALARMA_FIN) terminarSesion()
})

chrome.runtime.onStartup.addListener(revisarSesion)
chrome.runtime.onInstalled.addListener(revisarSesion)
