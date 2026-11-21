# Genera la narración de cada video con Piper y calcula la línea de tiempo
# (cuándo empieza y termina cada escena y cada subtítulo).
import io, json, os, re, sys, wave
import numpy as np
from piper import PiperVoice, SynthesisConfig

import os
MODELO = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('PIPER_MODELO', 'voces/es-mls_10246-low.onnx')
SR = 16000
INICIO = 0.5      # silencio al principio
PAUSA = 0.55      # silencio entre escenas
FINAL = 1.4       # silencio al final

voz = PiperVoice.load(MODELO)
voz.config.espeak_voice = 'es-419'  # pronunciación latinoamericana (seseo)
def silencio(seg):
    return np.zeros(int(seg * SR), dtype=np.int16)

config = SynthesisConfig(length_scale=1.1, noise_scale=0.33, noise_w_scale=0.3)
VENTANA = 320  # 20 ms

def envolvente(a):
    n = len(a) // VENTANA * VENTANA
    return np.abs(a[:n].astype(float)).reshape(-1, VENTANA).mean(1)

def silencios(env):
    # lista de (inicio, largo) en ventanas de tramos sin voz
    tramos, ini = [], None
    for i, x in enumerate(env > 300):
        if not x and ini is None: ini = i
        if x and ini is not None: tramos.append((ini, i - ini)); ini = None
    if ini is not None: tramos.append((ini, len(env) - ini))
    return tramos

def recortar(a):
    env = envolvente(a)
    activo = np.where(env > 300)[0]
    if not len(activo): return a
    a = a[max(0, activo[0] - 2) * VENTANA:(activo[-1] + 4) * VENTANA]
    # comprime silencios internos de más de 0.35 s a 0.28 s
    env = envolvente(a); partes = []; pos = 0
    for ini, largo in silencios(env):
        if largo > 17:
            partes.append(a[pos:(ini + 7) * VENTANA]); pos = (ini + largo - 7) * VENTANA
    partes.append(a[pos:])
    return np.concatenate(partes)

def orillas(a):
    env = envolvente(a)
    activo = np.where(env > 300)[0]
    return a[activo[0] * VENTANA:(activo[-1] + 1) * VENTANA] if len(activo) else a

def frase_ok(texto, a):
    a = orillas(a)  # solo cuentan los silencios de en medio
    env = envolvente(a)
    mayor = max([l for _, l in silencios(env)] + [0])
    cps = len(texto) / (len(a) / SR)
    minimo = 9.5 if len(texto) >= 25 else 5.5
    return mayor < 40 and minimo <= cps <= 20, cps, mayor * 0.02

def intentar(texto, veces):
    mejor = None
    for _ in range(veces):
        a = np.concatenate([c.audio_int16_array for c in voz.synthesize(texto, syn_config=config)])
        ok, cps, mayor = frase_ok(texto, a)
        if ok: return recortar(a), True
        if mejor is None or mayor < mejor[1]: mejor = (a, mayor)
    return recortar(mejor[0]), False

def sintetizar(texto):
    # Primero intenta el texto completo (la voz suena más natural con contexto).
    a, ok = intentar(texto, 10)
    if ok: return a
    # Si no sale bien, lo parte en frases y junta las muy cortas con la siguiente.
    frases = [f.strip() for f in re.findall(r'[^.?!]+[.?!]*', texto) if f.strip()]
    bloques = []
    for f in frases:
        if bloques and len(bloques[-1]) < 28: bloques[-1] += ' ' + f
        else: bloques.append(f)
    partes = []
    for i, b in enumerate(bloques):
        a, ok = intentar(b, 15)
        if not ok: print(f'  ! revisar: {b}', file=sys.stderr)
        partes.append(a)
        if i < len(bloques) - 1: partes.append(silencio(0.2))
    return np.concatenate(partes)

videos = json.load(open('guiones.json'))
for v in videos:
    partes = [silencio(INICIO)]
    t = INICIO
    segmentos = []
    lista = [{'tipo': 'titulo', 'texto': v['titulo'], 'voz': v.get('voz', v['titulo'])}]
    lista += [{'tipo': e['visual'], 'texto': e['texto'], 'voz': e.get('voz', e['texto'])} for e in v['escenas']]
    lista += [{'tipo': 'fuente', 'texto': '', 'voz': v['fuente']['voz']}]
    for i, seg in enumerate(lista):
        audio = sintetizar(seg['voz'])
        dur = len(audio) / SR
        segmentos.append({**seg, 'inicioVoz': round(t, 3), 'finVoz': round(t + dur, 3)})
        partes.append(audio)
        t += dur
        extra = FINAL if i == len(lista) - 1 else PAUSA
        partes.append(silencio(extra))
        t += extra
    # cada escena visual dura desde un poco antes de su voz hasta que empieza la siguiente
    for i, s in enumerate(segmentos):
        s['inicio'] = 0 if i == 0 else round(s['inicioVoz'] - 0.25, 3)
        s['fin'] = round(segmentos[i + 1]['inicioVoz'] - 0.25, 3) if i + 1 < len(segmentos) else round(t, 3)
    audio = np.concatenate(partes)
    os.makedirs('audio', exist_ok=True)
    with wave.open(f'audio/{v["id"]}.wav', 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(audio.tobytes())
    v['duracion'] = round(t, 3)
    v['segmentos'] = segmentos
    print(f'{v["id"]}: {t:.1f} s, {len(segmentos)} segmentos', file=sys.stderr)

json.dump(videos, open('linea-de-tiempo.json', 'w'), ensure_ascii=False, indent=1)
