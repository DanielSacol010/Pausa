import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import ActividadEnCurso from '../components/ActividadEnCurso.jsx'
import Encabezado from '../components/Encabezado.jsx'
import EnlaceEstudio from '../components/EnlaceEstudio.jsx'
import Filtros from '../components/Filtros.jsx'
import Icono from '../components/Icono.jsx'
import { ACTIVIDADES, CATEGORIAS_ACTIVIDADES } from '../data/actividades.js'
import { ir } from '../hooks/useRuta.js'
import { guardarHechas, leerHechas } from '../lib/actividadesHechas.js'
import { enviarAExtension } from '../lib/extension.js'
import { entrarPantallaCompleta, salirPantallaCompleta } from '../lib/pantallaCompleta.js'
import { SITIOS_BLOQUEADOS } from '../lib/sitios.js'

const COLORES_ICONO = ['bg-[#edf1e3] text-[#597348]', 'bg-alerta-claro text-[#b76540]', 'bg-[#eaf0f0] text-[#527779]']

function sinAcentos(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

// La actividad abierta viene de la URL: #/actividades/respirar
export default function Actividades({ idAbierta }) {
  const [categoria, setCategoria] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [hechas, setHechas] = useState(leerHechas)
  const [enCurso, setEnCurso] = useState(null)

  const abierta = ACTIVIDADES.find((a) => a.id === idAbierta) ?? null

  const lista = ACTIVIDADES.filter(
    (a) =>
      (categoria === 'Todas' || a.categoria === categoria) &&
      sinAcentos(`${a.nombre} ${a.descripcion}`).includes(sinAcentos(busqueda)),
  )

  function marcarHecha(id) {
    const nuevas = hechas.includes(id) ? hechas : [...hechas, id]
    setHechas(nuevas)
    guardarHechas(nuevas)
  }

  // Al empezar: pantalla completa y bloqueo de sitios y notificaciones
  // con la extensión durante lo que dura la actividad (RF-02).
  function empezar() {
    entrarPantallaCompleta()
    enviarAExtension('START_SESSION', {
      terminaEn: Date.now() + abierta.minutos * 60 * 1000,
      intencion: abierta.nombre,
      sitios: SITIOS_BLOQUEADOS,
    }).catch(() => {})
    setEnCurso(abierta)
    ir('actividades')
  }

  function terminar(realizada) {
    salirPantallaCompleta()
    enviarAExtension('END_SESSION').catch(() => {})
    if (realizada) marcarHecha(enCurso.id)
    setEnCurso(null)
  }

  return (
    <div className="aparecer mx-auto max-w-6xl px-5 pb-10 md:px-10">
      <Encabezado
        antetitulo="Menos ruido, más presencia"
        titulo="Haz espacio para tu atención."
        descripcion="Pequeñas prácticas para reconectar con lo que estás haciendo."
        extra={
          <span className="rounded-full bg-acento-claro px-3.5 py-1.5 text-xs text-acento">
            {hechas.length} de {ACTIVIDADES.length} practicadas
          </span>
        }
      />

      <div className="my-4 flex flex-wrap items-center justify-between gap-3">
        <Filtros opciones={CATEGORIAS_ACTIVIDADES} valor={categoria} onCambiar={setCategoria} etiqueta="Filtrar actividades" />
        <label className="flex w-full items-center gap-2 rounded-lg border border-linea bg-tarjeta px-3 py-2 sm:w-56">
          <Icono nombre="buscar" className="h-4 w-4 text-suave" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar una actividad…"
            className="w-full bg-transparent text-xs outline-none"
            aria-label="Buscar actividad"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((a, i) => {
          const hecha = hechas.includes(a.id)
          return (
            <a
              key={a.id}
              href={`#/actividades/${a.id}`}
              className="group flex flex-col rounded-2xl border border-linea bg-tarjeta p-5 transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_#213d3412]"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${COLORES_ICONO[i % 3]}`}>
                  <Icono nombre={a.icono} />
                </span>
                <span className="flex items-center gap-1 text-[11px] text-suave">
                  <Icono nombre="reloj" className="h-3.5 w-3.5" />
                  {a.minutos} min
                </span>
              </div>
              <span className="antetitulo text-suave">{a.categoria}</span>
              <h3 className="mt-1.5 font-serif text-xl leading-snug">{a.nombre}</h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-suave">{a.descripcion}</p>
              <div className="mt-5 flex items-center justify-between border-t border-[#f0f1ec] pt-3.5 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  {hecha ? 'Volver a practicar' : 'Ver actividad'}
                  <Icono nombre="flecha" className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
                {hecha && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-acento text-white" title="Practicada">
                    <Icono nombre="check" className="h-4 w-4" />
                  </span>
                )}
              </div>
            </a>
          )
        })}
        {lista.length === 0 && (
          <p className="col-span-full py-12 text-center text-suave">No encontramos esa actividad. Prueba con otra palabra.</p>
        )}
      </div>

      <p className="mt-8 border-t border-linea pt-4 text-[11px] text-suave">
        Los tiempos son orientativos. Aquí, «desintoxicación» significa reducir distracciones digitales, no eliminar
        toxinas ni reparar un daño cerebral.
      </p>

      {abierta && !enCurso && (
        <DetalleActividad actividad={abierta} onCerrar={() => ir('actividades')} onEmpezar={empezar} />
      )}

      {enCurso && (
        <ActividadEnCurso
          actividad={enCurso}
          onRealizada={() => terminar(true)}
          onSalir={() => terminar(false)}
        />
      )}
    </div>
  )
}

function DetalleActividad({ actividad, onCerrar, onEmpezar }) {
  useEffect(() => {
    const alPresionar = (e) => e.key === 'Escape' && onCerrar()
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  }, [onCerrar])

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-[#142f2877] p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-actividad"
        className="aparecer max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-papel p-7 sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="antetitulo text-alerta">
              {actividad.categoria} · {actividad.minutos} minutos sugeridos
            </p>
            <h2 id="titulo-actividad" className="mt-2 font-serif text-3xl leading-tight">
              {actividad.nombre}
            </h2>
          </div>
          <button
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-acento-claro hover:bg-linea"
          >
            <Icono nombre="cerrar" className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-sm text-suave">{actividad.descripcion}</p>

        <ol className="mt-5 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed">
          {actividad.pasos.map((paso) => (
            <li key={paso} className="pl-1">
              {paso}
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-xl bg-acento-claro px-4 py-3.5">
          <EnlaceEstudio id={actividad.estudio} />
        </div>

        <button
          onClick={onEmpezar}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-acento py-4 font-semibold text-white transition hover:bg-[#163d32]"
        >
          Empezar con la actividad
          <Icono nombre="flecha" className="h-4 w-4" />
        </button>
      </div>
    </div>,
    document.body,
  )
}
