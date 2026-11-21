import { useEffect, useState } from 'react'
import { hayExtension } from '../lib/extension.js'

// Revisa cada pocos segundos si la extensión está instalada y respondiendo.
// null = todavía no sabemos, true = conectada, false = no está.
export function useExtension() {
  const [conectada, setConectada] = useState(null)

  useEffect(() => {
    let cancelado = false

    async function revisar() {
      const ok = await hayExtension()
      if (!cancelado) setConectada(ok)
    }

    revisar()
    const intervalo = setInterval(revisar, 4000)
    return () => {
      cancelado = true
      clearInterval(intervalo)
    }
  }, [])

  return conectada
}
