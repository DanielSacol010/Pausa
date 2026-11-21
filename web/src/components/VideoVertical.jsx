import { useEffect, useState } from 'react'
import Icono from './Icono.jsx'
import { callar, hablar } from '../lib/voz.js'

const FONDOS = {
  verde: 'from-[#163d32] via-[#214e41] to-[#4b7d5e]',
  naranja: 'from-[#6d2f18] via-[#9c4424] to-[#cf7b4f]',
  azul: 'from-[#1d3f47] via-[#2c5a63] to-[#5b8f93]',
}

function formatear(seg) {
  const s = Math.floor(seg)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// Demo de un video vertical 9:16. En lugar de un archivo .mp4 muestra las
// escenas del guion con animación y, si el sonido está activo, las narra
// con la voz del navegador. Cuando tengan los videos de IA, este componente
// se cambia por un <video> con los mismos controles.
export default function VideoVertical({ video, activo, sonido, onSonido }) {
  const [tiempo, setTiempo] = useState(0)
  const [reproduciendo, setReproduciendo] = useState(false)
  const terminado = tiempo >= video.duracion

  // Se reproduce solo cuando está en pantalla
  useEffect(() => {
    if (activo) {
      setTiempo(0)
      setReproduciendo(true)
    } else {
      setReproduciendo(false)
    }
  }, [activo])

  // Avanza el tiempo
  useEffect(() => {
    if (!reproduciendo) return
    let anterior = performance.now()
    const intervalo = setInterval(() => {
      const ahora = performance.now()
      const delta = (ahora - anterior) / 1000
      anterior = ahora
      setTiempo((t) => Math.min(video.duracion, t + delta))
    }, 100)
    return () => clearInterval(intervalo)
  }, [reproduciendo, video.duracion])

  useEffect(() => {
    if (terminado) setReproduciendo(false)
  }, [terminado])

  let indice = 0
  video.escenas.forEach((escena, i) => {
    if (escena.seg <= tiempo) indice = i
  })
  const escena = video.escenas[indice]

  // Narración de cada escena
  useEffect(() => {
    if (!activo || !reproduciendo || !sonido) return
    hablar(escena.texto)
    return () => callar()
  }, [activo, reproduciendo, sonido, escena.texto])

  function alternar() {
    if (terminado) {
      setTiempo(0)
      setReproduciendo(true)
    } else {
      setReproduciendo(!reproduciendo)
    }
  }

  function reiniciar() {
    setTiempo(0)
    setReproduciendo(true)
  }

  return (
    <div
      className={`relative aspect-[9/16] h-full max-h-[780px] overflow-hidden rounded-[28px] bg-gradient-to-b ${FONDOS[video.color]} text-white shadow-[0_20px_60px_#153b3340]`}
    >
      {/* Círculos decorativos */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="flotar absolute -left-16 top-24 h-72 w-72 rounded-full border border-white/25" />
        <div className="flotar absolute -right-20 bottom-32 h-80 w-80 rounded-full border border-white/20 [animation-delay:-3s]" />
      </div>

      {/* Barra de progreso */}
      <div className="absolute inset-x-4 top-4 h-1 overflow-hidden rounded-full bg-white/25">
        <div className="h-full bg-white" style={{ width: `${(tiempo / video.duracion) * 100}%` }} />
      </div>

      <p className="absolute left-4 top-8 rounded-full bg-black/20 px-2.5 py-1 text-[10px] tracking-wide text-white/80">
        Vista previa · el video final será generado con IA
      </p>

      {/* Área que se toca para pausar o reproducir */}
      <button
        onClick={alternar}
        className="absolute inset-0 flex flex-col justify-center px-7 text-left"
        aria-label={reproduciendo ? 'Pausar video' : 'Reproducir video'}
      >
        <p className="font-serif text-[15px] leading-snug text-white/75">{video.titulo}</p>
        <p key={indice} className="aparecer mt-5 font-serif text-[clamp(22px,3.4vh,32px)] leading-tight">
          {escena.texto}
        </p>
        {!reproduciendo && (
          <span className="mx-auto mt-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/85 text-acento">
            <Icono nombre={terminado ? 'reiniciar' : 'play'} className="h-6 w-6" />
          </span>
        )}
      </button>

      {/* Controles */}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/45 to-transparent px-3 pb-3 pt-10">
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
          {formatear(tiempo)} / {formatear(video.duracion)}
        </span>
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
