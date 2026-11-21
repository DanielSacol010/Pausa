import { useState } from 'react'
import Encabezado from '../components/Encabezado.jsx'
import Icono from '../components/Icono.jsx'

const ES_EDGE = navigator.userAgent.includes('Edg/')
const ES_CELULAR = /Android|iPhone|iPad/i.test(navigator.userAgent)
const DIRECCION = ES_EDGE ? 'edge://extensions' : 'chrome://extensions'

// Página para instalar la extensión paso a paso. Revisa sola si la
// extensión ya responde (useExtension en App) y se pone en verde.
export default function InstalarExtension({ conectada }) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(DIRECCION)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      // si no deja copiar, la dirección igual se ve en pantalla
    }
  }

  return (
    <div className="aparecer mx-auto max-w-3xl px-5 pb-16 md:px-10">
      <Encabezado
        antetitulo="Bloqueo de sitios"
        titulo="Instala la extensión de Pausa."
        descripcion="Es lo que bloquea YouTube, Instagram, TikTok y sus notificaciones mientras te enfocas. Toma unos 2 minutos."
      />

      <Estado conectada={conectada} />

      {ES_CELULAR && (
        <p className="mt-4 rounded-xl bg-alerta-claro px-4 py-3 text-sm text-alerta">
          La extensión solo funciona en computadora (Chrome, Edge o Brave). Abre este link desde tu compu para instalarla.
        </p>
      )}

      {!conectada && (
        <ol className="mt-8 space-y-4">
          <Paso numero={1} titulo="Descarga la extensión">
            <a
              href="/pausa-extension.zip"
              download="pausa-extension.zip"
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-acento px-5 py-3 font-semibold text-white transition hover:bg-[#163d32]"
            >
              <Icono nombre="abajo" />
              Descargar extensión (.zip)
            </a>
          </Paso>

          <Paso numero={2} titulo="Descomprime el archivo">
            Abre tu carpeta de Descargas, haz clic derecho sobre <Chip>pausa-extension.zip</Chip> y elige{' '}
            <Chip>Extraer todo…</Chip>. Te queda una carpeta llamada <Chip>pausa-extension</Chip>.
            <p className="mt-2 text-xs text-suave">
              Muévela a un lugar donde no la vayas a borrar, como Documentos: el navegador la usa desde ahí.
            </p>
          </Paso>

          <Paso numero={3} titulo="Abre la página de extensiones">
            Abre una pestaña nueva, pega esta dirección en la barra de arriba y presiona Enter:
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <code className="rounded-lg border border-linea bg-papel px-3 py-2 text-sm">{DIRECCION}</code>
              <button
                onClick={copiar}
                className="rounded-lg border border-linea px-3 py-2 text-sm font-semibold text-acento hover:bg-acento-claro"
              >
                {copiado ? 'Copiada' : 'Copiar'}
              </button>
            </div>
          </Paso>

          <Paso numero={4} titulo="Activa el «Modo de desarrollador»">
            Es un interruptor que está {ES_EDGE ? 'en el menú de la izquierda, abajo' : 'arriba a la derecha'}. Al
            activarlo aparecen botones nuevos.
          </Paso>

          <Paso numero={5} titulo="Carga la carpeta">
            Haz clic en <Chip>Cargar descomprimida</Chip> (según tu idioma puede decir «Cargar extensión sin
            empaquetar» o «Load unpacked») y elige la carpeta <Chip>pausa-extension</Chip>, la que tiene adentro el
            archivo manifest.json.
          </Paso>

          <Paso numero={6} titulo="Regresa a esta pestaña">
            Cuando la extensión esté lista, el cuadro de arriba se pone verde solo. No tienes que recargar.
          </Paso>
        </ol>
      )}

      <details className="mt-8 text-sm text-suave">
        <summary className="cursor-pointer font-semibold text-tinta">¿Por qué hay que instalar algo?</summary>
        <p className="mt-2 leading-relaxed">
          Por seguridad, una página web no puede bloquear otras páginas ni las notificaciones de tu computadora. La
          extensión sí tiene ese permiso, pero solo lo usa mientras tienes una sesión de enfoque o una actividad activa.
          No lee tu historial ni lo que escribes.
        </p>
      </details>
    </div>
  )
}

function Estado({ conectada }) {
  if (conectada) {
    return (
      <div className="aparecer flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-acento px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <Icono nombre="check" />
          </span>
          <div>
            <p className="font-semibold">¡Listo! La extensión está activa.</p>
            <p className="text-sm text-white/75">Los sitios se bloquearán en tus sesiones y actividades.</p>
          </div>
        </div>
        <a href="#/enfoque" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-acento hover:bg-acento-claro">
          Empezar una sesión
        </a>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-linea bg-tarjeta px-6 py-4 text-sm">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-alerta" />
      {conectada === null ? 'Revisando si ya tienes la extensión…' : 'Todavía no detectamos la extensión en este navegador.'}
    </div>
  )
}

function Paso({ numero, titulo, children }) {
  return (
    <li className="flex gap-4 rounded-2xl border border-linea bg-tarjeta p-5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-acento-claro font-semibold text-acento">
        {numero}
      </span>
      <div className="min-w-0 text-sm leading-relaxed">
        <p className="mb-1 font-serif text-lg text-tinta">{titulo}</p>
        {children}
      </div>
    </li>
  )
}

function Chip({ children }) {
  return <span className="rounded bg-acento-claro px-1.5 py-0.5 font-medium text-acento">{children}</span>
}
