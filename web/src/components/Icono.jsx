// Íconos en SVG (los mismos trazos del prototipo).
const TRAZOS = {
  play: <polygon points="8 5 19 12 8 19 8 5" />,
  pausa: <path d="M8 5v14M16 5v14" />,
  reiniciar: <path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4" />,
  sonido: <path d="M4 9v6h4l5 4V5L8 9H4ZM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" />,
  silencio: <path d="M4 9v6h4l5 4V5L8 9H4ZM16 9l5 6M21 9l-5 6" />,
  hoja: <><path d="M20 4C8 2 2 8 5 15s16 6 15-11Z" /><path d="M4 21 15 10M9 16v-5M9 16h5" /></>,
  libro: <><path d="M12 6C9 3 4 4 2 5v15c3-2 7-2 10 0 3-2 7-2 10 0V5c-3-1-7-2-10 1Z" /><path d="M12 6v14" /></>,
  flecha: <path d="M4 12h16m-6-6 6 6-6 6" />,
  atras: <path d="M20 12H4m6-6-6 6 6 6" />,
  arriba: <path d="m6 15 6-6 6 6" />,
  abajo: <path d="m6 9 6 6 6-6" />,
  reloj: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  buscar: <><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  respirar: <path d="M3 8h12c5 0 5-6 1-6M3 12h15c5 0 5 7 0 7M3 16h7c5 0 5 6 1 6" />,
  sol: <><circle cx="12" cy="12" r="4" /><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" /></>,
  mover: <><circle cx="15" cy="4" r="2" /><path d="m8 21 4-7-3-4 4-3 3 5 4 1M4 13l4-1 1-4M12 14l5 3v4" /></>,
  luna: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z" />,
  celular: <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M10 18h4M3 3l18 18" /></>,
  audifonos: <><path d="M4 14v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="12" width="4" height="8" rx="2" /><rect x="17" y="12" width="4" height="8" rx="2" /></>,
  externo: <path d="M14 3h7v7m-1-6L10 14M11 4H4v16h16v-7" />,
  lista: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  cerrar: <path d="M6 6l12 12M18 6 6 18" />,
}

export default function Icono({ nombre, className = 'h-5 w-5' }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {TRAZOS[nombre] ?? TRAZOS.hoja}
    </svg>
  )
}
