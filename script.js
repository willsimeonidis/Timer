// --------------------------------------------------
// ELEMENTS
// --------------------------------------------------

const targetInput = document.getElementById("target-datetime");
const displayModeEl = document.getElementById("display-mode");
const startBtn = document.getElementById("start-timer");
const todayBtn = document.getElementById("today-btn");

const directionLabelEl = document.getElementById("direction-label");
const bigTimerEl = document.getElementById("big-timer");
const extraMessageEl = document.getElementById("extra-message");
const copyBtn = document.getElementById("copy-timer");

const progressBarEl = document.getElementById("progress-bar");
const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");
const toggleProgressBar = document.getElementById("toggle-progress-bar");
const toggleProgressCircle = document.getElementById("toggle-progress-circle");
const closeSettingsBtn = document.getElementById("close-settings");

const focusModeBtn = document.getElementById("focus-mode-btn");

const presetButtons = document.querySelectorAll(".preset-btn");

const tutorialOverlay = document.getElementById("tutorial-overlay");
const tutorialWelcome = document.getElementById("tutorial-welcome");
const tutorialProceed = document.getElementById("tutorial-proceed");
const tutorialSkip = document.getElementById("tutorial-skip");
const tutorialSteps = document.getElementById("tutorial-steps");
const tutorialHighlight = document.getElementById("tutorial-highlight");
const tutorialText = document.getElementById("tutorial-text");
const tutorialPrev = document.getElementById("tutorial-prev");
const tutorialNext = document.getElementById("tutorial-next");
const tutorialFinish = document.getElementById("tutorial-finish");
const tutorialProgressBar = document.getElementById("tutorial-progress-bar");

const openTutorialBtn = document.getElementById("open-tutorial");

const sectionInput = document.getElementById("section-input");
const sectionDisplay = document.getElementById("section-display");
const sectionPresets = document.getElementById("section-presets");

// --------------------------------------------------
// STATE
// --------------------------------------------------

let timerInterval = null;
let lastCompactText = "--";
let initialDiffMs = null;

let progressBarFill = null;
let progressCircleEl = null;

let tutorialIntroActive = false;
let tutorialRunning = false;
let tutorialIndex = 0;

// --------------------------------------------------
// INIT STRUCTURE (PROGRESS BAR / CIRCLE / TUTORIAL BAR)
// --------------------------------------------------

function initProgressBar() {
    progressBarFill = document.createElement("div");
    progressBarFill.className = "progress-bar-fill";
    progressBarEl.appendChild(progressBarFill);
}

function initProgressCircle() {
    progressCircleEl = document.createElement("div");
    progressCircleEl.className = "progress-circle";
    sectionDisplay.style.position = "relative";
    sectionDisplay.appendChild(progressCircleEl);
}

function initTutorialProgressBar() {
    const fill = document.createElement("div");
    fill.className = "tutorial-progress-fill";
    tutorialProgressBar.appendChild(fill);
}

initProgressBar();
initProgressCircle();
initTutorialProgressBar();

// --------------------------------------------------
// TIMER LOGIC
// --------------------------------------------------

startBtn.addEventListener("click", () => {
    const targetValue = targetInput.value;
    if (!targetValue) {
        directionLabelEl.textContent = "Pick a date & time first.";
        bigTimerEl.textContent = "--";
        extraMessageEl.textContent = "";
        lastCompactText = "--";
        resetProgress();
        return;
    }

    const targetDate = new Date(targetValue);
    if (isNaN(targetDate.getTime())) {
        directionLabelEl.textContent = "Invalid date.";
        bigTimerEl.textContent = "--";
        extraMessageEl.textContent = "";
        lastCompactText = "--";
        resetProgress();
        return;
    }

    startTimerWithDate(targetDate);
});

function startTimerWithDate(targetDate) {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    const now = new Date();
    initialDiffMs = Math.abs(targetDate.getTime() - now.getTime());

    updateTimer(targetDate);
    timerInterval = setInterval(() => updateTimer(targetDate), 1000);
}

function updateTimer(targetDate) {
    const now = new Date();
    let diffMs = targetDate.getTime() - now.getTime();
    const isFuture = diffMs >= 0;

    const absDiffMs = Math.abs(diffMs);
    const totalSeconds = Math.floor(absDiffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const approxMonths = Math.floor(totalDays / 30);

    const years = Math.floor(totalDays / 365);
    const remainingDaysAfterYears = totalDays - years * 365;
    const hours = totalHours - totalDays * 24;
    const minutes = totalMinutes - totalHours * 60;
    const seconds = totalSeconds - totalMinutes * 60;

    const mode = displayModeEl.value;

    if (isFuture) {
        directionLabelEl.textContent = "Time until that moment";
    } else {
        directionLabelEl.textContent = "Time since that moment";
    }

    let displayText = "";
    let compactText = "";

    switch (mode) {
        case "seconds":
            displayText = `${totalSeconds.toLocaleString()} seconds`;
            compactText = `${totalSeconds}s`;
            break;
        case "minutes":
            displayText = `${totalMinutes.toLocaleString()} minutes`;
            compactText = `${totalMinutes}m`;
            break;
        case "hours":
            displayText = `${totalHours.toLocaleString()} hours`;
            compactText = `${totalHours}h`;
            break;
        case "days":
            displayText = `${totalDays.toLocaleString()} days`;
            compactText = `${totalDays}d`;
            break;
        case "months":
            displayText = `${approxMonths.toLocaleString()} months (approx)`;
            compactText = `${approxMonths}mo`;
            break;
        case "normal":
        default:
            displayText = buildNormalText(years, remainingDaysAfterYears, hours, minutes, seconds);
            compactText = buildCompactText(totalDays, hours, minutes, seconds);
            break;
    }

    bigTimerEl.textContent = displayText;
    lastCompactText = compactText;
    triggerTimerFade();

    if (isFuture) {
        extraMessageEl.textContent = "";
    } else {
        extraMessageEl.textContent = "That time has already passed – now showing how long it’s been.";
    }

    updateProgress(absDiffMs, isFuture);
}

function buildNormalText(years, days, hours, minutes, seconds) {
    const parts = [];

    if (years) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
    if (days) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
    if (hours) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (minutes) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    if (seconds || parts.length === 0) parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

    return parts.join(", ");
}

function buildCompactText(days, hours, minutes, seconds) {
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds || parts.length === 0) parts.push(`${seconds}s`);
    return parts.join(" ");
}

function triggerTimerFade() {
    bigTimerEl.style.animation = "none";
    // force reflow
    void bigTimerEl.offsetWidth;
    bigTimerEl.style.animation = "fadeInTimer 0.4s ease forwards";
}

// --------------------------------------------------
// PROGRESS BAR / CIRCLE
// --------------------------------------------------

function resetProgress() {
    if (progressBarFill) {
        progressBarFill.style.width = "0%";
    }
}

function updateProgress(absDiffMs, isFuture) {
    if (!progressBarFill || initialDiffMs === null || initialDiffMs === 0) return;

    let percent = 100;
    if (isFuture) {
        const used = initialDiffMs - absDiffMs;
        percent = Math.max(0, Math.min(100, (used / initialDiffMs) * 100));
    }

    progressBarFill.style.width = `${percent}%`;
}

// --------------------------------------------------
// SETTINGS PANEL
// --------------------------------------------------

settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.remove("hidden");
});

closeSettingsBtn.addEventListener("click", () => {
    settingsPanel.classList.add("hidden");
});

toggleProgressBar.addEventListener("change", () => {
    if (toggleProgressBar.checked) {
        progressBarEl.style.display = "block";
    } else {
        progressBarEl.style.display = "none";
    }
});

toggleProgressCircle.addEventListener("change", () => {
    if (!progressCircleEl) return;
    if (toggleProgressCircle.checked) {
        progressCircleEl.style.display = "block";
    } else {
        progressCircleEl.style.display = "none";
    }
});

// default: show bar, hide circle
toggleProgressBar.checked = true;
progressBarEl.style.display = "block";
toggleProgressCircle.checked = false;
progressCircleEl.style.display = "none";

// --------------------------------------------------
// FOCUS MODE
// --------------------------------------------------

focusModeBtn.addEventListener("click", () => {
    const body = document.body;
    if (body.classList.contains("focus-mode-active")) {
        body.classList.remove("focus-mode-active");
        focusModeBtn.textContent = "Focus mode";
    } else {
        body.classList.add("focus-mode-active");
        focusModeBtn.textContent = "Exit focus";
    }
});

// --------------------------------------------------
// TODAY BUTTON
// --------------------------------------------------

todayBtn.addEventListener("click", () => {
    const now = new Date();
    targetInput.value = formatDateTimeLocal(now);
});

function formatDateTimeLocal(date) {
    const pad = (n) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// --------------------------------------------------
// COPY BUTTON
// --------------------------------------------------

copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(lastCompactText);
    } catch (e) {
        console.log("Clipboard error:", e);
    }
});

// --------------------------------------------------
// PRESETS (DENISON / BATHURST LOGIC)
// --------------------------------------------------

presetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const preset = btn.dataset.preset;
        handlePreset(preset);
    });
});

function handlePreset(preset) {
    const now = new Date();
    let target = null;

    switch (preset) {
        case "midnight":
            target = getNextMidnight(now);
            break;
        case "next-school-day":
            target = getNextSchoolStart(now);
            break;
        case "end-school-day":
            target = getEndSchoolDay(now);
            break;
        case "end-week":
            target = getEndOfWeek(now);
            break;
        case "end-weekend":
            target = getEndOfWeekend(now);
            break;
        case "christmas":
            target = getChristmas(now);
            break;
        case "natural":
            extraMessageEl.textContent = "Use the main inputs above for custom times.";
            return;
        default:
            return;
    }

    targetInput.value = formatDateTimeLocal(target);
    startTimerWithDate(target);
}

function getNextMidnight(now) {
    const next = new Date(now);
    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
    return next;
}

function isSchoolDay(date) {
    const day = date.getDay(); // 0=Sun, 1=Mon, ... 6=Sat
    return day >= 1 && day <= 5;
}

function getNextSchoolStart(now) {
    const next = new Date(now);

    if (isSchoolDay(next)) {
        const start = new Date(next);
        start.setHours(9, 0, 0, 0);
        if (now < start) return start;
    }

    // move to next school day
    do {
        next.setDate(next.getDate() + 1);
    } while (!isSchoolDay(next));

    next.setHours(9, 0, 0, 0);
    return next;
}

function getEndSchoolDay(now) {
    const endToday = new Date(now);
    endToday.setHours(15, 20, 0, 0);

    if (isSchoolDay(now) && now < endToday) {
        return endToday;
    }

    const next = getNextSchoolStart(now);
    const endNext = new Date(next);
    endNext.setHours(15, 20, 0, 0);
    return endNext;
}

function getEndOfWeek(now) {
    const next = new Date(now);
    const day = next.getDay(); // 0=Sun, 1=Mon, ... 6=Sat

    const daysUntilFriday = (5 - day + 7) % 7;
    next.setDate(next.getDate() + daysUntilFriday);
    next.setHours(15, 20, 0, 0);

    if (now < next) return next;

    next.setDate(next.getDate() + 7);
    return next;
}

function getEndOfWeekend(now) {
    const next = new Date(now);
    const day = next.getDay(); // 0=Sun, 1=Mon, ... 6=Sat

    const daysUntilSunday = (0 - day + 7) % 7;
    next.setDate(next.getDate() + daysUntilSunday);
    next.setHours(23, 59, 59, 0);

    if (now < next) return next;

    next.setDate(next.getDate() + 7);
    return next;
}

function getChristmas(now) {
    const year = now.getFullYear();
    let christmas = new Date(year, 11, 25, 0, 0, 0, 0); // Dec = 11

    if (now > christmas) {
        christmas = new Date(year + 1, 11, 25, 0, 0, 0, 0);
    }
    return christmas;
}

// --------------------------------------------------
// TUTORIAL LOGIC
// --------------------------------------------------

const tutorialStepsData = [
    {
        selector: "#section-input",
        text: "This area lets you choose any date and time, and how you want the time to be displayed."
    },
    {
        selector: "#target-datetime",
        text: "Tap here to select the exact date and time you want to count to or from."
    },
    {
        selector: "#display-mode",
        text: "Use this menu to switch between normal, seconds, minutes, hours, days, or approximate months."
    },
    {
        selector: "#start-timer",
        text: "Press this button to show the time between now and your chosen moment."
    },
    {
        selector: "#section-display",
        text: "This panel shows the main timer, progress bar, and extra messages."
    },
    {
        selector: "#section-presets",
        text: "These smart presets use Bathurst / Denison school times to quickly set useful targets."
    }
];

openTutorialBtn.addEventListener("click", () => {
    tutorialOverlay.classList.remove("hidden");
    tutorialWelcome.classList.remove("hidden");
    tutorialSteps.classList.add("hidden");
    tutorialIntroActive = true;
    tutorialRunning = false;
});

tutorialProceed.addEventListener("click", () => {
    if (!tutorialIntroActive) return;
    tutorialWelcome.classList.add("hidden");
    tutorialSteps.classList.remove("hidden");
    tutorialRunning = true;
    tutorialIndex = 0;
    showTutorialStep();
});

tutorialSkip.addEventListener("click", () => {
    closeTutorial();
});

tutorialPrev.addEventListener("click", () => {
    if (!tutorialRunning) return;
    if (tutorialIndex > 0) {
        tutorialIndex--;
        showTutorialStep();
    }
});

tutorialNext.addEventListener("click", () => {
    if (!tutorialRunning) return;
    if (tutorialIndex < tutorialStepsData.length - 1) {
        tutorialIndex++;
        showTutorialStep();
    }
});

tutorialFinish.addEventListener("click", () => {
    closeTutorial();
});

function closeTutorial() {
    tutorialOverlay.classList.add("hidden");
    tutorialIntroActive = false;
    tutorialRunning = false;
}

function showTutorialStep() {
    const step = tutorialStepsData[tutorialIndex];
    const targetEl = document.querySelector(step.selector);
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();

    tutorialHighlight.style.left = `${rect.left + window.scrollX - 6}px`;
    tutorialHighlight.style.top = `${rect.top + window.scrollY - 6}px`;
    tutorialHighlight.style.width = `${rect.width + 12}px`;
    tutorialHighlight.style.height = `${rect.height + 12}px`;

    tutorialText.classList.remove("slide-in");
    void tutorialText.offsetWidth;
    tutorialText.textContent = step.text;
    tutorialText.classList.add("slide-in");

    updateTutorialProgress();
}

function updateTutorialProgress() {
    const fill = tutorialProgressBar.querySelector(".tutorial-progress-fill");
    if (!fill) return;
    const percent = ((tutorialIndex + 1) / tutorialStepsData.length) * 100;
    fill.style.width = `${percent}%`;
}

// --------------------------------------------------
// AUTO-SHOW TUTORIAL ON FIRST LOAD (ONE-TIME FEEL)
// --------------------------------------------------

window.addEventListener("load", () => {
    tutorialOverlay.classList.remove("hidden");
    tutorialWelcome.classList.remove("hidden");
    tutorialSteps.classList.add("hidden");
    tutorialIntroActive = true;
});
