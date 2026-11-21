import { useCallback, useEffect, useRef, useState } from 'react'
import Layout from './components/Layout.jsx'
import Actividades from './pages/Actividades.jsx'
import Descanso from './pages/Descanso.jsx'
import Documentacion from './pages/Documentacion.jsx'
import Estudio from './pages/Estudio.jsx'
import Inicio from './pages/Inicio.jsx'
import InstalarExtension from './pages/InstalarExtension.jsx'
import Resumen from './pages/Resumen.jsx'
import Sesion from './pages/Sesion.jsx'
import Videos from './pages/Videos.jsx'
import { useExtension } from './hooks/useExtension.js'
import { useRuta } from './hooks/useRuta.js'
import { enviarAExtension } from './lib/extension.js'
import { agregarAlHistorial, guardarSesionActual, leerHistorial, leerSesionActual } from './lib/historial.js'
import { salirPantallaCompleta } from './lib/pantallaCompleta.js'
import { SITIOS_BLOQUEADOS } from './lib/sitios.js'
import { minutosAMs } from './lib/tiempo.js'

const MINUTOS_DESCANSO = 5

export default function App() {
  // Si se recargó la página a media sesión, la recuperamos.
  const [sesion, setSesion] = useState(() => leerSesionActual())
  const [resumen, setResumen] = useState(null)
  const [descanso, setDescanso] = useState(null)
  const [historial, setHistorial] = useState(() => leerHistorial())
  const extensionConectada = useExtension()
  const ruta = useRuta()

  useEffect(() => {
    guardarSesionActual(sesion)
  }, [sesion])

  // Guardamos la sesión más reciente en una ref para que terminar()
  // siempre vea los últimos datos (salidas, tiempo fuera).
  const sesionRef = useRef(sesion)
  sesionRef.current = sesion

  async function empezar({ intencion, minutos, demo }) {
    const inicio = Date.now()
    const nueva = {
      id: String(inicio),
      intencion,
      minutos,
      demo,
      inicio,
      terminaEn: inicio + minutosAMs(minutos, demo),
      salidas: 0,
      msFuera: 0,
      extensionActiva: false,
    }
    setSesion(nueva)

    try {
      const respuesta = await enviarAExtension('START_SESSION', {
        terminaEn: nueva.terminaEn,
        intencion,
        sitios: SITIOS_BLOQUEADOS,
      })
      if (respuesta?.ok) {
        setSesion((s) => (s && s.id === nueva.id ? { ...s, extensionActiva: true } : s))
      }
    } catch {
      // Sin extensión la sesión sigue, solo que no bloquea sitios.
    }
  }

  const terminar = useCallback(async (completa) => {
    const actual = sesionRef.current
    if (!actual) return

    let intentos = 0
    let porSitio = {}
    try {
      const respuesta = await enviarAExtension('END_SESSION')
      intentos = respuesta?.intentos ?? 0
      porSitio = respuesta?.porSitio ?? {}
    } catch {
      // la extensión no está; seguimos igual
    }

    salirPantallaCompleta()
    setResumen({ ...sesionRef.current, terminadaEn: Date.now(), completa, intentos, porSitio })
    setSesion(null)
  }, [])

  function guardarResumen(cumplida) {
    const r = resumen
    setHistorial(
      agregarAlHistorial({
        id: r.id,
        intencion: r.intencion,
        fecha: r.inicio,
        minutosPlaneados: r.minutos,
        msEnSesion: r.terminadaEn - r.inicio,
        msFuera: r.msFuera,
        salidas: r.salidas,
        intentos: r.intentos,
        completa: r.completa,
        cumplida,
        demo: r.demo,
      }),
    )
  }

  function empezarDescanso() {
    const demo = resumen?.demo
    setResumen(null)
    setDescanso({ terminaEn: Date.now() + minutosAMs(MINUTOS_DESCANSO, demo) })
  }

  const terminarDescanso = useCallback(() => setDescanso(null), [])

  // Durante una sesión de enfoque, el resumen o el descanso se ocupa toda
  // la pantalla (sin menú). El resto de la app va dentro del Layout.
  if (sesion) {
    return <Sesion sesion={sesion} onActualizar={setSesion} onTerminar={terminar} />
  }
  if (resumen) {
    return (
      <Resumen
        resumen={resumen}
        onGuardar={guardarResumen}
        onDescanso={empezarDescanso}
        onNuevaSesion={() => setResumen(null)}
      />
    )
  }
  if (descanso) {
    return <Descanso terminaEn={descanso.terminaEn} onTerminar={terminarDescanso} />
  }

  let pagina
  if (ruta.seccion === 'videos') pagina = <Videos idInicial={ruta.id} />
  else if (ruta.seccion === 'actividades') pagina = <Actividades idAbierta={ruta.id} />
  else if (ruta.seccion === 'extension') pagina = <InstalarExtension conectada={extensionConectada} />
  else if (ruta.seccion === 'documentacion') pagina = ruta.id ? <Estudio id={ruta.id} /> : <Documentacion />
  else pagina = <Inicio extensionConectada={extensionConectada} historial={historial} onEmpezar={empezar} />

  return (
    <Layout seccion={ruta.seccion} extensionConectada={extensionConectada}>
      <div key={`${ruta.seccion}/${ruta.seccion === 'actividades' ? '' : (ruta.id ?? '')}`}>{pagina}</div>
    </Layout>
  )
}
