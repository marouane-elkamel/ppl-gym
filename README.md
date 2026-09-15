# PPL Gym

**Live app: <https://marouane-elkamel.github.io/ppl-gym/>**

A phone-first web app for a 3-day Push / Pull / Legs beginner program, mostly on machines. Pick a day, then work through warm-up → 7 exercises → cardio → cool-down. Every exercise has photos, written instructions and a video tutorial. Log kg and reps for each set, a rest timer starts after each one, and your progress is charted over time.

- Static files only: no build step, no backend, no dependencies.
- Works offline once opened, and you can add it to your home screen.
- Data is saved on the device (localStorage). Use **Settings → Export backup** to keep a copy.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Tests

```bash
node --test tests/*.test.mjs
```

## Host it for free

Every host just needs to serve this folder as-is: no build command, and the output directory is the repository root.

- **GitHub Pages:** push this folder to a repo, then Settings → Pages → Deploy from branch → `main` / root.
- **Netlify:** drag the folder onto <https://app.netlify.com/drop>.
- **Cloudflare Pages / Vercel:** import the repo, framework preset "None", no build command.

The app uses relative paths and hash routes, so it also works under a sub-path like `username.github.io/gym/`.

On your phone, open the URL, then **Share → Add to Home Screen** (iPhone) or **⋮ → Install app** (Android).

## Changing the program

- Edit `data/program.js` (exercises, sets, reps, rest times, instructions, videos).
- If you add exercises or change a video, run `python3 tools/fetch_images.py` to download the photos and video thumbnails. A `dbId` must be a folder name from [free-exercise-db](https://github.com/yuhonas/free-exercise-db/tree/main/exercises); a `video.id` is the `v=` part of a YouTube URL.
- `python3 tools/check_videos.py` checks that every video still plays and can be embedded, and prints its real title and channel. Run it if a video card looks wrong.
- Bump `CACHE` in `sw.js` (e.g. `ppl-v5`) so installed apps pick up the change.

Exercise photos: free-exercise-db, public domain (Unlicense). Videos are embedded from YouTube (youtube-nocookie.com) and belong to their creators; nothing is contacted until you tap play.
