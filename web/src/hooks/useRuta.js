import { useEffect, useState } from 'react'

// Navegación sencilla con el # de la URL, sin instalar un router.
// "#/documentacion/sueno" -> { seccion: 'documentacion', id: 'sueno' }
function leer() {
  const partes = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  return { seccion: partes[0] || 'enfoque', id: partes[1] ? decodeURIComponent(partes[1]) : null }
}

export function useRuta() {
  const [ruta, setRuta] = useState(leer)

  useEffect(() => {
    const alCambiar = () => setRuta(leer())
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])

  return ruta
}

export function ir(ruta) {
  window.location.hash = `/${ruta}`
}
