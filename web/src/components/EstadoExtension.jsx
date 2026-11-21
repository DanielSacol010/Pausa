import { useState } from 'react'
import { SITIOS_BLOQUEADOS } from '../lib/sitios.js'

export default function EstadoExtension({ conectada }) {
  const [verAyuda, setVerAyuda] = useState(false)

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
    <div className="text-sm">
      <button
        type="button"
        onClick={() => setVerAyuda(!verAyuda)}
        className="inline-flex items-center gap-2 rounded-full bg-[#f6e3d6] px-3 py-1 text-alerta"
      >
        <span className="h-2 w-2 rounded-full bg-alerta" />
        Extensión no detectada: no se bloquearán sitios
      </button>
      {verAyuda && (
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-suave">
          <li>Abre <code>chrome://extensions</code> en Chrome.</li>
          <li>Activa el «Modo de desarrollador» (arriba a la derecha).</li>
          <li>Haz clic en «Cargar descomprimida» y elige la carpeta <code>extension</code> del proyecto.</li>
          <li>Recarga esta página.</li>
        </ol>
      )}
    </div>
  )
}
