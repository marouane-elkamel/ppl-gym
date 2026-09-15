#!/usr/bin/env python3
"""Write the app icons (a white dumbbell on orange) as PNGs, stdlib only."""
import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BG = (232, 89, 12)
FG = (255, 255, 255)

# Dumbbell shapes in unit coordinates (x0, x1, y0, y1), kept inside the maskable safe zone.
SHAPES = [
    (0.26, 0.74, 0.46, 0.54),  # bar
    (0.22, 0.30, 0.32, 0.68),  # inner plates
    (0.70, 0.78, 0.32, 0.68),
    (0.15, 0.22, 0.38, 0.62),  # outer plates
    (0.78, 0.85, 0.38, 0.62),
]


def pixel(x, y, size):
    u, v = (x + 0.5) / size, (y + 0.5) / size
    return FG if any(x0 <= u <= x1 and y0 <= v <= y1 for x0, x1, y0, y1 in SHAPES) else BG


def write_png(path, size):
    rows = b"".join(
        b"\x00" + bytes(c for x in range(size) for c in pixel(x, y, size)) for y in range(size)
    )

    def chunk(kind, data):
        body = kind + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)

    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(rows, 9))
        + chunk(b"IEND", b"")
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(png)


def main():
    for name, size in (("icon-192.png", 192), ("icon-512.png", 512), ("apple-touch-icon.png", 180)):
        write_png(ROOT / "icons" / name, size)
    print("icons written")


if __name__ == "__main__":
    main()
