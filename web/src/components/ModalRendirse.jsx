import { useState } from 'react'

const FRASE = 'Elijo distraerme'

// Para terminar antes hay que escribir una frase. No es imposible,
// pero obliga a pensarlo dos veces.
export default function ModalRendirse({ onCancelar, onConfirmar }) {
  const [texto, setTexto] = useState('')
  const coincide = texto.trim().toLowerCase() === FRASE.toLowerCase()

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-tinta/40 p-6">
      <div className="w-full max-w-md rounded-2xl bg-tarjeta p-6 shadow-lg">
        <h2 className="text-lg font-semibold">¿Terminar la sesión antes?</h2>
        <p className="mt-2 text-suave">
          Si de verdad quieres parar, escribe <strong className="text-tinta">{FRASE}</strong>.
        </p>
        <input
          autoFocus
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="mt-4 w-full rounded-lg border border-linea bg-white px-3 py-2 outline-none focus:border-acento"
          placeholder={FRASE}
        />
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onCancelar} className="rounded-lg px-4 py-2 font-medium text-acento hover:bg-acento-claro">
            Seguir enfocado
          </button>
          <button
            onClick={onConfirmar}
            disabled={!coincide}
            className="rounded-lg bg-alerta px-4 py-2 font-medium text-white disabled:opacity-40"
          >
            Terminar
          </button>
        </div>
      </div>
    </div>
  )
}
