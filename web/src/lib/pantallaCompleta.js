// requestFullscreen solo funciona si se llama justo después de un clic.
export function entrarPantallaCompleta() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {})
  }
}

export function salirPantallaCompleta() {
  if (document.fullscreenElement) {
    document.exitFullscreen?.().catch(() => {})
  }
}
