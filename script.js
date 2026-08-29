// Core elements
let timerInterval = null;

const targetInput = document.getElementById("target-datetime");
const displayModeEl = document.getElementById("display-mode");
const startBtn = document.getElementById("start-timer");
const directionLabelEl = document.getElementById("direction-label");
const bigTimerEl = document.getElementById("big-timer");
const extraMessageEl = document.getElementById("extra-message");
const copyBtn = document.getElementById("copy-timer");

const openTutorialBtn = document.getElementById("open-tutorial");
const tutorialOverlay = document.getElementById("tutorial-overlay");
const tutorialWelcome = document.getElementById("tutorial-welcome");
const tutorialSteps = document.getElementById("tutorial-steps");
const tutorialSkip = document.getElementById("tutorial-skip");
const tutorialHighlight = document.getElementById("tutorial-highlight");
const tutorialText = document.getElementById("tutorial-text");
const tutorialPrev = document.getElementById("tutorial-prev");
const tutorialNext = document.getElementById("tutorial-next");
const tutorialFinish = document.getElementById("tutorial-finish");

const sectionInput = document.getElementById("section-input");
const sectionDisplay = document.getElementById("section-display");

let lastCompactText = "--";

// Tutorial state
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
        selector: "#big-timer",
        text: "This is the main timer. It grows to fit your device and shows the time clearly."
    },
    {
        selector: "#copy-timer",
        text: "Use this copy button to instantly copy the current time value in a compact format like 161d 11h 7m 50s."
    }
];

let tutorialIndex = 0;
let tutorialIntroActive = false;
let tutorialRunning = false;

// Timer start
startBtn.addEventListener("click", () => {
    const targetValue = targetInput.value;
    if (!targetValue) {
        directionLabelEl.textContent = "Pick a date & time first.";
        bigTimerEl.textContent = "--";
        extraMessageEl.textContent = "";
        lastCompactText = "--";
        return;
    }

    const targetDate = new Date(targetValue);
    if (isNaN(targetDate.getTime())) {
        directionLabelEl.textContent = "Invalid date.";
        bigTimerEl.textContent = "--";
        extraMessageEl.textContent = "";
        lastCompactText = "--";
        return;
    }

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    updateTimer(targetDate);
    timerInterval = setInterval(() => updateTimer(targetDate), 1000);
});

// Timer update
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

    if (isFuture) {
        extraMessageEl.textContent = "";
    } else {
        extraMessageEl.textContent = "That time has already passed – now showing how long it’s been.";
    }
}

// Normal text
function buildNormalText(years, days, hours, minutes, seconds) {
    const parts = [];

    if (years) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
    if (days) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
    if (hours) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (minutes) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    if (seconds || parts.length === 0) {
        parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);
    }

    return parts.join(" ");
}

// Compact text like 161d 11h 7m 50s
function buildCompactText(days, hours, minutes, seconds) {
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(" ");
}

// Copy button
copyBtn.addEventListener("click", () => {
    if (!lastCompactText || lastCompactText === "--") return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastCompactText).catch(() => {});
    }
});

// Tutorial logic

function showTutorialOverlay() {
    tutorialOverlay.classList.remove("hidden");
    tutorialWelcome.classList.remove("hidden");
    tutorialSteps.classList.add("hidden");
    tutorialIntroActive = true;
    tutorialRunning = false;
}

function hideTutorialOverlay() {
    tutorialOverlay.classList.add("hidden");
    tutorialIntroActive = false;
    tutorialRunning = false;
}

function startTutorialSteps() {
    tutorialIntroActive = false;
    tutorialRunning = true;
    tutorialWelcome.classList.add("hidden");
    tutorialSteps.classList.remove("hidden");
    tutorialIndex = 0;
    showTutorialStep(tutorialIndex);
}

function showTutorialStep(index) {
    const step = tutorialStepsData[index];
    if (!step) return;

    const targetEl = document.querySelector(step.selector);
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();

    tutorialHighlight.style.left = `${rect.left - 6}px`;
    tutorialHighlight.style.top = `${rect.top - 6}px`;
    tutorialHighlight.style.width = `${rect.width + 12}px`;
    tutorialHighlight.style.height = `${rect.height + 12}px`;

    tutorialText.classList.remove("slide-in");
    void tutorialText.offsetWidth;
    tutorialText.textContent = step.text;
    tutorialText.classList.add("slide-in");
}

// Tutorial controls
tutorialSkip.addEventListener("click", () => {
    hideTutorialOverlay();
    markTutorialDone();
});

tutorialPrev.addEventListener("click", () => {
    if (!tutorialRunning) return;
    if (tutorialIndex > 0) {
        tutorialIndex--;
        showTutorialStep(tutorialIndex);
    }
});

tutorialNext.addEventListener("click", () => {
    if (!tutorialRunning) return;
    if (tutorialIndex < tutorialStepsData.length - 1) {
        tutorialIndex++;
        showTutorialStep(tutorialIndex);
    }
});

tutorialFinish.addEventListener("click", () => {
    hideTutorialOverlay();
    markTutorialDone();
});

// Any button to proceed from welcome
document.addEventListener("click", (e) => {
    if (!tutorialIntroActive) return;

    const isButton = e.target.closest("button");
    if (!isButton) return;

    startTutorialSteps();
});

// Open tutorial manually
openTutorialBtn.addEventListener("click", () => {
    showTutorialOverlay();
});

// Tutorial persistence
function markTutorialDone() {
    try {
        localStorage.setItem("timerTutorialDone", "true");
    } catch (e) {}
}

function shouldShowTutorialOnLoad() {
    try {
        const done = localStorage.getItem("timerTutorialDone");
        return !done;
    } catch (e) {
        return true;
    }
}

// Init
window.addEventListener("load", () => {
    if (shouldShowTutorialOnLoad()) {
        showTutorialOverlay();
    }
});
