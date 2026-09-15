#!/usr/bin/env python3
"""Check every exercise video against YouTube's oEmbed API.

Prints the real title and channel for each id, and flags any that no longer
resolve (deleted, private, or embedding disabled). Run it after changing videos,
or any time a video card looks wrong.

Usage:
  python3 tools/check_videos.py              # check the ids in data/program.js
  python3 tools/check_videos.py ID [ID ...]  # check ids given on the command line
"""
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OEMBED = "https://www.youtube.com/oembed?format=json&url="


def embeddable(video_id):
    """False when the owner disabled playing the video outside YouTube."""
    request = urllib.request.Request(f"https://www.youtube.com/watch?v={video_id}",
                                     headers={"User-Agent": "Mozilla/5.0"})
    try:
        page = urllib.request.urlopen(request, timeout=25).read().decode("utf8", "ignore")
    except Exception:
        return None  # unknown; the oembed check above is the one that matters
    return '"playableInEmbed":true' in page


def lookup(video_id):
    """Returns (title, channel) or (None, error)."""
    url = OEMBED + urllib.parse.quote(f"https://www.youtube.com/watch?v={video_id}", safe="")
    try:
        with urllib.request.urlopen(url, timeout=20) as resp:
            data = json.load(resp)
    except urllib.error.HTTPError as exc:
        return None, f"HTTP {exc.code}"
    except Exception as exc:
        return None, repr(exc)
    if embeddable(video_id) is False:
        return None, "embedding disabled by the uploader"
    return data["title"], data["author_name"]


def program_videos():
    text = (ROOT / "data" / "program.js").read_text()
    blocks = re.findall(r'"([a-z_]+)":\s*\{(.*?)\n  \}', text, re.S)
    found = []
    for key, block in blocks:
        name = re.search(r'"name":\s*"([^"]+)"', block)
        video = re.search(r'"video":\s*\{[^}]*"id":\s*"([^"]+)"', block, re.S)
        if name and video:
            found.append((key, name.group(1), video.group(1)))
    return found


def main():
    if len(sys.argv) > 1:
        entries = [(None, "", vid) for vid in sys.argv[1:]]
    else:
        entries = program_videos()

    with ThreadPoolExecutor(8) as pool:
        results = list(pool.map(lambda e: lookup(e[2]), entries))

    bad = 0
    for (key, name, video_id), (title, info) in zip(entries, results):
        label = f"{name or key or video_id}"
        if title is None:
            bad += 1
            print(f"✗ {label} [{video_id}]: {info}")
        else:
            print(f"✓ {label} [{video_id}]: {title} — {info}")

    print(f"\n{len(entries) - bad}/{len(entries)} playable")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
