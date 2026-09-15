#!/usr/bin/env python3
"""Download every image the app ships: exercise photos and video thumbnails.

Photos come from free-exercise-db (public domain) and land in img/<db_id>/.
Video thumbnails come from YouTube and land in img/yt/<video_id>.jpg, so a video
card still looks right offline. Re-run after adding exercises; existing files are
skipped. Also writes img/index.json, which the service worker precaches.
"""
import json
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/"
THUMBS = "https://i.ytimg.com/vi/"


def main():
    program = (ROOT / "data" / "program.js").read_text()
    ids = sorted(set(re.findall(r'"dbId":\s*"([^"]+)"', program)))
    videos = sorted(set(re.findall(r'"video":\s*\{\s*"id":\s*"([^"]+)"', program)))
    paths = [f"img/{db_id}/{n}.jpg" for db_id in ids for n in (0, 1)]
    paths += [f"img/yt/{video_id}.jpg" for video_id in videos]

    def source_url(rel):
        if rel.startswith("img/yt/"):
            video_id = Path(rel).stem
            # mqdefault is 320x180 with no black bars, and small enough to ship offline.
            return f"{THUMBS}{video_id}/mqdefault.jpg"
        return SOURCE + rel.removeprefix("img/")

    def download(rel):
        dest = ROOT / rel
        if dest.exists() and dest.stat().st_size > 0:
            return
        dest.parent.mkdir(parents=True, exist_ok=True)
        with urllib.request.urlopen(source_url(rel), timeout=30) as resp:
            dest.write_bytes(resp.read())

    with ThreadPoolExecutor(12) as pool:
        list(pool.map(download, paths))

    (ROOT / "img" / "index.json").write_text(json.dumps(paths, indent=0))
    print(f"{len(paths)} images in img/ ({len(videos)} video thumbnails)")


if __name__ == "__main__":
    main()
