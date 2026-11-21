import { useEffect, useRef } from 'react'

// Ignoramos salidas muy cortas (por ejemplo, un clic accidental fuera).
const MINIMO_MS = 1000

// Detecta cuando el usuario se va de Pausa y cuando regresa.
// - visibilitychange: cambió de pestaña o minimizó el navegador
// - blur / focus: se fue a otra aplicación (Discord, WhatsApp, etc.)
// Cuando regresa, llama a alVolver(msFuera) una sola vez.
export function useDistracciones(activa, alVolver) {
  const alVolverRef = useRef(alVolver)
  useEffect(() => {
    alVolverRef.current = alVolver
  })

  useEffect(() => {
    if (!activa) return

    let salioEn = null

    function salir() {
      if (salioEn === null) salioEn = Date.now()
    }

    function volver() {
      if (salioEn === null) return
      if (document.visibilityState !== 'visible' || !document.hasFocus()) return
      const msFuera = Date.now() - salioEn
      salioEn = null
      if (msFuera >= MINIMO_MS) alVolverRef.current(msFuera)
    }

    function alCambiarVisibilidad() {
      if (document.visibilityState === 'hidden') salir()
      else volver()
    }

    window.addEventListener('blur', salir)
    window.addEventListener('focus', volver)
    document.addEventListener('visibilitychange', alCambiarVisibilidad)

    return () => {
      window.removeEventListener('blur', salir)
      window.removeEventListener('focus', volver)
      document.removeEventListener('visibilitychange', alCambiarVisibilidad)
    }
  }, [activa])
}
