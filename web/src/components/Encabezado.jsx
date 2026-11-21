// Encabezado de cada módulo: etiqueta, título grande y descripción.
export default function Encabezado({ antetitulo, titulo, descripcion, extra }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pt-8 pb-6">
      <div>
        <p className="antetitulo text-alerta">{antetitulo}</p>
        <h1 className="mt-1 font-serif text-[clamp(28px,3.2vw,42px)] leading-tight tracking-tight">{titulo}</h1>
        {descripcion && <p className="mt-2 text-sm text-suave">{descripcion}</p>}
      </div>
      {extra}
    </div>
  )
}
