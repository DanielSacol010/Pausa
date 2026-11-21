// 1500000 ms -> "25:00"
export function formatearReloj(ms) {
  const totalSegundos = Math.max(0, Math.ceil(ms / 1000))
  const minutos = Math.floor(totalSegundos / 60)
  const segundos = totalSegundos % 60
  return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
}

// 95000 ms -> "1 min 35 s"
export function formatearDuracion(ms) {
  const totalSegundos = Math.round(ms / 1000)
  const minutos = Math.floor(totalSegundos / 60)
  const segundos = totalSegundos % 60
  if (minutos === 0) return `${segundos} s`
  if (segundos === 0) return `${minutos} min`
  return `${minutos} min ${segundos} s`
}

// En modo demo cada "minuto" dura un segundo, para presentar sin esperar.
export function minutosAMs(minutos, demo) {
  return minutos * (demo ? 1000 : 60 * 1000)
}
