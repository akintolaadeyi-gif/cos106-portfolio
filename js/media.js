/* =========================================================
   media.js — audio and video features
   1. Spoken welcome / "listen to this page" using the
      browser's Speech Synthesis API (no audio file needed)
   2. A custom video player for the video introduction:
      play/pause, seek bar, time, captions and mute
   ========================================================= */

// ---------- 1. Speech synthesis ----------
const WELCOME_TEXT =
  "Hi, I'm Akinola Adeyi, a software engineer. I work mainly on the frontend and I'm growing toward full-stack. " +
  "I build websites and web apps with React, Next dot J S and TypeScript. " +
  "Have a look at my projects, try the academic planner, and get in touch if you'd like to work together.";

function getBioText() {
  // Read the visible text of the main sections on the About page
  const parts = [...document.querySelectorAll("main h1, main .lead, main h2, main h3, main p")]
    .filter((el) => !el.closest(".listen, .player"))
    .map((el) => el.textContent.trim());
  return parts.join(". ");
}

function setupSpeechButton(button, getText) {
  if (!button) return;
  if (!("speechSynthesis" in window)) {
    button.closest(".listen").hidden = true; // hide it if the browser can't speak
    return;
  }

  button.addEventListener("click", () => {
    // Second click stops the speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(getText());
    utterance.lang = "en-GB";
    utterance.rate = 1;

    utterance.onstart = () => button.setAttribute("aria-pressed", "true"); // CSS swaps play for stop
    utterance.onend = utterance.onerror = () => button.setAttribute("aria-pressed", "false");

    speechSynthesis.speak(utterance);
  });
}

setupSpeechButton(document.getElementById("welcome-btn"), () => WELCOME_TEXT);
setupSpeechButton(document.getElementById("bio-btn"), getBioText);
window.addEventListener("beforeunload", () => { if ("speechSynthesis" in window) speechSynthesis.cancel(); });

// ---------- 2. Custom video player ----------
const video = document.getElementById("intro-video");

if (video) {
  const playBtn = document.getElementById("play-pause");
  const progress = document.getElementById("progress");
  const fill = document.getElementById("progress-fill");
  const timeLabel = document.getElementById("time");
  const ccBtn = document.getElementById("cc-btn");
  const muteBtn = document.getElementById("mute-btn");

  // 75 seconds → "1:15"
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  function togglePlay() {
    if (video.paused) video.play(); else video.pause();
  }

  playBtn.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);

  // Keep the button label in step with the video's real state
  video.addEventListener("play", () => { playBtn.dataset.playing = "true"; playBtn.setAttribute("aria-label", "Pause video"); });
  video.addEventListener("pause", () => { playBtn.dataset.playing = "false"; playBtn.setAttribute("aria-label", "Play video"); });

  // Update the progress bar and time as the video plays
  function updateProgress() {
    const percent = video.duration ? (video.currentTime / video.duration) * 100 : 0;
    fill.style.width = percent + "%";
    progress.setAttribute("aria-valuenow", Math.round(percent));
    timeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration || 0)}`;
  }
  video.addEventListener("timeupdate", updateProgress);
  video.addEventListener("loadedmetadata", updateProgress);

  // Click on the bar to jump to that point
  progress.addEventListener("click", (event) => {
    const rect = progress.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    video.currentTime = ratio * video.duration;
  });

  // Arrow keys seek 5 seconds when the bar has focus
  progress.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") video.currentTime = Math.min(video.duration, video.currentTime + 5);
    if (event.key === "ArrowLeft") video.currentTime = Math.max(0, video.currentTime - 5);
  });

  // Captions on/off
  ccBtn.addEventListener("click", () => {
    const track = video.textTracks[0];
    if (!track) return;
    const turnOn = track.mode !== "showing";
    track.mode = turnOn ? "showing" : "hidden";
    ccBtn.setAttribute("aria-pressed", turnOn);
  });

  // Mute
  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.setAttribute("aria-label", video.muted ? "Unmute" : "Mute");
    muteBtn.setAttribute("aria-pressed", video.muted);
  });
}
