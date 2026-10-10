"""Genera los QR (SVG y PNG) de cada local a partir de config.js.

Uso:
    python -m pip install segno            (solo la primera vez)
    python tools/generar_qr.py             QR de entrada de cada local  ->  qr/<local>.svg / .png
    python tools/generar_qr.py --mesas     además, uno por mesa        ->  qr/<local>/mesa-01.png ...
    python tools/generar_qr.py --nfc       además, nfc-urls.csv con la URL de cada pegatina NFC

Lee baseUrl, las claves de "locales" y su nº de "mesas" directamente de config.js,
así que basta con volver a ejecutarlo si cambias el dominio o los locales.
"""
import argparse
import csv
import re
from pathlib import Path

import segno

RAIZ = Path(__file__).resolve().parent.parent
COLOR = "#24302A"


def leer_config():
    js = (RAIZ / "config.js").read_text(encoding="utf-8")
    js = re.sub(r"/\*.*?\*/", "", js, flags=re.S)        # sin comentarios de bloque
    js = re.sub(r"(?m)^\s*//.*$|(?<=[,{\[])\s*//[^\n]*", "", js)  # ni de línea
    base = re.search(r'baseUrl:\s*"([^"]+)"', js).group(1)
    bloque = js[js.index("locales: {"):]
    locales = []
    # Cada local empieza con 4 espacios + clave + ": {"
    trozos = re.split(r"\n    ([a-z0-9_-]+): \{", bloque)
    for clave, cuerpo in zip(trozos[1::2], trozos[2::2]):
        mesas = re.search(r"mesas:\s*(\d+)", cuerpo)
        nombre = re.search(r'nombre:\s*"([^"]+)"', cuerpo)
        locales.append((clave, nombre.group(1) if nombre else clave, int(mesas.group(1)) if mesas else 0))
    return base, locales


def url(base, local, mesa=None, via="qr"):
    u = f"{base}?local={local}"
    if mesa:
        u += f"&mesa={mesa}"
    return u + f"&src={via}"


def guardar(qr, destino):
    destino.parent.mkdir(parents=True, exist_ok=True)
    qr.save(destino.with_suffix(".svg"), scale=10, border=2, dark=COLOR)
    qr.save(destino.with_suffix(".png"), scale=20, border=2, dark=COLOR)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mesas", action="store_true", help="genera también un QR por mesa")
    ap.add_argument("--nfc", action="store_true", help="genera nfc-urls.csv con las URL de las pegatinas")
    args = ap.parse_args()

    base, locales = leer_config()
    print(f"Dominio: {base}")
    for clave, nombre, mesas in locales:
        u = url(base, clave)
        guardar(segno.make(u, error="m"), RAIZ / "qr" / clave)
        print(f"  {nombre:28} {u}")
        if args.mesas:
            for m in range(1, mesas + 1):
                guardar(segno.make(url(base, clave, m), error="m"), RAIZ / "qr" / clave / f"mesa-{m:02d}")
            print(f"    + {mesas} QR de mesa en qr/{clave}/")

    if args.nfc:
        with open(RAIZ / "nfc-urls.csv", "w", newline="", encoding="utf-8-sig") as f:
            w = csv.writer(f, delimiter=";")
            w.writerow(["local", "ubicacion", "url_nfc"])
            for clave, nombre, mesas in locales:
                w.writerow([nombre, "Entrada", url(base, clave, via="nfc")])
                for m in range(1, mesas + 1):
                    w.writerow([nombre, f"Mesa {m}", url(base, clave, m, via="nfc")])
        print("  + nfc-urls.csv")


if __name__ == "__main__":
    main()
