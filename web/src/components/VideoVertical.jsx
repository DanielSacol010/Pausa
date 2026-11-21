import { useEffect, useRef, useState } from 'react'
import Icono from './Icono.jsx'

function formatear(seg) {
  const s = Math.floor(seg || 0)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// Video vertical 9:16 con controles propios: reproducir, pausar, reiniciar,
// sonido y barra de progreso (se puede tocar para adelantar o regresar).
// Solo se reproduce el video que está en pantalla.
export default function VideoVertical({ video, activo, sonido, onSonido }) {
  const ref = useRef(null)
  const [reproduciendo, setReproduciendo] = useState(false)
  const [tiempo, setTiempo] = useState(0)
  const [duracion, setDuracion] = useState(video.duracion)
  const [terminado, setTerminado] = useState(false)

  // Reproduce cuando entra en pantalla y pausa cuando sale
  useEffect(() => {
    const v = ref.current
    if (activo) {
      v.currentTime = 0
      v.play().catch(() => setReproduciendo(false))
    } else {
      v.pause()
    }
  }, [activo])

  useEffect(() => {
    ref.current.muted = !sonido
  }, [sonido])

  function alternar() {
    const v = ref.current
    if (v.paused || v.ended) v.play().catch(() => {})
    else v.pause()
  }

  function reiniciar() {
    const v = ref.current
    v.currentTime = 0
    v.play().catch(() => {})
  }

  function buscar(e) {
    const caja = e.currentTarget.getBoundingClientRect()
    const k = Math.min(1, Math.max(0, (e.clientX - caja.left) / caja.width))
    ref.current.currentTime = k * (ref.current.duration || duracion)
  }

  return (
    <div className="relative aspect-[9/16] h-full max-h-[780px] overflow-hidden rounded-[28px] bg-noche shadow-[0_20px_60px_#153b3340]">
      <video
        ref={ref}
        src={video.src}
        poster={video.poster}
        playsInline
        muted={!sonido}
        preload="metadata"
        className="h-full w-full object-cover"
        onPlay={() => {
          setReproduciendo(true)
          setTerminado(false)
        }}
        onPause={() => setReproduciendo(false)}
        onEnded={() => setTerminado(true)}
        onTimeUpdate={(e) => setTiempo(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuracion(e.currentTarget.duration)}
      />

      {/* Área para tocar y pausar */}
      <button
        onClick={alternar}
        className="absolute inset-0 flex items-center justify-center"
        aria-label={reproduciendo ? 'Pausar video' : 'Reproducir video'}
      >
        {!reproduciendo && (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/85 text-acento shadow-lg">
            <Icono nombre={terminado ? 'reiniciar' : 'play'} className="h-7 w-7" />
          </span>
        )}
      </button>

      {/* Aviso de sonido */}
      {!sonido && activo && (
        <button
          onClick={() => onSonido(true)}
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs text-white backdrop-blur hover:bg-black/60"
        >
          <Icono nombre="silencio" className="h-4 w-4" />
          Toca para activar el sonido
        </button>
      )}

      {/* Controles */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 pb-3 pt-10 text-white">
        <div
          className="group mb-2 h-4 cursor-pointer py-1.5"
          onClick={buscar}
          role="slider"
          aria-label="Avance del video"
          aria-valuemin={0}
          aria-valuemax={Math.round(duracion)}
          aria-valuenow={Math.round(tiempo)}
        >
          <div className="h-1 overflow-hidden rounded-full bg-white/30 group-hover:h-1.5">
            <div className="h-full bg-white" style={{ width: `${(tiempo / (duracion || 1)) * 100}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <BotonControl onClick={alternar} etiqueta={reproduciendo ? 'Pausar' : 'Reproducir'}>
            <Icono nombre={reproduciendo ? 'pausa' : 'play'} />
          </BotonControl>
          <BotonControl onClick={reiniciar} etiqueta="Reiniciar">
            <Icono nombre="reiniciar" />
          </BotonControl>
          <BotonControl onClick={() => onSonido(!sonido)} etiqueta={sonido ? 'Silenciar' : 'Activar sonido'}>
            <Icono nombre={sonido ? 'sonido' : 'silencio'} />
          </BotonControl>
          <span className="numeros ml-auto pr-2 text-xs text-white/80">
            {formatear(tiempo)} / {formatear(duracion)}
          </span>
        </div>
      </div>
    </div>
  )
}

function BotonControl({ onClick, etiqueta, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={etiqueta}
      title={etiqueta}
      className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/15"
    >
      {children}
    </button>
  )
}
