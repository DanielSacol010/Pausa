import { useEffect } from 'react'
import { useTemporizador } from '../hooks/useTemporizador.js'
import { formatearReloj } from '../lib/tiempo.js'

// Descanso corto entre sesiones. En la Fase 5 aquí se van a sugerir
// las actividades de desintoxicación.
export default function Descanso({ terminaEn, onTerminar }) {
  const restante = useTemporizador(terminaEn)

  useEffect(() => {
    if (restante <= 0) onTerminar()
  }, [restante, onTerminar])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium text-acento">Descanso</p>
      <p className="numeros mt-4 text-7xl font-light">{formatearReloj(restante)}</p>
      <p className="mt-8 max-w-sm text-suave">
        Levántate, toma agua y mira algo lejos de la pantalla. Mejor sin el celular.
      </p>
      <button onClick={onTerminar} className="mt-10 rounded-lg px-4 py-2 text-sm text-suave hover:text-tinta">
        Saltar descanso
      </button>
    </main>
  )
}
