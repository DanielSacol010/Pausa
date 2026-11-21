// Genera los videos de Pausa: dibuja cada fotograma en render.html con Chrome
// (sin ventana) y se los pasa a ffmpeg junto con la narración de voz.py.
// Escribe los MP4 y pósters en ../web/public/videos y actualiza
// ../web/src/data/videos.js.
//
// Uso:  node generar.mjs              -> los 5 videos
//       node generar.mjs --solo=ID    -> solo un video
//       node generar.mjs --muestras   -> solo imágenes de prueba en muestras/
import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { platform } from 'node:os'
import { pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'

const FPS = 30
const CHROME = process.env.CHROME_PATH ?? {
  win32: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
}[platform()] ?? '/usr/bin/google-chrome'
const SALIDA = process.env.SALIDA ?? '../web/public/videos'

const muestras = process.argv.includes('--muestras')
const solo = process.argv.find((a) => a.startsWith('--solo='))?.split('=')[1]
const todos = JSON.parse(readFileSync('linea-de-tiempo.json', 'utf8'))
const videos = todos.filter((v) => !solo || v.id === solo)
mkdirSync(SALIDA, { recursive: true }); mkdirSync('muestras', { recursive: true })

// --no-sandbox solo hace falta si se corre como administrador (root) en Linux
const argumentos = process.getuid?.() === 0 ? ['--no-sandbox'] : []
const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: argumentos })
const pagina = await navegador.newPage()
await pagina.setViewport({ width: 720, height: 1280 })
await pagina.goto(pathToFileURL('render.html').href)
const errores = []
pagina.on('pageerror', (e) => errores.push(e.message))

const fotograma = (t, calidad = 0.9) =>
  pagina.evaluate((t, q) => { window.dibujar(t); return document.getElementById('lienzo').toDataURL('image/jpeg', q) }, t, calidad)
const aBuffer = (url) => Buffer.from(url.split(',')[1], 'base64')

for (const v of videos) {
  await pagina.evaluate((v) => window.preparar(v), v)
  if (muestras) {
    for (const [i, s] of v.segmentos.entries()) {
      const t = Math.min(s.fin - 0.4, s.inicioVoz + (s.finVoz - s.inicioVoz) * 0.8)
      writeFileSync(`muestras/${v.id}-${i}-${s.tipo}.jpg`, aBuffer(await fotograma(t)))
    }
    console.log(v.id, 'muestras listas')
    continue
  }
  const total = Math.ceil(v.duracion * FPS)
  const ffmpeg = spawn('ffmpeg', ['-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-i', `audio/${v.id}.wav`,
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-pix_fmt', 'yuv420p',
    '-af', 'highpass=f=80,lowpass=f=7600,loudnorm=I=-16:TP=-1.5:LRA=11',
    '-c:a', 'aac', '-b:a', '96k', '-ar', '44100',
    '-shortest', '-movflags', '+faststart', `${SALIDA}/${v.id}.mp4`], { stdio: ['pipe', 'inherit', 'inherit'] })
  for (let f = 0; f < total; f++) {
    const buf = aBuffer(await fotograma(f / FPS))
    if (!ffmpeg.stdin.write(buf)) await new Promise((r) => ffmpeg.stdin.once('drain', r))
  }
  ffmpeg.stdin.end()
  await new Promise((r) => ffmpeg.on('close', r))
  writeFileSync(`${SALIDA}/${v.id}.jpg`, aBuffer(await fotograma(v.segmentos[0].finVoz - 0.2, 0.82)))
  console.log(`${v.id}: listo (${total} fotogramas)`)
}
await navegador.close()

// Actualiza la lista de videos que usa la web
if (!muestras) {
  const lineas = [
    '// Videos verticales de Pausa (MP4 9:16 en public/videos).',
    '// Se generan con la carpeta videos-generador/ a partir de guiones.json.',
    '// guion = lo que dice el video; todo tiene que estar en el estudio enlazado.',
    '',
    'export const VIDEOS = [',
  ]
  for (const v of todos) {
    const guion = v.segmentos.filter((s) => s.tipo !== 'titulo' && s.tipo !== 'fuente').map((s) => s.texto)
    lineas.push('  {', `    id: ${JSON.stringify(v.id)},`, `    titulo: ${JSON.stringify(v.titulo)},`, `    estudio: ${JSON.stringify(v.estudio)},`,
      `    src: '/videos/${v.id}.mp4',`, `    poster: '/videos/${v.id}.jpg',`, `    duracion: ${Math.round(v.duracion)},`, '    guion: [',
      ...guion.map((g) => `      ${JSON.stringify(g)},`), '    ],', '  },')
  }
  lineas.push(']')
  writeFileSync('../web/src/data/videos.js', lineas.join('\n') + '\n')
}
console.log('errores:', errores)
