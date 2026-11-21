import Icono from './Icono.jsx'
import { buscarEstudio } from '../data/estudios.js'

// Enlace a la página de un estudio dentro de Pausa (RF-09).
export default function EnlaceEstudio({ id, claro = false, onClick }) {
  const estudio = buscarEstudio(id)
  if (!estudio) return null
  return (
    <a
      href={`#/documentacion/${estudio.id}`}
      onClick={onClick}
      className={`group inline-flex items-center gap-2 text-sm ${claro ? 'text-white/85 hover:text-white' : 'text-acento'}`}
    >
      <Icono nombre="libro" className="h-4 w-4" />
      <span>
        Basado en: <strong className="font-semibold underline-offset-2 group-hover:underline">{estudio.titulo}</strong>
        <span className={claro ? 'text-white/60' : 'text-suave'}> · {estudio.autores}, {estudio.anio}</span>
      </span>
      <Icono nombre="flecha" className="h-4 w-4 transition group-hover:translate-x-0.5" />
    </a>
  )
}
