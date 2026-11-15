// YouTube IFrame API: autoplays the picked song and tells the page when music is playing
// (the go-go dancers listen for the "music" event).

// ---------- YouTube player (official IFrame API → autoplay + play-state events) ----------
let yt = null, ytReady = false, pending = null;
window.onYouTubeIframeAPIReady = () => { ytReady = true; if (pending) playSong(pending); };
const api = document.createElement("script");
api.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(api);

function playSong(s) {
  if (!ytReady) { pending = s; return; }
  pending = null;
  if (!yt) {
    yt = new YT.Player("yt", {
      host: "https://www.youtube-nocookie.com",
      videoId: s.yt,
      playerVars: { autoplay: 1, playsinline: 1, rel: 0 },
      events: {
        onReady: e => e.target.playVideo(),
        onStateChange: e => {
          if (e.data === YT.PlayerState.PLAYING) music(true);
          else if (e.data !== YT.PlayerState.BUFFERING) music(false);
        },
      },
    });
  } else {
    yt.loadVideoById(s.yt);                    // loadVideoById autoplays
  }
}
const music = on => document.dispatchEvent(new CustomEvent("music", { detail: on }));
document.addEventListener("music", e => result.classList.toggle("dancing", e.detail));
