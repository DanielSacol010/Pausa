import { SITIOS_BLOQUEADOS } from '../lib/sitios.js'

export default function EstadoExtension({ conectada }) {
  if (conectada === null) {
    return <span className="text-sm text-suave">Buscando la extensión…</span>
  }

  if (conectada) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-acento-claro px-3 py-1 text-sm text-acento">
        <span className="h-2 w-2 rounded-full bg-acento" />
        Extensión activa · {SITIOS_BLOQUEADOS.length} sitios se bloquearán
      </span>
    )
  }

  return (
    <a
      href="#/extension"
      className="inline-flex items-center gap-2 rounded-full bg-alerta-claro px-3 py-1 text-sm text-alerta hover:brightness-95"
    >
      <span className="h-2 w-2 rounded-full bg-alerta" />
      Sin extensión: no se bloquearán sitios · <strong className="font-semibold underline">Instalarla</strong>
    </a>
  )
}
