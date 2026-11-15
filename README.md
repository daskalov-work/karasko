# Караско — birthday spin-the-wheel 🎡

A 2000s chalga-TV style "spin the wheel" birthday page. Spin it, it lands on a song,
confetti fires, the YouTube video autoplays and two go-go dancers come out.

**Live:** https://quirky-stuff.daskalov.work/karasko

## Run it locally

No build step and no dependencies. Just serve the folder:

```bash
git clone <this repo>
cd karasko
python3 -m http.server 8000
```

Then open http://localhost:8000.

> Opening `index.html` by double-click (`file://`) won't play the YouTube videos.
> YouTube needs the page served over http.

## Make it yours

Everything you'd want to change is in **`js/songs.js`**:

- `SONGS`: 3 songs, each with a title, an artist and a YouTube video ID.
  Some official uploads block embedding ("Video unavailable"). If that happens, use another upload.
- `GREETINGS`: the lines in the scrolling SMS ticker.

The first spin is always song #2 (index `1`). Change that in `js/wheel.js` (`let queue = [1, ...]`).

## What's where

```
index.html        markup only
css/style.css     the whole look: chrome/gold type, wheel, dancers, ticker
js/songs.js       songs + ticker greetings  ← edit me
js/player.js      YouTube IFrame API, autoplay + "music is playing" event
js/wheel.js       wheel drawing, song order, spin, reveal, confetti
assets/qr.svg     QR code to the live page (used on the greeting card)
```

## Deploy

It's a static site, so any static host works. To deploy on Vercel: `vercel deploy --prod`.

## Credits

- Music: videos embedded from YouTube. All songs belong to their artists
  (Стефчо Бенд, Демо). Nothing is downloaded or re-hosted.
- Fonts: Lobster, Russo One and Manrope (Google Fonts).
- Confetti: [canvas-confetti](https://github.com/catdad/canvas-confetti).
- Wheel, go-go dancers and graphics: original, drawn in SVG/CSS for this page.
