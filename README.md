# Akinola Adeyi · Portfolio website (COS 106)

A five-page personal portfolio built with **HTML, CSS and plain JavaScript**, with no frameworks, libraries or build step.

**Live site:** https://akintolaadeyi-gif.github.io/cos106-portfolio/

## Pages

| Page | What it contains |
| --- | --- |
| `index.html` | Hero, spoken audio welcome, animated statistics, three featured projects |
| `about.html` | Video introduction (custom player, captions), education, experience, skills, career aspirations, hobbies |
| `projects.html` | Six projects generated from `js/data.js`, with category filters |
| `planner.html` | Academic Planner: add, complete and delete tasks, saved in localStorage |
| `contact.html` | Contact details and a validated contact form |

## JavaScript features

- **Academic Planner** (`js/planner.js`): add tasks with course, due date and priority; mark completed; delete; overdue warnings; progress bar; view filter; clear completed; tasks saved in `localStorage`; completion chime made with the Web Audio API.
- **Projects** (`js/data.js`, `js/projects.js`): cards built from an array of objects; filters using `Array.filter()`.
- **Shared** (`js/main.js`): mobile menu, light/dark theme saved in `localStorage`, scroll reveal with `IntersectionObserver`, counting statistics with `requestAnimationFrame`.
- **Media** (`js/media.js`): recorded audio welcome in my own voice (HTML audio); custom video player (play/pause, seek, time, captions, mute).
- **Contact** (`js/contact.js`): per-field validation rules, email regular expression, live character counter, `mailto:` sending.

## Structure

```
cos106-portfolio/
├── index.html, about.html, projects.html, planner.html, contact.html
├── css/style.css
├── js/main.js, data.js, projects.js, planner.js, contact.js, media.js
└── assets/
    ├── img/     project images and favicon
    └── media/   intro video (MP4 + WebM), poster, captions (WebVTT)
```

## Run locally

Open `index.html` in a browser. No installation is needed.

## Publish with GitHub Pages

1. Push this folder to a GitHub repository named `cos106-portfolio`.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After about a minute the site is live at `https://<username>.github.io/cos106-portfolio/`.

## Author

Adeyi Akinola · Software Engineering · 2025/C/SENG/1015
