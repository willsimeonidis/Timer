/* -----------------------------------------------------------
   GLOBAL ELEMENTS
----------------------------------------------------------- */

const targetInput = document.getElementById("target-datetime");
const displayMode = document.getElementById("display-mode");
const startTimerBtn = document.getElementById("start-timer");
const todayBtn = document.getElementById("today-btn");

const bigTimer = document.getElementById("big-timer");
const directionLabel = document.getElementById("direction-label");
const extraMessage = document.getElementById("extra-message");

const copyTimerBtn = document.getElementById("copy-timer");

const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");
const closeSettings = document.getElementById("close-settings");

const focusModeBtn = document.getElementById("focus-mode-btn");

const setDarkMode = document.getElementById("set-dark-mode");
const setHighContrast = document.getElementById("set-high-contrast");
const setMoreAnimations = document.getElementById("set-more-animations");
const setHoverGlow = document.getElementById("set-hover-glow");
const setRounded = document.getElementById("set-rounded");
const setExtraSpacing = document.getElementById("set-extra-spacing");
const setCompact = document.getElementById("set-compact");

/* -----------------------------------------------------------
   MAIN TIMER
----------------------------------------------------------- */

let mainTimerActive = false;
let mainTargetTime = null;

todayBtn.addEventListener("click", () => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    targetInput.value = now.toISOString().slice(0, 16);
});

startTimerBtn.addEventListener("click", () => {
    if (!targetInput.value) {
        alert("Choose a target date/time first.");
        return;
    }

    mainTargetTime = new Date(targetInput.value);
    mainTimerActive = true;
});

copyTimerBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(bigTimer.textContent);
});

/* Format time into d/h/m/s */
function formatTime(ms) {
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);

    const s = sec % 60;
    const m = min % 60;
    const h = hr % 24;

    return `${day}d ${h}h ${m}m ${s}s`;
}

function updateMainTimer() {
    if (!mainTimerActive || !mainTargetTime) return;

    const now = new Date();
    const diff = mainTargetTime - now;
    const past = diff < 0;
    const absDiff = Math.abs(diff);

    directionLabel.textContent = past ? "Time since target:" : "Time until target:";

    let displayValue = "";

    switch (displayMode.value) {
        case "seconds":
            displayValue = Math.floor(absDiff / 1000) + " sec";
            break;
        case "minutes":
            displayValue = (absDiff / 60000).toFixed(2) + " min";
            break;
        case "hours":
            displayValue = (absDiff / 3600000).toFixed(2) + " hr";
            break;
        case "days":
            displayValue = (absDiff / 86400000).toFixed(2) + " days";
            break;
        case "months":
            displayValue = (absDiff / (86400000 * 30)).toFixed(2) + " months";
            break;
        default:
            displayValue = formatTime(absDiff);
    }

    bigTimer.textContent = displayValue;
    extraMessage.textContent = past ? "Target time has passed." : "";
}

/* -----------------------------------------------------------
   SMART PRESETS
----------------------------------------------------------- */

document.querySelectorAll(".preset-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        applyPreset(btn.dataset.preset);
    });
});

function applyPreset(preset) {
    const now = new Date();

    switch (preset) {
        case "midnight":
            const midnight = new Date();
            midnight.setHours(23, 59, 59, 999);
            targetInput.value = midnight.toISOString().slice(0, 16);
            break;

        case "next-school-day":
            const next = new Date();
            next.setDate(next.getDate() + (next.getDay() === 5 ? 3 : 1));
            next.setHours(9, 0, 0, 0);
            targetInput.value = next.toISOString().slice(0, 16);
            break;

        case "end-school-day":
            const end = new Date();
            end.setHours(15, 20, 0, 0);
            targetInput.value = end.toISOString().slice(0, 16);
            break;

        case "end-week":
            const week = new Date();
            week.setDate(week.getDate() + (6 - week.getDay()));
            week.setHours(23, 59, 59, 999);
            targetInput.value = week.toISOString().slice(0, 16);
            break;

        case "end-weekend":
            const weekend = new Date();
            weekend.setDate(weekend.getDate() + (7 - weekend.getDay()));
            weekend.setHours(23, 59, 59, 999);
            targetInput.value = weekend.toISOString().slice(0, 16);
            break;

        case "christmas":
            const xmas = new Date(new Date().getFullYear(), 11, 25, 0, 0, 0);
            targetInput.value = xmas.toISOString().slice(0, 16);
            break;
    }

    mainTargetTime = new Date(targetInput.value);
    mainTimerActive = true;
}

/* -----------------------------------------------------------
   COUNTDOWN
----------------------------------------------------------- */

const cdDays = document.getElementById("cd-days");
const cdHours = document.getElementById("cd-hours");
const cdMinutes = document.getElementById("cd-minutes");
const cdSeconds = document.getElementById("cd-seconds");

const cdStart = document.getElementById("cd-start");
const cdPause = document.getElementById("cd-pause");
const cdReset = document.getElementById("cd-reset");

const cdDisplay = document.getElementById("cd-display");
const cdCircle = document.getElementById("cd-progress-circle");

let cdTotal = 0;
let cdRemaining = 0;
let cdRunning = false;
let cdInterval = null;

cdStart.addEventListener("click", () => {
    cdTotal =
        cdDays.value * 86400 +
        cdHours.value * 3600 +
        cdMinutes.value * 60 +
        Number(cdSeconds.value);

    if (cdTotal <= 0) {
        alert("Enter a valid countdown time.");
        return;
    }

    cdRemaining = cdTotal;
    cdRunning = true;

    clearInterval(cdInterval);
    cdInterval = setInterval(updateCountdown, 1000);
});

cdPause.addEventListener("click", () => {
    cdRunning = false;
});

cdReset.addEventListener("click", () => {
    cdRunning = false;
    cdRemaining = 0;
    cdDisplay.textContent = "--";
    cdCircle.style.background = "none";
});

function updateCountdown() {
    if (!cdRunning) return;

    cdRemaining--;

    if (cdRemaining <= 0) {
        cdRunning = false;
        cdDisplay.textContent = "Finished!";
        cdCircle.style.background = `
            conic-gradient(#111 360deg, rgba(0,0,0,0.12) 0deg)
        `;
        return;
    }

    cdDisplay.textContent = formatTime(cdRemaining * 1000);

    const progress = 1 - cdRemaining / cdTotal;

    cdCircle.style.background = `
        conic-gradient(#111 ${progress * 360}deg, rgba(0,0,0,0.12) 0deg)
    `;
}

/* -----------------------------------------------------------
   STOPWATCH
----------------------------------------------------------- */

const swStart = document.getElementById("sw-start");
const swPause = document.getElementById("sw-pause");
const swReset = document.getElementById("sw-reset");

const swAddSeconds = document.getElementById("sw-add-seconds");
const swAddBtn = document.getElementById("sw-add-btn");

const swDisplay = document.getElementById("sw-display");
const swCircle = document.getElementById("sw-progress-circle");
const swLaps = document.getElementById("sw-laps");

let swTime = 0;
let swRunning = false;
let swInterval = null;

swStart.addEventListener("click", () => {
    if (!swRunning) {
        swRunning = true;
        swInterval = setInterval(updateStopwatch, 100);
    }
});

swPause.addEventListener("click", () => {
    swRunning = false;
});

swReset.addEventListener("click", () => {
    swRunning = false;
    swTime = 0;
    swDisplay.textContent = "--";
    swCircle.style.background = "none";
    swLaps.innerHTML = "";
});

swAddBtn.addEventListener("click", () => {
    const add = Number(swAddSeconds.value);
    if (add > 0) {
        swTime += add * 1000;
    }
});

function updateStopwatch() {
    if (!swRunning) return;

    swTime += 100;

    const ms = swTime;
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);

    const s = sec % 60;
    const m = min % 60;
    const h = hr;

    swDisplay.textContent = `${h}h ${m}m ${s}s`;

    const progress = (ms % 60000) / 60000;

    swCircle.style.background = `
        conic-gradient(#111 ${progress * 360}deg, rgba(0,0,0,0.12) 0deg)
    `;
}

/* LAPS */

swDisplay.addEventListener("click", () => {
    const ms = swTime;
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);

    const s = sec % 60;
    const m = min % 60;
    const h = hr;

    const lap = document.createElement("div");
    lap.textContent = `Lap: ${h}h ${m}m ${s}s`;
    swLaps.appendChild(lap);
});

/* -----------------------------------------------------------
   COLLAPSIBLE PANELS
----------------------------------------------------------- */

document.querySelectorAll(".collapsible").forEach(title => {
    title.addEventListener("click", () => {
        title.classList.toggle("collapsed");
        const target = document.getElementById(title.dataset.target);
        if (target) target.style.display = title.classList.contains("collapsed") ? "none" : "block";
    });
});

/* -----------------------------------------------------------
   SETTINGS PANEL
----------------------------------------------------------- */

settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("hidden");
});

closeSettings.addEventListener("click", () => {
    settingsPanel.classList.add("hidden");
});

/* UI MODES */

setDarkMode.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", setDarkMode.checked);
});

setHighContrast.addEventListener("change", () => {
    document.body.classList.toggle("high-contrast", setHighContrast.checked);
});

setMoreAnimations.addEventListener("change", () => {
    document.body.classList.toggle("more-animations", setMoreAnimations.checked);
});

setHoverGlow.addEventListener("change", () => {
    document.body.classList.toggle("hover-glow", setHoverGlow.checked);
});

setRounded.addEventListener("change", () => {
    document.body.classList.toggle("rounded", setRounded.checked);
});

setExtraSpacing.addEventListener("change", () => {
    document.body.classList.toggle("extra-spacing", setExtraSpacing.checked);
});

setCompact.addEventListener("change", () => {
    document.body.classList.toggle("compact", setCompact.checked);
});

/* -----------------------------------------------------------
   FOCUS MODE
----------------------------------------------------------- */

focusModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("focus-mode-active");
});

/* -----------------------------------------------------------
   TUTORIAL
----------------------------------------------------------- */

const tutorialOverlay = document.getElementById("tutorial-overlay");
const tutorialHighlight = document.getElementById("tutorial-highlight");
const tutorialText = document.getElementById("tutorial-text");
const tutorialProgressFill = document.querySelector(".tutorial-progress-fill");

const openTutorialBtn = document.getElementById("open-tutorial");
const tutorialPrev = document.getElementById("tutorial-prev");
const tutorialNext = document.getElementById("tutorial-next");
const tutorialFinish = document.getElementById("tutorial-finish");

let tutorialRunning = false;
let tutorialIndex = 0;

const tutorialStepsData = [
    { selector: "#input-body", text: "This is where you choose your target date and time." },
    { selector: "#presets-body", text: "Smart presets give you quick shortcuts for common times." },
    { selector: "#display-body", text: "This is the main timer display." },
    { selector: "#tools-body", text: "Timer Tools include a countdown and stopwatch." }
];

function showTutorialStep() {
    const step = tutorialStepsData[tutorialIndex];
    const targetEl = document.querySelector(step.selector);
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();

    tutorialHighlight.style.left = `${rect.left + window.scrollX}px`;
    tutorialHighlight.style.top = `${rect.top + window.scrollY}px`;
    tutorialHighlight.style.width = `${rect.width}px`;
    tutorialHighlight.style.height = `${rect.height}px`;

    tutorialText.textContent = step.text;

    const percent = ((tutorialIndex + 1) / tutorialStepsData.length) * 100;
    tutorialProgressFill.style.width = `${percent}%`;

    const centerY = rect.top + window.scrollY - (window.innerHeight / 2) + (rect.height / 2);

    window.scrollTo({
        top: centerY,
        behavior: "smooth"
    });
}

openTutorialBtn.addEventListener("click", () => {
    tutorialOverlay.classList.remove("hidden");
    tutorialRunning = true;
    tutorialIndex = 0;

    document.body.style.overflow = "hidden";

    showTutorialStep();
});

tutorialNext.addEventListener("click", () => {
    if (!tutorialRunning) return;
    if (tutorialIndex < tutorialStepsData.length - 1) {
        tutorialIndex++;
        showTutorialStep();
    }
});

tutorialPrev.addEventListener("click", () => {
    if (!tutorialRunning) return;
    if (tutorialIndex > 0) {
        tutorialIndex--;
        showTutorialStep();
    }
});

tutorialFinish.addEventListener("click", () => {
    tutorialOverlay.classList.add("hidden");
    tutorialRunning = false;
    document.body.style.overflow = "";
});

tutorialOverlay.addEventListener("wheel", (e) => {
    if (tutorialRunning) e.preventDefault();
}, { passive: false });

/* -----------------------------------------------------------
   MAIN UPDATE LOOP
----------------------------------------------------------- */

function updateAll() {
    updateMainTimer();
    requestAnimationFrame(updateAll);
}

updateAll();
