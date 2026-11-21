// Guarda qué actividades ya practicó el usuario (en este navegador)
const CLAVE = 'pausa:actividades-hechas'

export function leerHechas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? []
  } catch {
    return []
  }
}

export function guardarHechas(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista))
}
