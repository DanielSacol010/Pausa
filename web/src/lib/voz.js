// Voz del navegador (speechSynthesis) para narrar los videos de la demo.
let vozEspanol = null

function elegirVoz() {
  const voces = window.speechSynthesis?.getVoices() ?? []
  vozEspanol =
    voces.find((v) => v.lang === 'es-MX') ?? voces.find((v) => v.lang === 'es-US') ?? voces.find((v) => v.lang.startsWith('es')) ?? null
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  elegirVoz()
  window.speechSynthesis.addEventListener?.('voiceschanged', elegirVoz)
}

export function hablar(texto) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const frase = new SpeechSynthesisUtterance(texto.replace(/["…]/g, ''))
  frase.lang = vozEspanol?.lang ?? 'es-MX'
  if (vozEspanol) frase.voice = vozEspanol
  frase.rate = 1.05
  window.speechSynthesis.speak(frase)
}

export function callar() {
  window.speechSynthesis?.cancel()
}
