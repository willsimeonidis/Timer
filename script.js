/* -----------------------------------------------------------
   GLOBALS
----------------------------------------------------------- */

let tutorialRunning = false;
let tutorialIndex = 0;

const tutorialOverlay = document.getElementById("tutorial-overlay");
const tutorialHighlight = document.getElementById("tutorial-highlight");
const tutorialText = document.getElementById("tutorial-text");
const tutorialProgressFill = document.querySelector(".tutorial-progress-fill");

const openTutorialBtn = document.getElementById("open-tutorial");
const tutorialPrev = document.getElementById("tutorial-prev");
const tutorialNext = document.getElementById("tutorial-next");
const tutorialFinish = document.getElementById("tutorial-finish");

const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");
const closeSettings = document.getElementById("close-settings");

const setTutGlow = document.getElementById("set-tut-glow");
const setTutSpotlight = document.getElementById("set-tut-spotlight");

const setDarkMode = document.getElementById("set-dark-mode");
const setHighContrast = document.getElementById("set-high-contrast");
const setMoreAnimations = document.getElementById("set-more-animations");
const setHoverGlow = document.getElementById("set-hover-glow");
const setRounded = document.getElementById("set-rounded");
const setExtraSpacing = document.getElementById("set-extra-spacing");
const setCompact = document.getElementById("set-compact");

const setFPS = document.getElementById("set-fps");
const fpsDisplay = document.getElementById("fps-display");

let lastFrameTime = performance.now();
let fpsEnabled = false;

/* -----------------------------------------------------------
   TUTORIAL STEPS
----------------------------------------------------------- */

const tutorialStepsData = [
    {
        selector: "#section-input",
        text: "This is where you choose your target date and time."
    },
    {
        selector: "#section-display",
        text: "This is the main timer display. It shows time until your target."
    },
    {
        selector: "#section-range",
        text: "Two-time mode lets you track progress between two dates."
    },
    {
        selector: "#section-presets",
        text: "Smart presets give you quick shortcuts for common times."
    },
    {
        selector: "#section-tools",
        text: "Timer Tools include a countdown and stopwatch that run alongside the main timer."
    }
];

/* -----------------------------------------------------------
   TUTORIAL CENTER SCROLL + HIGHLIGHT
----------------------------------------------------------- */

function showTutorialStep() {
    const step = tutorialStepsData[tutorialIndex];
    const targetEl = document.querySelector(step.selector);
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();

    // Highlight EXACT element
    tutorialHighlight.style.left = `${rect.left + window.scrollX}px`;
    tutorialHighlight.style.top = `${rect.top + window.scrollY}px`;
    tutorialHighlight.style.width = `${rect.width}px`;
    tutorialHighlight.style.height = `${rect.height}px`;

    tutorialText.textContent = step.text;

    const percent = ((tutorialIndex + 1) / tutorialStepsData.length) * 100;
    tutorialProgressFill.style.width = `${percent}%`;

    tutorialHighlight.style.boxShadow = setTutGlow.checked
        ? "0 0 16px rgba(255,255,255,0.8)"
        : "none";

    // Spotlight mode
    tutorialOverlay.querySelector(".tutorial-backdrop").style.background =
        setTutSpotlight.checked ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.55)";

    // CENTER SCROLL
    const centerY = rect.top + window.scrollY - (window.innerHeight / 2) + (rect.height / 2);

    window.scrollTo({
        top: centerY,
        behavior: "smooth"
    });
}

/* -----------------------------------------------------------
   TUTORIAL START / END
----------------------------------------------------------- */

openTutorialBtn.addEventListener("click", () => {
    tutorialOverlay.classList.remove("hidden");
    tutorialRunning = true;
    tutorialIndex = 0;

    // Lock scrolling
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

    // Restore scrolling
    document.body.style.overflow = "";
});

/* Prevent scroll wheel from moving page */
tutorialOverlay.addEventListener("wheel", (e) => {
    if (tutorialRunning) e.preventDefault();
}, { passive: false });

/* -----------------------------------------------------------
   SETTINGS PANEL TOGGLE
----------------------------------------------------------- */

settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("hidden");
});

closeSettings.addEventListener("click", () => {
    settingsPanel.classList.add("hidden");
});

/* -----------------------------------------------------------
   UI MODES
----------------------------------------------------------- */

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
   FPS COUNTER
----------------------------------------------------------- */

function updateFPS() {
    const now = performance.now();
    const delta = now - lastFrameTime;
    lastFrameTime = now;

    const fps = Math.round(1000 / delta);

    if (fpsEnabled) {
        fpsDisplay.textContent = `FPS: ${fps}`;
    }

    requestAnimationFrame(updateFPS);
}

setFPS.addEventListener("change", () => {
    fpsEnabled = setFPS.checked;
    fpsDisplay.style.display = fpsEnabled ? "block" : "none";
});

updateFPS();

/* -----------------------------------------------------------
   MAIN TIMER LOGIC (STARTS NEXT PART)
----------------------------------------------------------- */
/* -----------------------------------------------------------
   MAIN TIMER LOGIC
----------------------------------------------------------- */

const targetInput = document.getElementById("target-datetime");
const displayMode = document.getElementById("display-mode");
const startTimerBtn = document.getElementById("start-timer");
const todayBtn = document.getElementById("today-btn");

const bigTimer = document.getElementById("big-timer");
const directionLabel = document.getElementById("direction-label");
const extraMessage = document.getElementById("extra-message");

const mainProgressBar = document.getElementById("main-progress-bar");
const mainProgressFill = document.getElementById("main-progress-fill");
const mainProgressCircle = document.getElementById("main-progress-circle");

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

/* -----------------------------------------------------------
   MAIN TIMER UPDATE LOOP
----------------------------------------------------------- */

function updateMainTimer() {
    if (!mainTimerActive || !mainTargetTime) return;

    const now = new Date();
    const diff = mainTargetTime - now;

    const past = diff < 0;
    const absDiff = Math.abs(diff);

    // Direction label
    directionLabel.textContent = past ? "Time since target:" : "Time until target:";

    // Format display
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

    // Extra message
    extraMessage.textContent = past ? "Target time has passed." : "";

    // Progress bar
    const total = Math.abs(mainTargetTime - new Date(targetInput.value));
    const progress = Math.min(absDiff / total, 1);

    mainProgressFill.style.width = `${(1 - progress) * 100}%`;

    // Progress circle
    const circleProgress = (1 - progress);
    mainProgressCircle.style.background = `
        conic-gradient(#111 ${circleProgress * 360}deg, transparent 0deg)
    `;
}

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

/* -----------------------------------------------------------
   TWO-TIME RANGE MODE
----------------------------------------------------------- */

const rangeStart = document.getElementById("range-start");
const rangeEnd = document.getElementById("range-end");
const rangeActivate = document.getElementById("range-activate");

const rangeLabel = document.getElementById("range-label");
const rangeTimer = document.getElementById("range-timer");
const rangeExtra = document.getElementById("range-extra");

const rangeProgressFill = document.getElementById("range-progress-fill");
const rangeProgressCircle = document.getElementById("range-progress-circle");

let rangeActive = false;
let rangeStartTime = null;
let rangeEndTime = null;

rangeActivate.addEventListener("click", () => {
    if (!rangeStart.value || !rangeEnd.value) {
        alert("Choose both start and end times.");
        return;
    }

    rangeStartTime = new Date(rangeStart.value);
    rangeEndTime = new Date(rangeEnd.value);

    if (rangeEndTime <= rangeStartTime) {
        alert("End time must be after start time.");
        return;
    }

    rangeActive = true;
    rangeLabel.textContent = "Range active:";
});

/* -----------------------------------------------------------
   RANGE UPDATE LOOP
----------------------------------------------------------- */

function updateRangeTimer() {
    if (!rangeActive) return;

    const now = new Date();

    const total = rangeEndTime - rangeStartTime;
    const elapsed = now - rangeStartTime;
    const remaining = rangeEndTime - now;

    const progress = Math.min(Math.max(elapsed / total, 0), 1);

    rangeTimer.textContent = `${(progress * 100).toFixed(2)}%`;

    rangeExtra.textContent =
        `Elapsed: ${formatTime(elapsed)} | Remaining: ${formatTime(remaining)}`;

    rangeProgressFill.style.width = `${progress * 100}%`;

    rangeProgressCircle.style.background = `
        conic-gradient(#111 ${progress * 360}deg, transparent 0deg)
    `;
}

/* -----------------------------------------------------------
   COUNTDOWN TIMER
----------------------------------------------------------- */

const cdDays = document.getElementById("cd-days");
const cdHours = document.getElementById("cd-hours");
const cdMinutes = document.getElementById("cd-minutes");
const cdSeconds = document.getElementById("cd-seconds");

const cdStart = document.getElementById("cd-start");
const cdPause = document.getElementById("cd-pause");
const cdReset = document.getElementById("cd-reset");

const cdDisplay = document.getElementById("cd-display");
const cdProgressFill = document.getElementById("cd-progress-fill");
const cdProgressCircle = document.getElementById("cd-progress-circle");

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
    cdProgressFill.style.width = "0%";
    cdProgressCircle.style.background = "none";
});

function updateCountdown() {
    if (!cdRunning) return;

    cdRemaining--;

    if (cdRemaining <= 0) {
        cdRunning = false;
        cdDisplay.textContent = "Finished!";
        cdProgressFill.style.width = "100%";

        document.getElementById("timer-tools-title").classList.add("flash-tools");
        setTimeout(() => {
            document.getElementById("timer-tools-title").classList.remove("flash-tools");
        }, 3000);

        return;
    }

    cdDisplay.textContent = formatTime(cdRemaining * 1000);

    const progress = 1 - cdRemaining / cdTotal;
    cdProgressFill.style.width = `${progress * 100}%`;

    cdProgressCircle.style.background = `
        conic-gradient(#111 ${progress * 360}deg, transparent 0deg)
    `;
}

/* -----------------------------------------------------------
   STOPWATCH (CONTINUES NEXT PART)
----------------------------------------------------------- */
/* -----------------------------------------------------------
   STOPWATCH
----------------------------------------------------------- */

const swStart = document.getElementById("sw-start");
const swPause = document.getElementById("sw-pause");
const swReset = document.getElementById("sw-reset");

const swAddSeconds = document.getElementById("sw-add-seconds");
const swAddBtn = document.getElementById("sw-add-btn");

const swDisplay = document.getElementById("sw-display");
const swProgressFill = document.getElementById("sw-progress-fill");
const swProgressCircle = document.getElementById("sw-progress-circle");
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
    swProgressFill.style.width = "0%";
    swProgressCircle.style.background = "none";
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

    if (document.getElementById("set-sw-ms").checked) {
        swDisplay.textContent = `${h}h ${m}m ${s}s ${ms % 1000}ms`;
    } else {
        swDisplay.textContent = `${h}h ${m}m ${s}s`;
    }

    const progress = (ms % 60000) / 60000;
    swProgressFill.style.width = `${progress * 100}%`;

    swProgressCircle.style.background = `
        conic-gradient(#111 ${progress * 360}deg, transparent 0deg)
    `;
}

/* -----------------------------------------------------------
   LAPS
----------------------------------------------------------- */

swDisplay.addEventListener("click", () => {
    if (!document.getElementById("set-sw-laps").checked) return;

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
   MAIN UPDATE LOOP
----------------------------------------------------------- */

function updateAll() {
    updateMainTimer();
    updateRangeTimer();
    requestAnimationFrame(updateAll);
}

updateAll();
