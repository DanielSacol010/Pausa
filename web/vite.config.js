import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // La extensión solo se conecta con la web en este puerto, por eso lo fijamos.
  // Si el 5173 está ocupado, Vite da error en vez de cambiarse a otro puerto.
  server: { port: 5173, strictPort: true },
})
