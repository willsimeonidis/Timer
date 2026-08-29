// Timer logic – vanilla JS, clean, with animations and confetti

let timerInterval = null;
const presetTypeEl = document.getElementById("preset-type");
const presetYearEl = document.getElementById("preset-year");
const applyPresetBtn = document.getElementById("apply-preset");
const targetInput = document.getElementById("target-datetime");
const displayModeEl = document.getElementById("display-mode");
const startBtn = document.getElementById("start-timer");
const directionLabelEl = document.getElementById("direction-label");
const bigTimerEl = document.getElementById("big-timer");
const extraMessageEl = document.getElementById("extra-message");
const confettiContainer = document.getElementById("confetti-container");

// Fill year dropdown (current year ± 5)
(function fillYears() {
    const now = new Date();
    const currentYear = now.getFullYear();
    presetYearEl.innerHTML = "";
    for (let y = currentYear - 1; y <= currentYear + 5; y++) {
        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;
        if (y === currentYear) opt.selected = true;
        presetYearEl.appendChild(opt);
    }
})();

// Build preset date
function getPresetDate() {
    const type = presetTypeEl.value;
    const year = parseInt(presetYearEl.value, 10);
    if (!type || isNaN(year)) return null;

    let month = 0;
    let day = 1;

    switch (type) {
        case "christmas":
            month = 11; // December
            day = 25;
            break;
        case "newyear":
            month = 0; // January
            day = 1;
            break;
        case "schoolend":
            month = 11; // December
            day = 20;
            break;
        case "custom":
            month = 5;
            day = 1;
            break;
        default:
            return null;
    }

    return new Date(year, month, day, 0, 0, 0);
}

// Apply preset to input
applyPresetBtn.addEventListener("click", () => {
    const presetDate = getPresetDate();
    if (!presetDate) return;

    const iso = presetDate.toISOString().slice(0, 16);
    targetInput.value = iso;
    extraMessageEl.textContent = "Preset applied. Now click “Show time”.";
});

// Start timer
startBtn.addEventListener("click", () => {
    const targetValue = targetInput.value;
    if (!targetValue) {
        directionLabelEl.textContent = "Pick a date & time first.";
        bigTimerEl.textContent = "--";
        extraMessageEl.textContent = "";
        return;
    }

    const targetDate = new Date(targetValue);
    if (isNaN(targetDate.getTime())) {
        directionLabelEl.textContent = "Invalid date.";
        bigTimerEl.textContent = "--";
        extraMessageEl.textContent = "";
        return;
    }

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    updateTimer(targetDate);
    timerInterval = setInterval(() => updateTimer(targetDate), 1000);
});

// Core update function
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

    // Normal breakdown
    const years = Math.floor(totalDays / 365);
    const remainingDaysAfterYears = totalDays - years * 365;
    const hours = totalHours - totalDays * 24;
    const minutes = totalMinutes - totalHours * 60;
    const seconds = totalSeconds - totalMinutes * 60;

    const mode = displayModeEl.value;

    // Direction label
    if (isFuture) {
        directionLabelEl.textContent = "Time until that moment";
    } else {
        directionLabelEl.textContent = "Time since that moment";
    }

    // Confetti + flip to count-up when crossing zero
    if (isFuture && diffMs <= 0) {
        triggerConfetti();
    }

    // Display formatting
    let displayText = "";

    switch (mode) {
        case "seconds":
            displayText = `${totalSeconds.toLocaleString()} seconds`;
            break;
        case "minutes":
            displayText = `${totalMinutes.toLocaleString()} minutes`;
            break;
        case "hours":
            displayText = `${totalHours.toLocaleString()} hours`;
            break;
        case "days":
            displayText = `${totalDays.toLocaleString()} days`;
            break;
        case "months":
            displayText = `${approxMonths.toLocaleString()} months (approx)`;
            break;
        case "normal":
        default:
            displayText = buildNormalText(years, remainingDaysAfterYears, hours, minutes, seconds);
            break;
    }

    bigTimerEl.textContent = displayText;

    if (isFuture) {
        extraMessageEl.textContent = "";
    } else {
        extraMessageEl.textContent = "That time has already passed – now showing how long it’s been.";
    }
}

// Build “normal” text like “1 year 57 days 4 hours 32 minutes 56 seconds”
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

// Confetti effect
function triggerConfetti() {
    extraMessageEl.textContent = "Time reached! 🎉";
    const pieces = 80;

    for (let i = 0; i < pieces; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.animationDelay = (Math.random() * 0.6) + "s";
        piece.style.transform = `translateY(-20px) rotate(${Math.random() * 360}deg)`;
        confettiContainer.appendChild(piece);

        setTimeout(() => {
            piece.remove();
        }, 2200);
    }
}
