import { useState } from 'react'
import EstadoExtension from '../components/EstadoExtension.jsx'
import { entrarPantallaCompleta } from '../lib/pantallaCompleta.js'
import { formatearDuracion } from '../lib/tiempo.js'

const DURACIONES = [25, 50]

export default function Inicio({ extensionConectada, historial, onEmpezar }) {
  const [intencion, setIntencion] = useState('')
  const [duracion, setDuracion] = useState(25) // 25, 50 u 'otra'
  const [otraDuracion, setOtraDuracion] = useState('')
  const [modoDemo, setModoDemo] = useState(false)
  const [pantallaCompleta, setPantallaCompleta] = useState(true)

  const minutos = duracion === 'otra' ? Number(otraDuracion) : duracion
  const puedeEmpezar = intencion.trim().length > 0 && minutos >= 1 && minutos <= 180

  function empezar(e) {
    e.preventDefault()
    if (!puedeEmpezar) return
    // Tiene que ir antes de cualquier await: el navegador solo deja
    // entrar a pantalla completa como respuesta directa a un clic.
    if (pantallaCompleta) entrarPantallaCompleta()
    onEmpezar({ intencion: intencion.trim(), minutos, demo: modoDemo })
  }

  const ultimas = historial.slice(0, 3)

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Pausa</h1>
        <EstadoExtension conectada={extensionConectada} />
      </header>

      <form onSubmit={empezar} className="mt-16 space-y-8">
        <div>
          <label htmlFor="intencion" className="block text-3xl font-semibold leading-tight">
            ¿En qué vas a trabajar?
          </label>
          <input
            id="intencion"
            value={intencion}
            onChange={(e) => setIntencion(e.target.value)}
            maxLength={120}
            placeholder="Ej. Terminar la guía de Estadística"
            className="mt-4 w-full rounded-xl border border-linea bg-tarjeta px-4 py-3 text-lg outline-none focus:border-acento"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-suave">Duración</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DURACIONES.map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => setDuracion(min)}
                className={`rounded-full border px-4 py-2 ${
                  duracion === min ? 'border-acento bg-acento text-white' : 'border-linea bg-tarjeta'
                }`}
              >
                {min} min
              </button>
            ))}
            <button
              type="button"
              onClick={() => setDuracion('otra')}
              className={`rounded-full border px-4 py-2 ${
                duracion === 'otra' ? 'border-acento bg-acento text-white' : 'border-linea bg-tarjeta'
              }`}
            >
              Otra
            </button>
            {duracion === 'otra' && (
              <input
                type="number"
                min={1}
                max={180}
                value={otraDuracion}
                onChange={(e) => setOtraDuracion(e.target.value)}
                placeholder="min"
                className="w-24 rounded-full border border-linea bg-tarjeta px-4 py-2 outline-none focus:border-acento"
              />
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={pantallaCompleta} onChange={(e) => setPantallaCompleta(e.target.checked)} />
            Usar pantalla completa
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={modoDemo} onChange={(e) => setModoDemo(e.target.checked)} />
            Modo demo (cada minuto dura 1 segundo)
          </label>
        </div>

        <button
          type="submit"
          disabled={!puedeEmpezar}
          className="w-full rounded-xl bg-acento py-4 text-lg font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
        >
          Empezar sesión
        </button>
      </form>

      {ultimas.length > 0 && (
        <section className="mt-14">
          <h2 className="text-sm font-medium text-suave">Últimas sesiones</h2>
          <ul className="mt-3 divide-y divide-linea">
            {ultimas.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="truncate">{s.intencion}</span>
                <span className="shrink-0 text-suave numeros">
                  {formatearDuracion(s.msEnSesion)} · {s.salidas} {s.salidas === 1 ? 'salida' : 'salidas'} ·{' '}
                  {s.intentos} {s.intentos === 1 ? 'bloqueo' : 'bloqueos'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
