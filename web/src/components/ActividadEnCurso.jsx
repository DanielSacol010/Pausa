import { useState } from 'react'
import { createPortal } from 'react-dom'
import Icono from './Icono.jsx'
import { useTemporizador } from '../hooks/useTemporizador.js'
import { formatearReloj } from '../lib/tiempo.js'

// Pantalla oscura mientras se hace una actividad (RF-06).
// Esconde todo lo demás y deja solo el tiempo, una pestaña con los pasos
// y el botón "Actividad realizada". El bloqueo con la extensión y la
// pantalla completa se activan en Actividades.jsx al dar clic en "Empezar".
export default function ActividadEnCurso({ actividad, onRealizada, onSalir }) {
  const [terminaEn, setTerminaEn] = useState(() => Date.now() + actividad.minutos * 60 * 1000)
  const [pausadoCon, setPausadoCon] = useState(null) // ms restantes al pausar
  const [verPasos, setVerPasos] = useState(true)
  const restanteVivo = useTemporizador(terminaEn)
  const restante = pausadoCon ?? restanteVivo
  const cumplido = restante <= 0


  function alternarPausa() {
    if (pausadoCon === null) {
      setPausadoCon(restanteVivo)
    } else {
      setTerminaEn(Date.now() + pausadoCon)
      setPausadoCon(null)
    }
  }

  // createPortal la pone directo en <body>, encima de todo (incluido el menú)
  return createPortal(
    <div className="aparecer fixed inset-0 z-50 flex flex-col bg-noche text-white">
      <div className="flex items-center justify-between px-6 py-5 text-sm text-white/60">
        <span>
          <span className="antetitulo mr-2 text-[#c9d8b8]">{actividad.categoria}</span>
          {actividad.nombre}
        </span>
        <button onClick={onSalir} className="rounded-lg px-3 py-1.5 hover:bg-white/10 hover:text-white">
          Salir
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-white/50">{cumplido ? 'Tiempo cumplido' : pausadoCon !== null ? 'En pausa' : 'Un momento para ti'}</p>
        <p className="numeros mt-2 text-[clamp(72px,14vw,150px)] font-extralight leading-none tracking-tight">
          {formatearReloj(restante)}
        </p>
        {!cumplido && (
          <button onClick={alternarPausa} className="mt-6 text-sm text-white/60 hover:text-white">
            {pausadoCon === null ? 'Pausar' : 'Continuar'}
          </button>
        )}

        <button
          onClick={onRealizada}
          className="mt-12 inline-flex items-center gap-2 rounded-xl bg-[#e9efdf] px-6 py-3.5 font-semibold text-acento transition hover:bg-white"
        >
          <Icono nombre="check" />
          Actividad realizada
        </button>
      </div>

      {/* Pestaña con los pasos */}
      <div className="absolute bottom-6 left-6 w-[min(360px,calc(100%-3rem))]">
        <button
          onClick={() => setVerPasos(!verPasos)}
          className="flex items-center gap-2 rounded-t-xl bg-white/10 px-4 py-2 text-sm text-white/80 hover:text-white"
          aria-expanded={verPasos}
        >
          <Icono nombre="lista" className="h-4 w-4" />
          Pasos
          <Icono nombre={verPasos ? 'abajo' : 'arriba'} className="h-4 w-4" />
        </button>
        {verPasos && (
          <ol className="list-decimal space-y-2 rounded-b-xl rounded-tr-xl bg-white/10 py-4 pl-9 pr-5 text-sm leading-relaxed text-white/85">
            {actividad.pasos.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ol>
        )}
      </div>
    </div>,
    document.body,
  )
}
