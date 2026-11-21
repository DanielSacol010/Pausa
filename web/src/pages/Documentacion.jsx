import { useState } from 'react'
import Encabezado from '../components/Encabezado.jsx'
import Filtros from '../components/Filtros.jsx'
import Icono from '../components/Icono.jsx'
import { CATEGORIAS_ESTUDIOS, ESTUDIOS } from '../data/estudios.js'

// Biblioteca: título y un resumen muy corto de cada estudio (RF-08).
export default function Documentacion() {
  const [categoria, setCategoria] = useState('Todos')
  const lista = ESTUDIOS.filter((e) => categoria === 'Todos' || e.categoria === categoria)

  return (
    <div className="aparecer mx-auto max-w-6xl px-5 pb-10 md:px-10">
      <Encabezado
        antetitulo="La ciencia detrás de la pausa"
        titulo="Hábitos con fundamento."
        descripcion="Los estudios en los que se basan las actividades y los videos, explicados en palabras sencillas."
        extra={<span className="rounded-full bg-acento-claro px-3.5 py-1.5 text-xs text-acento">{ESTUDIOS.length} investigaciones</span>}
      />

      <div className="mb-6 flex gap-3 rounded-xl bg-[#edf0e6] px-5 py-4 text-xs text-[#54664d]">
        <Icono nombre="libro" className="mt-0.5 h-4 w-4" />
        <p>
          <strong>Mejorar la atención es distinto de «revertir un daño».</strong> Estos trabajos evalúan intervenciones
          concretas. No demuestran que toda la población haya perdido atención de forma permanente.
        </p>
      </div>

      <Filtros opciones={CATEGORIAS_ESTUDIOS} valor={categoria} onCambiar={setCategoria} etiqueta="Filtrar estudios" />

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {lista.map((e) => (
          <a
            key={e.id}
            href={`#/documentacion/${e.id}`}
            className="group flex flex-col rounded-2xl border border-linea bg-tarjeta p-6 transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_#213d3412]"
          >
            <span className="antetitulo text-alerta">{e.categoria}</span>
            <h2 className="mt-2 font-serif text-2xl leading-snug">{e.titulo}</h2>
            <p className="mt-1 text-xs text-suave">
              {e.autores} · {e.anio}
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed">{e.resumenCorto}</p>
            <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-acento">
              Leer la explicación
              <Icono nombre="flecha" className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
