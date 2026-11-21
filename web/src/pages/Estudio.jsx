import { useEffect, useState } from 'react'
import Icono from '../components/Icono.jsx'
import { ACTIVIDADES } from '../data/actividades.js'
import { buscarEstudio } from '../data/estudios.js'
import { VIDEOS } from '../data/videos.js'

// Página de un estudio: explicado en palabras sencillas, con sus límites,
// lo que lo usa dentro de Pausa y al final el enlace a la fuente original (RF-08, RF-09).
export default function Estudio({ id }) {
  const estudio = buscarEstudio(id)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [id])

  if (!estudio) {
    return (
      <div className="px-10 py-16">
        <p>No encontramos ese estudio.</p>
        <a href="#/documentacion" className="mt-4 inline-block text-acento underline">
          Volver a la biblioteca
        </a>
      </div>
    )
  }

  const actividades = ACTIVIDADES.filter((a) => a.estudio === estudio.id)
  const videos = VIDEOS.filter((v) => v.estudio === estudio.id)

  async function copiarCita() {
    try {
      await navigator.clipboard.writeText(estudio.cita)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      // si el navegador no deja copiar, la cita igual está visible abajo
    }
  }

  return (
    <article className="aparecer mx-auto max-w-3xl px-5 pb-16 md:px-10">
      <a href="#/documentacion" className="mt-8 inline-flex items-center gap-2 text-sm text-suave hover:text-tinta">
        <Icono nombre="atras" className="h-4 w-4" />
        Biblioteca
      </a>

      <p className="antetitulo mt-8 text-alerta">{estudio.categoria}</p>
      <h1 className="mt-2 font-serif text-[clamp(30px,4vw,44px)] leading-tight tracking-tight">{estudio.titulo}</h1>
      <p className="mt-3 text-sm text-suave">
        {estudio.autores} · {estudio.anio} · <em>{estudio.revista}</em>
      </p>
      <span className="mt-3 inline-block rounded-md bg-acento-claro px-2 py-0.5 text-[11px] text-acento">{estudio.diseno}</span>

      <p className="mt-8 border-l-2 border-acento pl-4 font-serif text-xl leading-relaxed">{estudio.resumenCorto}</p>

      <Seccion titulo="¿Qué hicieron?">{estudio.queHicieron}</Seccion>
      <Seccion titulo="¿Qué encontraron?">{estudio.queEncontraron}</Seccion>
      <Seccion titulo="Lo que este estudio no dice">{estudio.limites}</Seccion>

      {(actividades.length > 0 || videos.length > 0) && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl">En Pausa lo usamos en</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {actividades.map((a) => (
              <a
                key={a.id}
                href={`#/actividades/${a.id}`}
                className="flex items-center gap-3 rounded-xl border border-linea bg-tarjeta p-4 hover:bg-acento-claro"
              >
                <Icono nombre="hoja" className="h-5 w-5 text-acento" />
                <span className="text-sm">
                  <span className="block text-[11px] text-suave">Actividad</span>
                  {a.nombre}
                </span>
              </a>
            ))}
            {videos.map((v) => (
              <a
                key={v.id}
                href={`#/videos/${v.id}`}
                className="flex items-center gap-3 rounded-xl border border-linea bg-tarjeta p-4 hover:bg-acento-claro"
              >
                <Icono nombre="play" className="h-5 w-5 text-acento" />
                <span className="text-sm">
                  <span className="block text-[11px] text-suave">Video</span>
                  {v.titulo}
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 rounded-2xl border border-linea bg-tarjeta p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold">Referencia bibliográfica</h2>
          <button onClick={copiarCita} className="text-xs font-semibold text-acento hover:underline">
            {copiado ? 'Cita copiada' : 'Copiar cita'}
          </button>
        </div>
        <p className="mt-3 break-words text-xs leading-relaxed text-suave">{estudio.cita}</p>
      </section>

      <a
        href={estudio.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-acento py-4 font-semibold text-white transition hover:bg-[#163d32]"
      >
        Leer el estudio original
        <Icono nombre="externo" className="h-4 w-4" />
      </a>
      <p className="mt-2 text-center text-[11px] text-suave">Se abre en otra pestaña, fuera de Pausa.</p>
    </article>
  )
}

function Seccion({ titulo, children }) {
  return (
    <section className="mt-8">
      <h2 className="font-serif text-2xl">{titulo}</h2>
      <p className="mt-2 leading-relaxed">{children}</p>
    </section>
  )
}
