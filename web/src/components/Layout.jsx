import Icono from './Icono.jsx'

const MODULOS = [
  { id: 'enfoque', texto: 'Sesión de enfoque', corto: 'Enfoque', icono: 'reloj' },
  { id: 'videos', texto: 'Videos', corto: 'Videos', icono: 'play' },
  { id: 'actividades', texto: 'Actividades de desintoxicación', corto: 'Actividades', icono: 'hoja' },
  { id: 'documentacion', texto: 'Documentación científica', corto: 'Documentación', icono: 'libro' },
]

function Marca() {
  return (
    <a href="#/enfoque" className="flex items-center gap-2.5 text-[27px] font-semibold tracking-tight">
      <span className="flex h-8 w-8 items-center justify-center gap-[5px] rounded-full bg-acento" aria-hidden="true">
        <span className="h-3.5 w-1 rounded bg-[#edf1d5]" />
        <span className="h-3.5 w-1 rounded bg-[#edf1d5]" />
      </span>
      <span>
        pausa<span className="text-alerta">.</span>
      </span>
    </a>
  )
}

export default function Layout({ seccion, extensionConectada, children }) {
  return (
    <div className="md:grid md:min-h-screen md:grid-cols-[250px_minmax(0,1fr)]">
      {/* Menú lateral en computadora */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-linea bg-lateral px-5 py-8 md:flex">
        <Marca />
        <p className="mt-1.5 mb-10 pl-11 text-xs text-suave">Vuelve a lo que importa.</p>
        <p className="antetitulo mb-3 px-3 text-suave">Tu espacio de atención</p>
        <nav className="grid gap-1.5" aria-label="Módulos">
          {MODULOS.map((m) => {
            const activo = m.id === seccion
            return (
              <a
                key={m.id}
                href={`#/${m.id}`}
                aria-current={activo ? 'page' : undefined}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition ${
                  activo ? 'bg-acento text-white' : 'hover:bg-acento-claro'
                }`}
              >
                <Icono nombre={m.icono} />
                {m.texto}
              </a>
            )
          })}
        </nav>
        <a
          href="#/extension"
          className={`mt-auto flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs transition ${
            seccion === 'extension' ? 'border-acento bg-acento-claro' : 'border-linea hover:bg-acento-claro'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              extensionConectada ? 'bg-acento' : extensionConectada === false ? 'bg-alerta' : 'bg-linea'
            }`}
          />
          <span>
            <span className="block font-semibold">Extensión de Chrome</span>
            <span className="text-suave">{extensionConectada ? 'Activa' : 'Instalar para bloquear sitios'}</span>
          </span>
        </a>
        <div className="mt-5 px-3 text-xs text-suave">
          <p>Un paso pequeño. Un poco más de presencia.</p>
          <p className="mt-3 text-[10px] tracking-widest">PAUSA · DEMO</p>
        </div>
      </aside>

      {/* Barra superior en celular */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-linea bg-lateral px-4 md:hidden">
        <Marca />
        <a href="#/extension" className="flex items-center gap-1.5 text-xs text-suave">
          <span className={`h-2 w-2 rounded-full ${extensionConectada ? 'bg-acento' : 'bg-alerta'}`} />
          Extensión
        </a>
      </header>
      <nav
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-linea bg-lateral md:hidden"
        aria-label="Módulos"
      >
        {MODULOS.map((m) => (
          <a
            key={m.id}
            href={`#/${m.id}`}
            className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${
              m.id === seccion ? 'font-semibold text-acento' : 'text-suave'
            }`}
          >
            <Icono nombre={m.icono} className="h-5 w-5" />
            {m.corto}
          </a>
        ))}
      </nav>

      <main className="min-w-0 pb-16 md:pb-0">{children}</main>
    </div>
  )
}
