/* =========================================================
   planner.js — the Academic Planner
   Users can add tasks, mark them completed and delete them.
   Every task is an object in the `tasks` array. After any
   change we save the array to localStorage and re-render the
   list, so the screen always matches the data.
   ========================================================= */

const STORAGE_KEY = "academic-planner-tasks";

const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const courseInput = document.getElementById("task-course");
const dueInput = document.getElementById("task-due");
const priorityInput = document.getElementById("task-priority");
const titleError = document.getElementById("title-error");
const list = document.getElementById("task-list");
const stats = document.getElementById("task-stats");
const progressBar = document.getElementById("progress-bar");
const clearDoneBtn = document.getElementById("clear-done");
const soundToggle = document.getElementById("sound-toggle");
const showButtons = document.querySelectorAll("[data-show]");

let currentView = "all"; // "all", "active" or "done"

// ---------- Load and save ----------
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved); // text → array of objects
  } catch (e) { /* storage blocked or corrupted */ }

  // First visit: a few example tasks so the planner isn't empty
  return [
    { id: 1, title: "Submit COS 106 portfolio", course: "COS 106", due: "", priority: "high", done: false },
    { id: 2, title: "Revise JavaScript DOM notes", course: "COS 106", due: "", priority: "medium", done: false },
    { id: 3, title: "Read chapter 3 of the course text", course: "GST 101", due: "", priority: "low", done: true }
  ];
}

function saveTasks() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch (e) { /* storage blocked */ }
}

let tasks = loadTasks();

// ---------- Helpers ----------
function formatDate(isoDate) {
  if (!isoDate) return "No due date";
  const date = new Date(isoDate + "T00:00:00");
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function isOverdue(task) {
  if (!task.due || task.done) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.due + "T00:00:00") < today;
}

// Escape user text before putting it into innerHTML, so typing
// "<b>" shows the characters instead of changing the page
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---------- Sound: a short chime made with the Web Audio API ----------
let audioCtx = null;
function playChime() {
  if (!soundToggle.checked) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  if (!audioCtx) audioCtx = new AudioContext();

  // Two quick notes (C6 then E6), each fading out
  [1046.5, 1318.5].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const start = audioCtx.currentTime + i * 0.12;
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.2, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(start);
    osc.stop(start + 0.35);
  });
}

// ---------- Render ----------
function render() {
  const visible = tasks.filter((task) => {
    if (currentView === "active") return !task.done;
    if (currentView === "done") return task.done;
    return true;
  });

  if (visible.length === 0) {
    const messages = { all: "No tasks yet. Add your first one.", active: "Nothing left to do. Well done!", done: "No completed tasks yet." };
    list.innerHTML = `<li class="empty">${messages[currentView]}</li>`;
  } else {
    list.innerHTML = visible.map((task) => `
      <li class="task ${task.done ? "done" : ""}" data-id="${task.id}">
        <input type="checkbox" ${task.done ? "checked" : ""} aria-label="Mark ${escapeHtml(task.title)} as completed">
        <div>
          <div class="task-title">${escapeHtml(task.title)}</div>
          <div class="task-info">
            <span class="priority ${task.priority}"></span>${task.priority} priority
            ${task.course ? " · " + escapeHtml(task.course) : ""}
            · <span class="${isOverdue(task) ? "overdue" : ""}">${isOverdue(task) ? "Overdue: " : ""}${formatDate(task.due)}</span>
          </div>
        </div>
        <button class="delete-btn" type="button" aria-label="Delete ${escapeHtml(task.title)}">Delete</button>
      </li>`).join("");
  }

  // Counts and progress bar
  const doneCount = tasks.filter((t) => t.done).length;
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  stats.textContent = `${doneCount} of ${tasks.length} tasks completed (${percent}%)`;
  progressBar.style.width = percent + "%";
  clearDoneBtn.disabled = doneCount === 0;
}

// ---------- Add a task ----------
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the browser reloading the page

  const title = titleInput.value.trim();
  if (title.length < 3) {
    titleError.textContent = "Please enter a task of at least 3 characters.";
    titleInput.parentElement.classList.add("invalid");
    titleInput.focus();
    return;
  }
  titleError.textContent = "";
  titleInput.parentElement.classList.remove("invalid");

  tasks.unshift({            // unshift puts the new task at the top
    id: Date.now(),          // a unique number for this task
    title: title,
    course: courseInput.value.trim(),
    due: dueInput.value,
    priority: priorityInput.value,
    done: false
  });

  saveTasks();
  render();
  form.reset();
  priorityInput.value = "medium";
  titleInput.focus();
});

// ---------- Complete and delete (event delegation) ----------
// One listener on the list handles every task, including tasks
// added later, by checking what was clicked.
list.addEventListener("click", (event) => {
  const item = event.target.closest(".task");
  if (!item) return;
  const id = Number(item.dataset.id);

  if (event.target.matches('input[type="checkbox"]')) {
    const task = tasks.find((t) => t.id === id);
    task.done = !task.done;
    if (task.done) playChime();
  }

  if (event.target.matches(".delete-btn")) {
    tasks = tasks.filter((t) => t.id !== id);
  }

  saveTasks();
  render();
});

// ---------- View filter ----------
showButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentView = btn.dataset.show;
    showButtons.forEach((b) => b.classList.toggle("active", b === btn));
    render();
  });
});

// ---------- Clear completed ----------
clearDoneBtn.addEventListener("click", () => {
  const doneCount = tasks.filter((t) => t.done).length;
  if (confirm(`Delete ${doneCount} completed task(s)?`)) {
    tasks = tasks.filter((t) => !t.done);
    saveTasks();
    render();
  }
});

render();
