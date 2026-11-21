import { useState } from 'react'
import { formatearDuracion } from '../lib/tiempo.js'

const OPCIONES = [
  { valor: 'si', texto: 'Sí' },
  { valor: 'parcial', texto: 'Más o menos' },
  { valor: 'no', texto: 'No' },
]

export default function Resumen({ resumen, onGuardar, onDescanso, onNuevaSesion }) {
  const [cumplida, setCumplida] = useState(null)
  const msEnSesion = resumen.terminadaEn - resumen.inicio
  const sitiosIntentados = Object.entries(resumen.porSitio ?? {}).sort((a, b) => b[1] - a[1])

  function elegir(valor) {
    setCumplida(valor)
    onGuardar(valor)
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-10">
      <p className="text-sm font-medium text-acento">{resumen.completa ? 'Sesión completa' : 'Terminaste antes'}</p>
      <h1 className="mt-2 text-3xl font-semibold leading-tight">{resumen.intencion}</h1>

      <dl className="numeros mt-10 grid grid-cols-2 gap-4">
        <Dato titulo="Tiempo en sesión" valor={formatearDuracion(msEnSesion)} />
        <Dato titulo="Tiempo fuera de Pausa" valor={formatearDuracion(resumen.msFuera)} />
        <Dato titulo="Veces que te saliste" valor={resumen.salidas} />
        <Dato titulo="Distracciones bloqueadas" valor={resumen.extensionActiva ? resumen.intentos : '—'} />
      </dl>

      {sitiosIntentados.length > 0 && (
        <p className="mt-4 text-sm text-suave">
          Intentaste entrar a:{' '}
          {sitiosIntentados.map(([sitio, veces]) => `${sitio} (${veces})`).join(', ')}
        </p>
      )}

      <div className="mt-10">
        <p className="font-medium">¿Cumpliste lo que te propusiste?</p>
        <div className="mt-3 flex gap-2">
          {OPCIONES.map((op) => (
            <button
              key={op.valor}
              onClick={() => elegir(op.valor)}
              disabled={cumplida !== null}
              className={`rounded-full border px-4 py-2 ${
                cumplida === op.valor ? 'border-acento bg-acento text-white' : 'border-linea bg-tarjeta'
              } disabled:cursor-default`}
            >
              {op.texto}
            </button>
          ))}
        </div>
      </div>

      {cumplida !== null && (
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button onClick={onDescanso} className="flex-1 rounded-xl bg-acento py-3 font-semibold text-white hover:brightness-110">
            Tomar un descanso de 5 min
          </button>
          <button onClick={onNuevaSesion} className="flex-1 rounded-xl border border-linea py-3 font-semibold hover:bg-tarjeta">
            Nueva sesión
          </button>
        </div>
      )}
    </main>
  )
}

function Dato({ titulo, valor }) {
  return (
    <div className="rounded-xl border border-linea bg-tarjeta p-4">
      <dt className="text-sm text-suave">{titulo}</dt>
      <dd className="mt-1 text-2xl">{valor}</dd>
    </div>
  )
}
