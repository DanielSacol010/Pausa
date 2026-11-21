// Crea web/public/pausa-extension.zip con los archivos de ../extension,
// para que la web tenga el botón de descarga siempre actualizado.
// Corre solo antes de "npm run dev" y "npm run build" (ver package.json).
// Si la carpeta extension no existe (por ejemplo en algunos servidores),
// no hace nada y se usa el .zip que ya está en public/.

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { crc32, deflateRawSync } from 'node:zlib'

const aqui = fileURLToPath(new URL('.', import.meta.url))
const origen = join(aqui, '..', '..', 'extension')
const destino = join(aqui, '..', 'public', 'pausa-extension.zip')

if (!existsSync(origen)) {
  console.log('[extension] No encontré la carpeta extension; uso el .zip que ya existe.')
  process.exit(0)
}

function listar(carpeta) {
  return readdirSync(carpeta).flatMap((nombre) => {
    const ruta = join(carpeta, nombre)
    return statSync(ruta).isDirectory() ? listar(ruta) : [ruta]
  })
}

// Formato ZIP mínimo: un encabezado por archivo + un directorio central al final
const locales = []
const central = []
let offset = 0

for (const ruta of listar(origen).sort()) {
  const nombre = Buffer.from(relative(origen, ruta).split(sep).join('/'))
  const datos = readFileSync(ruta)
  const comprimido = deflateRawSync(datos)
  const crc = crc32(datos)

  const local = Buffer.alloc(30)
  local.writeUInt32LE(0x04034b50, 0)
  local.writeUInt16LE(20, 4) // versión necesaria
  local.writeUInt16LE(0x0800, 6) // nombres en UTF-8
  local.writeUInt16LE(8, 8) // método: deflate
  local.writeUInt32LE(crc, 14)
  local.writeUInt32LE(comprimido.length, 18)
  local.writeUInt32LE(datos.length, 22)
  local.writeUInt16LE(nombre.length, 26)
  locales.push(local, nombre, comprimido)

  const entrada = Buffer.alloc(46)
  entrada.writeUInt32LE(0x02014b50, 0)
  entrada.writeUInt16LE(20, 4)
  entrada.writeUInt16LE(20, 6)
  entrada.writeUInt16LE(0x0800, 8)
  entrada.writeUInt16LE(8, 10)
  entrada.writeUInt32LE(crc, 16)
  entrada.writeUInt32LE(comprimido.length, 20)
  entrada.writeUInt32LE(datos.length, 24)
  entrada.writeUInt16LE(nombre.length, 28)
  entrada.writeUInt32LE(offset, 42)
  central.push(entrada, nombre)

  offset += local.length + nombre.length + comprimido.length
}

const tamanoCentral = central.reduce((total, b) => total + b.length, 0)
const fin = Buffer.alloc(22)
fin.writeUInt32LE(0x06054b50, 0)
fin.writeUInt16LE(central.length / 2, 8)
fin.writeUInt16LE(central.length / 2, 10)
fin.writeUInt32LE(tamanoCentral, 12)
fin.writeUInt32LE(offset, 16)

writeFileSync(destino, Buffer.concat([...locales, ...central, fin]))
console.log(`[extension] Listo: public/pausa-extension.zip (${central.length / 2} archivos)`)
