// Direcciones donde corre la web de Pausa. La extensión solo habla con estas.
// Si publican en otra dirección, agréguenla aquí Y en "matches" del manifest.json.
export const URLS_PAUSA = [
  'https://web-two-dun-16.vercel.app', // versión publicada en Vercel
  'http://localhost:5173', // npm run dev
  'http://127.0.0.1:5173',
]

// La que se abre con "Volver a Pausa" si no hay ninguna pestaña de Pausa abierta
export const URL_PAUSA = URLS_PAUSA[0]

// ¿Esta URL es de Pausa? Compara el origen completo (protocolo + dominio + puerto)
export function esDePausa(url) {
  try {
    const origen = new URL(url).origin
    return URLS_PAUSA.some((u) => new URL(u).origin === origen)
  } catch {
    return false
  }
}

// Patrones para buscar pestañas de Pausa con chrome.tabs.query
export const PATRONES_PAUSA = URLS_PAUSA.map((u) => `${u}/*`)
