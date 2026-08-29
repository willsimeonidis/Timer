// ELEMENTS
const targetInput = document.getElementById("target-datetime");
const displayModeEl = document.getElementById("display-mode");
const startBtn = document.getElementById("start-timer");
const todayBtn = document.getElementById("today-btn");

const directionLabelEl = document.getElementById("direction-label");
const bigTimerEl = document.getElementById("big-timer");
const extraMessageEl = document.getElementById("extra-message");
const copyBtn = document.getElementById("copy-timer");

const mainBar = document.getElementById("main-progress-bar");
const mainBarFill = document.getElementById("main-progress-fill");
const mainCircle = document.getElementById("main-progress-circle");

const rangeStartInput = document.getElementById("range-start");
const rangeEndInput = document.getElementById("range-end");
const rangeActivateBtn = document.getElementById("range-activate");
const rangeLabel = document.getElementById("range-label");
const rangeTimerEl = document.getElementById("range-timer");
const rangeExtraEl = document.getElementById("range-extra");
const rangeBar = document.getElementById("range-progress-bar");
const rangeBarFill = document.getElementById("range-progress-fill");
const rangeCircle = document.getElementById("range-progress-circle");

const presetButtons = document.querySelectorAll(".preset-btn");

const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");
const closeSettingsBtn = document.getElementById("close-settings");

const focusModeBtn = document.getElementById("focus-mode-btn");
const timerToolsBtn = document.getElementById("timer-tools-btn");
const sectionTools = document.getElementById("section-tools");

const cdDays = document.getElementById("cd-days");
const cdHours = document.getElementById("cd-hours");
const cdMinutes = document.getElementById("cd-minutes");
const cdSeconds = document.getElementById("cd-seconds");
const cdStartBtn = document.getElementById("cd-start");
const cdPauseBtn = document.getElementById("cd-pause");
const cdResetBtn = document.getElementById("cd-reset");
const cdDisplay = document.getElementById("cd-display");
const cdBar = document.getElementById("cd-progress-bar");
const cdBarFill = document.getElementById("cd-progress-fill");
const cdCircle = document.getElementById("cd-progress-circle");

const swStartBtn = document.getElementById("sw-start");
const swPauseBtn = document.getElementById("sw-pause");
const swResetBtn = document.getElementById("sw-reset");
const swAddSecondsInput = document.getElementById("sw-add-seconds");
const swAddBtn = document.getElementById("sw-add-btn");
const swDisplay = document.getElementById("sw-display");
const swBar = document.getElementById("sw-progress-bar");
const swBarFill = document.getElementById("sw-progress-fill");
const swCircle = document.getElementById("sw-progress-circle");
const swLaps = document.getElementById("sw-laps");

const openTutorialBtn = document.getElementById("open-tutorial");
const tutorialOverlay = document.getElementById("tutorial-overlay");
const tutorialSteps = document.getElementById("tutorial-steps");
const tutorialHighlight = document.getElementById("tutorial-highlight");
const tutorialText = document.getElementById("tutorial-text");
const tutorialPrev = document.getElementById("tutorial-prev");
const tutorialNext = document.getElementById("tutorial-next");
const tutorialFinish = document.getElementById("tutorial-finish");
const tutorialProgressBar = document.getElementById("tutorial-progress-bar");
const tutorialProgressFill = tutorialProgressBar.querySelector(".tutorial-progress-fill");

const setMainBar = document.getElementById("set-main-bar");
const setMainCircle = document.getElementById("set-main-circle");
const setMainCircleSize = document.getElementById("set-main-circle-size");
const setMainBarThickness = document.getElementById("set-main-bar-thickness");
const setMainFontSize = document.getElementById("set-main-font-size");
const setMainFontFamily = document.getElementById("set-main-font-family");

const setCdBar = document.getElementById("set-cd-bar");
const setCdCircle = document.getElementById("set-cd-circle");
const setCdCircleSize = document.getElementById("set-cd-circle-size");
const setCdBarThickness = document.getElementById("set-cd-bar-thickness");
const setCdFlash = document.getElementById("set-cd-flash");

const setSwBar = document.getElementById("set-sw-bar");
const setSwCircle = document.getElementById("set-sw-circle");
const setSwCircleSize = document.getElementById("set-sw-circle-size");
const setSwBarThickness = document.getElementById("set-sw-bar-thickness");
const setSwMs = document.getElementById("set-sw-ms");
const setSwLaps = document.getElementById("set-sw-laps");

const setRangeBar = document.getElementById("set-range-bar");
const setRangeCircle = document.getElementById("set-range-circle");
const setRangeCircleSize = document.getElementById("set-range-circle-size");
const setRangeBarThickness = document.getElementById("set-range-bar-thickness");
const setRangePercent = document.getElementById("set-range-percent");
const setRangeRemaining = document.getElementById("set-range-remaining");
const setRangeElapsed = document.getElementById("set-range-elapsed");

const setTutSpotlight = document.getElementById("set-tut-spotlight");
const setTutGlow = document.getElementById("set-tut-glow");

const setDarkMode = document.getElementById("set-dark-mode");
const setHighContrast = document.getElementById("set-high-contrast");
const setMoreAnimations = document.getElementById("set-more-animations");
const setHoverGlow = document.getElementById("set-hover-glow");
const setRounded = document.getElementById("set-rounded");
const setExtraSpacing = document.getElementById("set-extra-spacing");
const setCompact = document.getElementById("set-compact");

const setAutoSave = document.getElementById("set-auto-save");
const setFps = document.getElementById("set-fps");
const fpsDisplay = document.getElementById("fps-display");

// STATE
let mainTimerInterval = null;
let lastCompactText = "--";
let mainInitialDiffMs = null;

let rangeInterval = null;
let rangeStart = null;
let rangeEnd = null;

let cdInterval = null;
let cdTotalMs = 0;
let cdRemainingMs = 0;

let swInterval = null;
let swElapsedMs = 0;
let swRunning = false;

let tutorialIndex = 0;
let tutorialRunning = false;
let tutorialFirstRun = true;

let fpsLastTime = performance.now();
let fpsFrames = 0;

// TUTORIAL STEPS
const tutorialStepsData = [
    {
        selector: "#section-input",
        text: "This area lets you choose any date and time, and how you want the main timer to display."
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
        text: "This panel shows the main timer, its progress bar, and progress circle."
    },
    {
        selector: "#section-range",
        text: "Two-time progress lets you pick a start and end time and see how far through that range you are."
    },
    {
        selector: "#section-presets",
        text: "Smart presets use Bathurst / Denison school times and other useful targets."
    },
    {
        selector: "#section-tools",
        text: "Timer tools give you a countdown and a stopwatch that can run alongside the main timer."
    },
    {
        selector: "#cd-display",
        text: "This is the countdown display. Set a duration and start it; it will tick down to zero."
    },
    {
        selector: "#sw-display",
        text: "This is the stopwatch display. You can start, pause, reset, and even add time."
    }
];

// MAIN TIMER
startBtn.addEventListener("click", () => {
    const targetValue = targetInput.value;
    if (!targetValue) {
        directionLabelEl.textContent = "Pick a date & time first.";
        bigTimerEl.textContent = "--";
        extraMessageEl.textContent = "";
        lastCompactText = "--";
        resetMainProgress();
        return;
    }

    const targetDate = new Date(targetValue);
    if (isNaN(targetDate.getTime())) {
        directionLabelEl.textContent = "Invalid date.";
        bigTimerEl.textContent = "--";
        extraMessageEl.textContent = "";
        lastCompactText = "--";
        resetMainProgress();
        return;
    }

    startMainTimer(targetDate);
});

function startMainTimer(targetDate) {
    if (mainTimerInterval) {
        clearInterval(mainTimerInterval);
        mainTimerInterval = null;
    }

    const now = new Date();
    mainInitialDiffMs = Math.abs(targetDate.getTime() - now.getTime());

    updateMainTimer(targetDate);
    mainTimerInterval = setInterval(() => updateMainTimer(targetDate), 1000);
}

function updateMainTimer(targetDate) {
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
        default:
            displayText = buildNormalText(years, remainingDaysAfterYears, hours, minutes, seconds);
            compactText = buildCompactText(totalDays, hours, minutes, seconds);
            break;
    }

    bigTimerEl.textContent = displayText;
    lastCompactText = compactText;

    if (isFuture) {
        extraMessageEl.textContent = "";
    } else {
        extraMessageEl.textContent = "That time has already passed – now showing how long it’s been.";
    }

    updateMainProgress(absDiffMs, isFuture);
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

function resetMainProgress() {
    mainBarFill.style.width = "0%";
}

function updateMainProgress(absDiffMs, isFuture) {
    if (mainInitialDiffMs === null || mainInitialDiffMs === 0) return;
    let percent = 100;
    if (isFuture) {
        const used = mainInitialDiffMs - absDiffMs;
        percent = Math.max(0, Math.min(100, (used / mainInitialDiffMs) * 100));
    }
    mainBarFill.style.width = `${percent}%`;
}

// TODAY BUTTON
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

// COPY BUTTON
copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(lastCompactText);
    } catch (e) {
        console.log("Clipboard error:", e);
    }
});

// PRESETS (DENISON / BATHURST)
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
    startMainTimer(target);
}

function getNextMidnight(now) {
    const next = new Date(now);
    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
    return next;
}

function isSchoolDay(date) {
    const day = date.getDay();
    return day >= 1 && day <= 5;
}

function getNextSchoolStart(now) {
    const next = new Date(now);
    if (isSchoolDay(next)) {
        const start = new Date(next);
        start.setHours(9, 0, 0, 0);
        if (now < start) return start;
    }
    do {
        next.setDate(next.getDate() + 1);
    } while (!isSchoolDay(next));
    next.setHours(9, 0, 0, 0);
    return next;
}

function getEndSchoolDay(now) {
    const endToday = new Date(now);
    endToday.setHours(15, 20, 0, 0);
    if (isSchoolDay(now) && now < endToday) return endToday;
    const next = getNextSchoolStart(now);
    const endNext = new Date(next);
    endNext.setHours(15, 20, 0, 0);
    return endNext;
}

function getEndOfWeek(now) {
    const next = new Date(now);
    const day = next.getDay();
    const daysUntilFriday = (5 - day + 7) % 7;
    next.setDate(next.getDate() + daysUntilFriday);
    next.setHours(15, 20, 0, 0);
    if (now < next) return next;
    next.setDate(next.getDate() + 7);
    return next;
}

function getEndOfWeekend(now) {
    const next = new Date(now);
    const day = next.getDay();
    const daysUntilSunday = (0 - day + 7) % 7;
    next.setDate(next.getDate() + daysUntilSunday);
    next.setHours(23, 59, 59, 0);
    if (now < next) return next;
    next.setDate(next.getDate() + 7);
    return next;
}

function getChristmas(now) {
    const year = now.getFullYear();
    let christmas = new Date(year, 11, 25, 0, 0, 0, 0);
    if (now > christmas) {
        christmas = new Date(year + 1, 11, 25, 0, 0, 0, 0);
    }
    return christmas;
}

// TWO-TIME PROGRESS
rangeActivateBtn.addEventListener("click", () => {
    const startVal = rangeStartInput.value;
    const endVal = rangeEndInput.value;
    if (!startVal || !endVal) {
        rangeLabel.textContent = "Fill both start and end times.";
        return;
    }
    const start = new Date(startVal);
    const end = new Date(endVal);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
        rangeLabel.textContent = "End must be after start.";
        return;
    }
    rangeStart = start;
    rangeEnd = end;
    if (rangeInterval) {
        clearInterval(rangeInterval);
        rangeInterval = null;
    }
    updateRange();
    rangeInterval = setInterval(updateRange, 1000);
});

function updateRange() {
    if (!rangeStart || !rangeEnd) return;
    const now = new Date();
    const totalMs = rangeEnd.getTime() - rangeStart.getTime();
    const elapsedMs = now.getTime() - rangeStart.getTime();
    const remainingMs = rangeEnd.getTime() - now.getTime();

    let percent = Math.max(0, Math.min(100, (elapsedMs / totalMs) * 100));
    rangeBarFill.style.width = `${percent}%`;

    const absElapsed = Math.max(0, elapsedMs);
    const absRemaining = Math.max(0, remainingMs);

    const elapsedText = formatDuration(absElapsed);
    const remainingText = formatDuration(absRemaining);

    let label = `Range progress: ${percent.toFixed(1)}%`;
    let extra = "";

    if (setRangePercent.checked) {
        label = `Range progress: ${percent.toFixed(1)}%`;
    }
    if (setRangeElapsed.checked) {
        extra += `Elapsed: ${elapsedText} `;
    }
    if (setRangeRemaining.checked) {
        extra += `Remaining: ${remainingText}`;
    }

    rangeLabel.textContent = label;
    rangeExtraEl.textContent = extra.trim();
    rangeTimerEl.textContent = elapsedText;

    if (now >= rangeEnd) {
        rangeLabel.textContent = "Range complete.";
    }
}

function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const h = hours % 24;
    const m = minutes % 60;
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    parts.push(`${seconds}s`);
    return parts.join(" ");
}

// TIMER TOOLS PANEL
timerToolsBtn.addEventListener("click", () => {
    const isHidden = sectionTools.style.display === "none" || sectionTools.style.display === "";
    if (isHidden) {
        sectionTools.style.display = "block";
        timerToolsBtn.classList.remove("flash-tools");
    } else {
        sectionTools.style.display = "none";
    }
});

// COUNTDOWN
cdStartBtn.addEventListener("click", () => {
    const days = Number(cdDays.value) || 0;
    const hours = Number(cdHours.value) || 0;
    const minutes = Number(cdMinutes.value) || 0;
    const seconds = Number(cdSeconds.value) || 0;
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds <= 0) return;
    cdTotalMs = totalSeconds * 1000;
    cdRemainingMs = cdTotalMs;
    if (cdInterval) {
        clearInterval(cdInterval);
        cdInterval = null;
    }
    updateCountdown();
    cdInterval = setInterval(updateCountdown, 1000);
});

cdPauseBtn.addEventListener("click", () => {
    if (cdInterval) {
        clearInterval(cdInterval);
        cdInterval = null;
    }
});

cdResetBtn.addEventListener("click", () => {
    if (cdInterval) {
        clearInterval(cdInterval);
        cdInterval = null;
    }
    cdTotalMs = 0;
    cdRemainingMs = 0;
    cdDisplay.textContent = "--";
    cdBarFill.style.width = "0%";
});

function updateCountdown() {
    if (cdRemainingMs <= 0) {
        cdRemainingMs = 0;
        cdDisplay.textContent = "0s";
        cdBarFill.style.width = "100%";
        clearInterval(cdInterval);
        cdInterval = null;
        if (setCdFlash.checked) {
            timerToolsBtn.classList.add("flash-tools");
        }
        return;
    }
    cdRemainingMs -= 1000;
    const text = formatDuration(cdRemainingMs);
    cdDisplay.textContent = text;
    const used = cdTotalMs - cdRemainingMs;
    const percent = Math.max(0, Math.min(100, (used / cdTotalMs) * 100));
    cdBarFill.style.width = `${percent}%`;
}

// STOPWATCH
swStartBtn.addEventListener("click", () => {
    if (swRunning) return;
    swRunning = true;
    const startTime = Date.now() - swElapsedMs;
    if (swInterval) {
        clearInterval(swInterval);
        swInterval = null;
    }
    swInterval = setInterval(() => {
        swElapsedMs = Date.now() - startTime;
        updateStopwatchDisplay();
    }, 50);
});

swPauseBtn.addEventListener("click", () => {
    if (!swRunning) return;
    swRunning = false;
    if (swInterval) {
        clearInterval(swInterval);
        swInterval = null;
    }
    addLap();
});

swResetBtn.addEventListener("click", () => {
    swRunning = false;
    if (swInterval) {
        clearInterval(swInterval);
        swInterval = null;
    }
    swElapsedMs = 0;
    swDisplay.textContent = "--";
    swBarFill.style.width = "0%";
    swLaps.innerHTML = "";
});

swAddBtn.addEventListener("click", () => {
    const addSeconds = Number(swAddSecondsInput.value) || 0;
    if (addSeconds <= 0) return;
    swElapsedMs += addSeconds * 1000;
    updateStopwatchDisplay();
});

function updateStopwatchDisplay() {
    const ms = swElapsedMs;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hours = Math.floor(minutes / 60);
    const h = hours;
    const m = minutes % 60;
    const s = seconds;
    let text = `${h}h ${m}m ${s}s`;
    if (setSwMs.checked) {
        const msPart = ms % 1000;
        text += ` ${msPart}ms`;
    }
    swDisplay.textContent = text;
    const percent = Math.max(0, Math.min(100, (ms % 600000) / 600000 * 100)); // loop every 10 min
    swBarFill.style.width = `${percent}%`;
}

function addLap() {
    if (!setSwLaps.checked) return;
    const ms = swElapsedMs;
    const text = formatDuration(ms);
    const div = document.createElement("div");
    div.textContent = `Lap: ${text}`;
    swLaps.appendChild(div);
}

// FOCUS MODE
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

// SETTINGS PANEL
settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.remove("hidden");
});

closeSettingsBtn.addEventListener("click", () => {
    settingsPanel.classList.add("hidden");
});

// SETTINGS APPLY
function applySettings() {
    mainBar.style.display = setMainBar.checked ? "block" : "none";
    mainCircle.style.display = setMainCircle.checked ? "block" : "none";
    applyCircleSize(mainCircle, setMainCircleSize.value);
    applyBarThickness(mainBar, setMainBarThickness.value);
    applyFontSize(bigTimerEl, setMainFontSize.value);
    applyFontFamily(bigTimerEl, setMainFontFamily.value);

    cdBar.style.display = setCdBar.checked ? "block" : "none";
    cdCircle.style.display = setCdCircle.checked ? "block" : "none";
    applyCircleSize(cdCircle, setCdCircleSize.value);
    applyBarThickness(cdBar, setCdBarThickness.value);

    swBar.style.display = setSwBar.checked ? "block" : "none";
    swCircle.style.display = setSwCircle.checked ? "block" : "none";
    applyCircleSize(swCircle, setSwCircleSize.value);
    applyBarThickness(swBar, setSwBarThickness.value);

    rangeBar.style.display = setRangeBar.checked ? "block" : "none";
    rangeCircle.style.display = setRangeCircle.checked ? "block" : "none";
    applyCircleSize(rangeCircle, setRangeCircleSize.value);
    applyBarThickness(rangeBar, setRangeBarThickness.value);

    const body = document.body;
    toggleClass(body, "dark-mode", setDarkMode.checked);
    toggleClass(body, "high-contrast", setHighContrast.checked);
    toggleClass(body, "more-animations", setMoreAnimations.checked);
    toggleClass(body, "hover-glow", setHoverGlow.checked);
    toggleClass(body, "rounded", setRounded.checked);
    toggleClass(body, "extra-spacing", setExtraSpacing.checked);
    toggleClass(body, "compact", setCompact.checked);
}

function applyCircleSize(circleEl, size) {
    if (!circleEl) return;
    if (size === "small") {
        circleEl.style.width = "160px";
        circleEl.style.height = "160px";
    } else if (size === "large") {
        circleEl.style.width = "260px";
        circleEl.style.height = "260px";
    } else {
        circleEl.style.width = "220px";
        circleEl.style.height = "220px";
    }
}

function applyBarThickness(barEl, thickness) {
    if (!barEl) return;
    if (thickness === "thin") {
        barEl.style.height = "4px";
    } else if (thickness === "thick") {
        barEl.style.height = "10px";
    } else {
        barEl.style.height = "6px";
    }
}

function applyFontSize(el, size) {
    if (size === "small") {
        el.style.fontSize = "2.2rem";
    } else if (size === "large") {
        el.style.fontSize = "3.8rem";
    } else {
        el.style.fontSize = "";
    }
}

function applyFontFamily(el, family) {
    if (family === "digital") {
        el.style.fontFamily = "monospace";
    } else if (family === "modern") {
        el.style.fontFamily = "system-ui, sans-serif";
    } else {
        el.style.fontFamily = '"Courier New", monospace';
    }
}

function toggleClass(el, cls, on) {
    if (on) el.classList.add(cls);
    else el.classList.remove(cls);
}

// SETTINGS CHANGE LISTENERS
[
    setMainBar, setMainCircle, setMainCircleSize, setMainBarThickness,
    setMainFontSize, setMainFontFamily,
    setCdBar, setCdCircle, setCdCircleSize, setCdBarThickness,
    setSwBar, setSwCircle, setSwCircleSize, setSwBarThickness,
    setRangeBar, setRangeCircle, setRangeCircleSize, setRangeBarThickness,
    setDarkMode, setHighContrast, setMoreAnimations, setHoverGlow,
    setRounded, setExtraSpacing, setCompact
].forEach(el => {
    el.addEventListener("change", () => {
        applySettings();
        if (setAutoSave.checked) saveSettings();
    });
});

// AUTO-SAVE SETTINGS
function saveSettings() {
    const data = {
        mainBar: setMainBar.checked,
        mainCircle: setMainCircle.checked,
        mainCircleSize: setMainCircleSize.value,
        mainBarThickness: setMainBarThickness.value,
        mainFontSize: setMainFontSize.value,
        mainFontFamily: setMainFontFamily.value,
        cdBar: setCdBar.checked,
        cdCircle: setCdCircle.checked,
        cdCircleSize: setCdCircleSize.value,
        cdBarThickness: setCdBarThickness.value,
        cdFlash: setCdFlash.checked,
        swBar: setSwBar.checked,
        swCircle: setSwCircle.checked,
        swCircleSize: setSwCircleSize.value,
        swBarThickness: setSwBarThickness.value,
        swMs: setSwMs.checked,
        swLaps: setSwLaps.checked,
        rangeBar: setRangeBar.checked,
        rangeCircle: setRangeCircle.checked,
        rangeCircleSize: setRangeCircleSize.value,
        rangeBarThickness: setRangeBarThickness.value,
        rangePercent: setRangePercent.checked,
        rangeRemaining: setRangeRemaining.checked,
        rangeElapsed: setRangeElapsed.checked,
        tutSpotlight: setTutSpotlight.checked,
        tutGlow: setTutGlow.checked,
        darkMode: setDarkMode.checked,
        highContrast: setHighContrast.checked,
        moreAnimations: setMoreAnimations.checked,
        hoverGlow: setHoverGlow.checked,
        rounded: setRounded.checked,
        extraSpacing: setExtraSpacing.checked,
        compact: setCompact.checked,
        autoSave: setAutoSave.checked,
        fps: setFps.checked
    };
    localStorage.setItem("timerLabSettings", JSON.stringify(data));
}

function loadSettings() {
    const raw = localStorage.getItem("timerLabSettings");
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        setMainBar.checked = data.mainBar ?? setMainBar.checked;
        setMainCircle.checked = data.mainCircle ?? setMainCircle.checked;
        setMainCircleSize.value = data.mainCircleSize ?? setMainCircleSize.value;
        setMainBarThickness.value = data.mainBarThickness ?? setMainBarThickness.value;
        setMainFontSize.value = data.mainFontSize ?? setMainFontSize.value;
        setMainFontFamily.value = data.mainFontFamily ?? setMainFontFamily.value;

        setCdBar.checked = data.cdBar ?? setCdBar.checked;
        setCdCircle.checked = data.cdCircle ?? setCdCircle.checked;
        setCdCircleSize.value = data.cdCircleSize ?? setCdCircleSize.value;
        setCdBarThickness.value = data.cdBarThickness ?? setCdBarThickness.value;
        setCdFlash.checked = data.cdFlash ?? setCdFlash.checked;

        setSwBar.checked = data.swBar ?? setSwBar.checked;
        setSwCircle.checked = data.swCircle ?? setSwCircle.checked;
        setSwCircleSize.value = data.swCircleSize ?? setSwCircleSize.value;
        setSwBarThickness.value = data.swBarThickness ?? setSwBarThickness.value;
        setSwMs.checked = data.swMs ?? setSwMs.checked;
        setSwLaps.checked = data.swLaps ?? setSwLaps.checked;

        setRangeBar.checked = data.rangeBar ?? setRangeBar.checked;
        setRangeCircle.checked = data.rangeCircle ?? setRangeCircle.checked;
        setRangeCircleSize.value = data.rangeCircleSize ?? setRangeCircleSize.value;
        setRangeBarThickness.value = data.rangeBarThickness ?? setRangeBarThickness.value;
        setRangePercent.checked = data.rangePercent ?? setRangePercent.checked;
        setRangeRemaining.checked = data.rangeRemaining ?? setRangeRemaining.checked;
        setRangeElapsed.checked = data.rangeElapsed ?? setRangeElapsed.checked;

        setTutSpotlight.checked = data.tutSpotlight ?? setTutSpotlight.checked;
        setTutGlow.checked = data.tutGlow ?? setTutGlow.checked;

        setDarkMode.checked = data.darkMode ?? setDarkMode.checked;
        setHighContrast.checked = data.highContrast ?? setHighContrast.checked;
        setMoreAnimations.checked = data.moreAnimations ?? setMoreAnimations.checked;
        setHoverGlow.checked = data.hoverGlow ?? setHoverGlow.checked;
        setRounded.checked = data.rounded ?? setRounded.checked;
        setExtraSpacing.checked = data.extraSpacing ?? setExtraSpacing.checked;
        setCompact.checked = data.compact ?? setCompact.checked;

        setAutoSave.checked = data.autoSave ?? setAutoSave.checked;
        setFps.checked = data.fps ?? setFps.checked;
    } catch (e) {
        console.log("Settings load error:", e);
    }
}

// FPS COUNTER
function updateFps() {
    const now = performance.now();
    fpsFrames++;
    const diff = now - fpsLastTime;
    if (diff >= 1000) {
        const fps = Math.round((fpsFrames / diff) * 1000);
        if (setFps.checked) {
            fpsDisplay.textContent = `FPS: ${fps}`;
        } else {
            fpsDisplay.textContent = "FPS: --";
        }
        fpsFrames = 0;
        fpsLastTime = now;
    }
    requestAnimationFrame(updateFps);
}

// TUTORIAL
openTutorialBtn.addEventListener("click", () => {
    tutorialOverlay.classList.remove("hidden");
    tutorialRunning = true;
    tutorialIndex = 0;
    showTutorialStep();
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
    tutorialOverlay.classList.add("hidden");
    tutorialRunning = false;
    tutorialFirstRun = false;
});

function showTutorialStep() {
    const step = tutorialStepsData[tutorialIndex];
    const targetEl = document.querySelector(step.selector);
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();

    tutorialHighlight.style.left = `${rect.left + window.scrollX - 6}px`;
    tutorialHighlight.style.top = `${rect.top + window.scrollY - 6}px`;
    tutorialHighlight.style.width = `${rect.width + 12}px`;
    tutorialHighlight.style.height = `${rect.height + 12}px`;

    tutorialText.textContent = step.text;

    const percent = ((tutorialIndex + 1) / tutorialStepsData.length) * 100;
    tutorialProgressFill.style.width = `${percent}%`;

    if (setTutGlow.checked) {
        tutorialHighlight.style.boxShadow = "0 0 16px rgba(255,255,255,0.8)";
    } else {
        tutorialHighlight.style.boxShadow = "none";
    }

    if (setTutSpotlight.checked) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }

    window.scrollTo({
        top: rect.top + window.scrollY - 80,
        behavior: "smooth"
    });
}

// INIT
window.addEventListener("load", () => {
    sectionTools.style.display = "none";
    loadSettings();
    applySettings();
    requestAnimationFrame(updateFps);
});
