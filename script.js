const defaultHabits = [
  { name: 'Stretch your shoulders', seconds: 60 },
  { name: 'Wipe down your desk', seconds: 40 },
  { name: 'Drink a glass of water', seconds: 20 }
];

let habits = [...defaultHabits];
let activeIndex = -1;
let remaining = 0;
let timerId = null;
let audioEnabled = true;
let audioContext;

const habitList = document.querySelector('#habitList');
const habitForm = document.querySelector('#habitForm');
const habitName = document.querySelector('#habitName');
const habitSeconds = document.querySelector('#habitSeconds');
const totalDuration = document.querySelector('#totalDuration');
const habitCount = document.querySelector('#habitCount');
const activeHabit = document.querySelector('#activeHabit');
const timerValue = document.querySelector('#timerValue');
const timerUnit = document.querySelector('#timerUnit');
const timerStatus = document.querySelector('#timerStatus');
const stepCount = document.querySelector('#stepCount');
const timerRing = document.querySelector('#timerRing');
const startButton = document.querySelector('#startButton');
const startLabel = document.querySelector('#startLabel');
const resetButton = document.querySelector('#resetButton');
const completionMessage = document.querySelector('#completionMessage');
const soundToggle = document.querySelector('#soundToggle');
const clockHourHand = document.querySelector('#clockHourHand');
const clockMinuteHand = document.querySelector('#clockMinuteHand');
const todayLabel = document.querySelector('#todayLabel');
const hasRoutineUi = Boolean(habitList && habitForm && totalDuration && activeHabit && timerValue && timerUnit && timerStatus && stepCount && timerRing && startButton && resetButton && completionMessage && soundToggle);

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

function totalSeconds() {
  return habits.reduce((total, habit) => total + habit.seconds, 0);
}

function renderHabits() {
  if (!habitList || !totalDuration || !habitCount) return;
  habitList.innerHTML = habits.map((habit, index) => `
    <div class="habit-row" style="animation-delay: ${index * 70}ms">
      <span class="habit-number">0${index + 1}</span>
      <span class="habit-name">${escapeHtml(habit.name)}</span>
      <span class="habit-time">${formatTime(habit.seconds)}</span>
      <button class="delete-habit" type="button" data-index="${index}" aria-label="Remove ${escapeHtml(habit.name)}">×</button>
    </div>
  `).join('');
  totalDuration.textContent = formatTime(totalSeconds());
  habitCount.textContent = `${habits.length} habit${habits.length === 1 ? '' : 's'} stacked`;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character]));
}

function setTimerDisplay() {
  if (!timerValue || !timerUnit || !timerRing) return;
  const displaySeconds = activeIndex >= 0 ? remaining : totalSeconds();
  timerValue.textContent = formatTime(displaySeconds);
  const currentHabit = habits[activeIndex];
  timerUnit.textContent = activeIndex >= 0 && currentHabit ? `step ${activeIndex + 1} of ${habits.length}` : 'total time';
  if (currentHabit) {
    const progress = ((currentHabit.seconds - remaining) / currentHabit.seconds) * 360;
    timerRing.style.setProperty('--progress', `${Math.max(0, Math.min(360, progress))}deg`);
  } else {
    timerRing.style.setProperty('--progress', '0deg');
  }
}

function beginRoutine() {
  if (habits.length === 0) return;
  if (timerId) {
    pauseRoutine();
    return;
  }
  completionMessage.hidden = true;
  if (activeIndex < 0 || remaining <= 0) {
    activeIndex = 0;
    remaining = habits[0].seconds;
    announceStep();
  }
  startLabel.textContent = 'Pause routine';
  startButton.querySelector('.play-icon').textContent = 'Ⅱ';
  timerId = setInterval(tick, 1000);
  renderActiveState();
}

function pauseRoutine() {
  clearInterval(timerId);
  timerId = null;
  startLabel.textContent = 'Resume routine';
  startButton.querySelector('.play-icon').textContent = '▶';
  timerStatus.textContent = 'Routine paused';
}

function tick() {
  remaining -= 1;
  if (remaining <= 0) {
    playChime();
    if (activeIndex < habits.length - 1) {
      activeIndex += 1;
      remaining = habits[activeIndex].seconds;
      announceStep();
    } else {
      finishRoutine();
      return;
    }
  }
  setTimerDisplay();
}

function announceStep() {
  timerStatus.textContent = activeIndex === 0 ? 'Start here' : 'Next up';
  activeHabit.innerHTML = escapeHtml(habits[activeIndex].name).replace(' ', '<br>');
  stepCount.textContent = `Step ${activeIndex + 1} / ${habits.length}`;
  setTimerDisplay();
}

function renderActiveState() {
  if (!startButton || !startLabel || !activeHabit || !timerStatus || !stepCount) return;
  const isRunning = Boolean(timerId);
  startLabel.textContent = isRunning ? 'Pause routine' : (activeIndex >= 0 ? 'Resume routine' : 'Start routine');
  startButton.querySelector('.play-icon').textContent = isRunning ? 'Ⅱ' : '▶';
  if (activeIndex < 0) {
    activeHabit.innerHTML = 'Start your<br>routine.';
    timerStatus.textContent = 'Your stack is waiting';
    stepCount.textContent = 'Ready when you are';
  }
  setTimerDisplay();
}

function finishRoutine() {
  clearInterval(timerId);
  timerId = null;
  remaining = 0;
  activeHabit.innerHTML = 'Nice work.<br><em>That counts.</em>';
  timerStatus.textContent = 'All done';
  stepCount.textContent = 'Stack complete';
  startLabel.textContent = 'Start again';
  startButton.querySelector('.play-icon').textContent = '↻';
  completionMessage.hidden = false;
  setTimerDisplay();
  playChime(true);
}

function resetRoutine() {
  clearInterval(timerId);
  timerId = null;
  activeIndex = -1;
  remaining = 0;
  completionMessage.hidden = true;
  renderActiveState();
}

function playChime(finalChime = false) {
  if (!audioEnabled) return;
  audioContext ??= new AudioContext();

  const noteSequence = finalChime
    ? [880, 1040, 1170]
    : [620, 740, 830];
  const noteDuration = finalChime ? 0.8 : 0.7;
  const gap = finalChime ? 0.12 : 0.1;

  noteSequence.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const startTime = audioContext.currentTime + (index * (noteDuration + gap));

    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.type = finalChime ? 'triangle' : 'sine';

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(finalChime ? 1.0 : 0.8, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);

    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + noteDuration);
  });
}

if (habitForm) {
  habitForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = habitName.value.trim();
    const seconds = Number(habitSeconds.value);
    if (!name || !Number.isFinite(seconds) || seconds < 5) return;
    habits.push({ name, seconds: Math.min(seconds, 600) });
    habitForm.reset();
    habitSeconds.value = 30;
    resetRoutine();
    renderHabits();
    habitName.focus();
  });
}

if (habitList) {
  habitList.addEventListener('click', event => {
    const button = event.target.closest('.delete-habit');
    if (!button || habits.length === 1) return;
    habits.splice(Number(button.dataset.index), 1);
    resetRoutine();
    renderHabits();
  });
}

if (startButton) {
  startButton.addEventListener('click', beginRoutine);
}

if (resetButton) {
  resetButton.addEventListener('click', resetRoutine);
}

if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    soundToggle.textContent = audioEnabled ? 'Sound on' : 'Sound off';
    soundToggle.setAttribute('aria-label', audioEnabled ? 'Turn sound off' : 'Turn sound on');
  });
}

function updateIndiaClock() {
  if (!clockHourHand || !clockMinuteHand || !todayLabel) return;
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  }).formatToParts(now).reduce((values, part) => {
    values[part.type] = Number(part.value);
    return values;
  }, {});
  const hourAngle = ((parts.hour % 12) + parts.minute / 60) * 30;
  const minuteAngle = (parts.minute + parts.second / 60) * 6;
  clockHourHand.style.transform = `rotate(${hourAngle}deg)`;
  clockMinuteHand.style.transform = `rotate(${minuteAngle}deg)`;
  todayLabel.textContent = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(now);
}

if (hasRoutineUi) {
  updateIndiaClock();
  setInterval(updateIndiaClock, 1000);
  renderHabits();
  renderActiveState();
} else {
  updateIndiaClock();
  setInterval(updateIndiaClock, 1000);
}
