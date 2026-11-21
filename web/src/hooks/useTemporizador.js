import { useEffect, useState } from 'react'

// Devuelve cuántos milisegundos faltan para `terminaEn`.
// Se calcula con la hora real (Date.now) en vez de restar de 1 en 1,
// así el reloj no se atrasa si el navegador congela la pestaña.
export function useTemporizador(terminaEn) {
  const [restante, setRestante] = useState(() => terminaEn - Date.now())

  useEffect(() => {
    setRestante(terminaEn - Date.now())
    const intervalo = setInterval(() => setRestante(terminaEn - Date.now()), 250)
    return () => clearInterval(intervalo)
  }, [terminaEn])

  return Math.max(0, restante)
}
