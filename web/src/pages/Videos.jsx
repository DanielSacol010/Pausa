import { useEffect, useRef, useState } from 'react'
import EnlaceEstudio from '../components/EnlaceEstudio.jsx'
import Icono from '../components/Icono.jsx'
import VideoVertical from '../components/VideoVertical.jsx'
import { VIDEOS } from '../data/videos.js'

// Feed vertical estilo TikTok: cada video ocupa toda la altura y se pasa
// al siguiente deslizando (o con las flechas del teclado).
export default function Videos({ idInicial }) {
  const [activo, setActivo] = useState(() => Math.max(0, VIDEOS.findIndex((v) => v.id === idInicial)))
  const [sonido, setSonido] = useState(false)
  const contenedor = useRef(null)

  // Detecta qué video está en pantalla
  useEffect(() => {
    const raiz = contenedor.current
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setActivo(Number(e.target.dataset.indice))
        })
      },
      { root: raiz, threshold: 0.6 },
    )
    raiz.querySelectorAll('[data-indice]').forEach((el) => observador.observe(el))
    return () => observador.disconnect()
  }, [])

  // Si se llegó desde un estudio, abre directo ese video
  useEffect(() => {
    const i = VIDEOS.findIndex((v) => v.id === idInicial)
    if (i >= 0) contenedor.current.children[i]?.scrollIntoView({ block: 'start' })
  }, [idInicial])

  function irA(i) {
    const destino = Math.min(VIDEOS.length - 1, Math.max(0, i))
    contenedor.current.children[destino]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    function alPresionar(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        irA(activo + 1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        irA(activo - 1)
      }
    }
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  })

  return (
    <div className="relative h-[calc(100dvh-7.5rem)] md:h-dvh">
      <div ref={contenedor} className="sin-barra h-full snap-y snap-mandatory overflow-y-scroll">
        {VIDEOS.map((video, i) => (
          <section
            key={video.id}
            data-indice={i}
            className="flex h-full snap-start snap-always flex-col items-center justify-center gap-4 px-4 py-5"
          >
            <div className="min-h-0 flex-1">
              <VideoVertical video={video} activo={i === activo} sonido={sonido} onSonido={setSonido} />
            </div>
            <div className="max-w-lg text-center">
              <EnlaceEstudio id={video.estudio} />
            </div>
          </section>
        ))}
      </div>

      {/* Flechas para cambiar de video en computadora */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:flex">
        <button
          onClick={() => irA(activo - 1)}
          disabled={activo === 0}
          aria-label="Video anterior"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-linea bg-tarjeta hover:bg-acento-claro disabled:opacity-30"
        >
          <Icono nombre="arriba" />
        </button>
        <span className="numeros text-center text-xs text-suave">
          {activo + 1}/{VIDEOS.length}
        </span>
        <button
          onClick={() => irA(activo + 1)}
          disabled={activo === VIDEOS.length - 1}
          aria-label="Siguiente video"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-linea bg-tarjeta hover:bg-acento-claro disabled:opacity-30"
        >
          <Icono nombre="abajo" />
        </button>
      </div>

      <p className="pointer-events-none absolute left-8 top-8 hidden max-w-[220px] text-xs text-suave lg:block">
        <span className="antetitulo block text-alerta">Videos</span>
        Desliza hacia abajo o usa las flechas del teclado para ver el siguiente.
      </p>
    </div>
  )
}
