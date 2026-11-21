export default function Filtros({ opciones, valor, onCambiar, etiqueta }) {
  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label={etiqueta}>
      {opciones.map((op) => (
        <button
          key={op}
          onClick={() => onCambiar(op)}
          aria-pressed={op === valor}
          className={`min-h-9 rounded-full px-3.5 text-xs transition ${
            op === valor ? 'bg-tinta text-white' : 'hover:bg-acento-claro'
          }`}
        >
          {op}
        </button>
      ))}
    </div>
  )
}
