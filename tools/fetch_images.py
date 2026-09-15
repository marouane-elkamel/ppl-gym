#!/usr/bin/env python3
"""Download every exercise photo referenced in data/program.js into img/.

Photos come from free-exercise-db (public domain). Re-run after adding exercises;
existing files are skipped. Also writes img/index.json for the service worker.
"""
import json
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/"


def main():
    program = (ROOT / "data" / "program.js").read_text()
    ids = sorted(set(re.findall(r'"dbId":\s*"([^"]+)"', program)))
    paths = [f"img/{db_id}/{n}.jpg" for db_id in ids for n in (0, 1)]

    def download(rel):
        dest = ROOT / rel
        if dest.exists() and dest.stat().st_size > 0:
            return
        dest.parent.mkdir(parents=True, exist_ok=True)
        url = SOURCE + rel.removeprefix("img/")
        with urllib.request.urlopen(url, timeout=30) as resp:
            dest.write_bytes(resp.read())

    with ThreadPoolExecutor(12) as pool:
        list(pool.map(download, paths))

    (ROOT / "img" / "index.json").write_text(json.dumps(paths, indent=0))
    print(f"{len(paths)} images in img/")


if __name__ == "__main__":
    main()
