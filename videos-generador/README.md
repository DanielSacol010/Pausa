# Generador de videos de Pausa

Crea los videos verticales (9:16) del módulo Videos: figuras animadas, voz
que narra y subtítulos. Los videos terminados ya están en
`web/public/videos/`; esta carpeta solo hace falta para cambiarlos o crear
nuevos.

## Cómo funciona

1. `guiones.json`: el texto de cada escena, el tipo de animación (`visual`)
   y el estudio en el que se basa. Si una palabra suena mal, agrega un campo
   `voz` con la forma de decirla (por ejemplo, números escritos con letras).
2. `voz.py`: genera la narración con [Piper](https://github.com/rhasspy/piper)
   y calcula cuándo empieza cada escena y cada subtítulo.
3. `render.html`: dibuja cada fotograma en un canvas (las animaciones están
   en `VISUALES`).
4. `generar.mjs`: abre `render.html` en Chrome, saca 30 fotogramas por
   segundo y los une con la voz usando ffmpeg.

## Requisitos

- Python 3 con `pip install piper-tts numpy`
- Node.js y `npm install` en esta carpeta
- [ffmpeg](https://ffmpeg.org) en el PATH
- Google Chrome (o define `CHROME_PATH` con la ruta a Chrome)
- La voz: descarga
  `https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-es-mls_10246-low.tar.gz`
  y descomprímela en `voces/`. Licencia CC BY 4.0 (datos de Multilingual
  LibriSpeech, openslr.org/94).

## Pasos

```bash
python voz.py            # crea audio/ y linea-de-tiempo.json
node generar.mjs --muestras   # imágenes de prueba en muestras/
node generar.mjs         # MP4 en ../web/public/videos y actualiza videos.js
```

Para un solo video: `node generar.mjs --solo=seis-horas`.

## Notas

- La voz es un modelo libre de baja calidad. A veces hace pausas raras en
  frases cortas o en preguntas; `voz.py` reintenta hasta que la frase sale
  bien. Si una frase sigue sonando mal, cámbiale la redacción en `voz`.
- Las barras y curvas marcadas como «ilustración» muestran la idea del
  estudio, no sus datos exactos.
