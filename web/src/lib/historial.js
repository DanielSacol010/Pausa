// Guarda las sesiones terminadas y la sesión en curso en localStorage.
// Así, si se recarga la página a media sesión, no se pierde nada.

const CLAVE_HISTORIAL = 'pausa:historial'
const CLAVE_SESION = 'pausa:sesion-actual'

function leer(clave, porDefecto) {
  try {
    const texto = localStorage.getItem(clave)
    return texto ? JSON.parse(texto) : porDefecto
  } catch {
    return porDefecto
  }
}

export function leerHistorial() {
  return leer(CLAVE_HISTORIAL, [])
}

export function agregarAlHistorial(sesion) {
  const historial = [sesion, ...leerHistorial()].slice(0, 50)
  localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial))
  return historial
}

export function leerSesionActual() {
  return leer(CLAVE_SESION, null)
}

export function guardarSesionActual(sesion) {
  if (sesion) localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  else localStorage.removeItem(CLAVE_SESION)
}
