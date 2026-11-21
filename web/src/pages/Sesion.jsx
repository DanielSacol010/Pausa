import { useEffect, useRef, useState } from 'react'
import ModalRendirse from '../components/ModalRendirse.jsx'
import { useDistracciones } from '../hooks/useDistracciones.js'
import { useTemporizador } from '../hooks/useTemporizador.js'
import { enviarAExtension } from '../lib/extension.js'
import { entrarPantallaCompleta } from '../lib/pantallaCompleta.js'
import { formatearDuracion, formatearReloj } from '../lib/tiempo.js'

export default function Sesion({ sesion, onActualizar, onTerminar }) {
  const restante = useTemporizador(sesion.terminaEn)
  const total = sesion.terminaEn - sesion.inicio
  const progreso = 1 - restante / total

  const [intentos, setIntentos] = useState(0)
  const [enPantallaCompleta, setEnPantallaCompleta] = useState(!!document.fullscreenElement)
  const [rindiendose, setRindiendose] = useState(false)

  // Cuando el reloj llega a 0, la sesión termina sola (una sola vez).
  const yaTermino = useRef(false)
  useEffect(() => {
    if (restante <= 0 && !yaTermino.current) {
      yaTermino.current = true
      onTerminar(true)
    }
  }, [restante, onTerminar])

  // Cada vez que el usuario se va y regresa, sumamos una salida.
  useDistracciones(true, (msFuera) => {
    onActualizar((s) => ({ ...s, salidas: s.salidas + 1, msFuera: s.msFuera + msFuera }))
  })

  // Le preguntamos a la extensión cuántos intentos ha bloqueado.
  useEffect(() => {
    if (!sesion.extensionActiva) return
    async function consultar() {
      try {
        const estado = await enviarAExtension('GET_STATUS')
        setIntentos(estado?.intentos ?? 0)
      } catch {
        // si la extensión no responde, dejamos el último número
      }
    }
    consultar()
    const intervalo = setInterval(consultar, 3000)
    return () => clearInterval(intervalo)
  }, [sesion.extensionActiva])

  useEffect(() => {
    const alCambiar = () => setEnPantallaCompleta(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', alCambiar)
    return () => document.removeEventListener('fullscreenchange', alCambiar)
  }, [])

  // Mostrar el tiempo en el título de la pestaña
  useEffect(() => {
    document.title = `${formatearReloj(restante)} · Pausa`
    return () => {
      document.title = 'Pausa'
    }
  }, [restante])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="max-w-lg text-lg text-suave">{sesion.intencion}</p>

      <p className="numeros mt-6 text-8xl font-light tracking-tight sm:text-9xl">{formatearReloj(restante)}</p>

      <div className="mt-8 h-1 w-full max-w-md overflow-hidden rounded-full bg-linea">
        <div className="h-full bg-acento transition-[width] duration-300" style={{ width: `${progreso * 100}%` }} />
      </div>

      <dl className="numeros mt-10 flex gap-10 text-sm text-suave">
        <div>
          <dt>Salidas</dt>
          <dd className="text-2xl text-tinta">{sesion.salidas}</dd>
        </div>
        <div>
          <dt>Tiempo fuera</dt>
          <dd className="text-2xl text-tinta">{formatearDuracion(sesion.msFuera)}</dd>
        </div>
        <div>
          <dt>Bloqueos</dt>
          <dd className="text-2xl text-tinta">{sesion.extensionActiva ? intentos : '—'}</dd>
        </div>
      </dl>

      {!sesion.extensionActiva && (
        <p className="mt-6 max-w-sm text-sm text-alerta">
          La extensión no está conectada, así que los sitios no se están bloqueando. Puedes instalarla desde
          «Extensión de Chrome» en el menú cuando termines.
        </p>
      )}

      <div className="mt-12 flex gap-3">
        {!enPantallaCompleta && (
          <button onClick={entrarPantallaCompleta} className="rounded-lg border border-linea px-4 py-2 text-sm hover:bg-tarjeta">
            Pantalla completa
          </button>
        )}
        <button onClick={() => setRindiendose(true)} className="rounded-lg px-4 py-2 text-sm text-suave hover:text-alerta">
          Terminar antes
        </button>
      </div>

      {sesion.demo && <p className="mt-6 text-xs text-suave">Modo demo</p>}

      {rindiendose && (
        <ModalRendirse
          onCancelar={() => setRindiendose(false)}
          onConfirmar={() => {
            setRindiendose(false)
            yaTermino.current = true
            onTerminar(false)
          }}
        />
      )}
    </main>
  )
}
