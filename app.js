/**
 * Relaxing Nature & Orange Timer - Pure & Crystal-Clear Sound Engine
 */

// ==========================================================================
// 1. Crystal-Clear Nature Audio Synthesizer (Zero "Gooo" Wind Noise)
// ==========================================================================

class NatureAudioEngine {
  constructor() {
    this.ctx = null;
    this.alarmVolume = 0.75;
    this.ambientVolume = 0.6;
    
    this.ambientType = 'forest';
    this.isAmbientPlaying = false;
    this.ambientMasterGain = null;
    this.ambientNodes = [];
    this.ambientIntervals = [];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setAlarmVolume(val) {
    this.alarmVolume = Math.max(0, Math.min(1, val));
  }

  setAmbientVolume(val) {
    this.ambientVolume = Math.max(0, Math.min(1, val));
    if (this.ambientMasterGain && this.ctx) {
      this.ambientMasterGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
    }
  }

  // --- Healing Alarm Sounds ---

  playAlarm(type = 'bowl') {
    this.init();
    switch (type) {
      case 'kalimba': this.playKalimba(); break;
      case 'chimes': this.playChimes(); break;
      case 'harp': this.playHarp(); break;
      case 'bowl':
      default: this.playSingingBowl(); break;
    }
  }

  playSingingBowl() {
    const now = this.ctx.currentTime;
    const baseFreq = 528; // Solfeggio Love Frequency
    const harmonics = [
      { freq: baseFreq, gain: 0.6, decay: 4.8 },
      { freq: baseFreq * 2.01, gain: 0.3, decay: 4.0 },
      { freq: baseFreq * 3.02, gain: 0.15, decay: 3.0 },
      { freq: baseFreq * 4.19, gain: 0.08, decay: 2.2 }
    ];

    harmonics.forEach(h => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(h.freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(h.gain * this.alarmVolume, now + 0.09);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + h.decay);
    });
  }

  playKalimba() {
    const now = this.ctx.currentTime;
    const notes = [349.23, 440.00, 523.25, 587.33, 698.46, 880.00];

    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.13;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, noteTime);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.42 * this.alarmVolume, noteTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.5);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc2.start(noteTime);
      osc.stop(noteTime + 1.5);
      osc2.stop(noteTime + 1.5);
    });
  }

  playChimes() {
    const now = this.ctx.currentTime;
    const freqs = [1046.50, 1174.66, 1318.51, 1567.98, 1760.00, 2093.00];
    const delays = [0, 0.08, 0.18, 0.28, 0.44, 0.58];

    delays.forEach((delay, idx) => {
      const time = now + delay;
      const freq = freqs[idx % freqs.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(0.3 * this.alarmVolume, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 2.3);
    });
  }

  playHarp() {
    const now = this.ctx.currentTime;
    const freqs = [261.63, 392.00, 493.88, 587.33, 659.25, 783.99, 987.77];

    freqs.forEach((freq, idx) => {
      const time = now + idx * 0.11;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(0.35 * this.alarmVolume, time + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 2.5);
    });
  }

  // ==========================================================================
  // 2. Pure Nature Sounds (Completely free of low "Gooo" wind noise)
  // ==========================================================================

  startAmbient(type = this.ambientType) {
    this.init();
    this.stopAmbient();
    this.ambientType = type;
    this.isAmbientPlaying = true;

    this.ambientMasterGain = this.ctx.createGain();
    this.ambientMasterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.ambientMasterGain.gain.exponentialRampToValueAtTime(Math.max(0.01, this.ambientVolume), this.ctx.currentTime + 0.3);
    this.ambientMasterGain.connect(this.ctx.destination);

    switch (type) {
      case 'waves':
        this.buildPureWaves();
        break;
      case 'rain':
        this.buildPureRainAndDrops();
        break;
      case 'hearth':
        this.buildPureCampfireCrackles();
        break;
      case 'forest':
      default:
        this.buildPureBirdsChorus();
        break;
    }
  }

  stopAmbient() {
    if (!this.ctx) return;
    if (this.ambientMasterGain) {
      try {
        const now = this.ctx.currentTime;
        this.ambientMasterGain.gain.setValueAtTime(this.ambientMasterGain.gain.value, now);
        this.ambientMasterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      } catch (e) {}
    }

    this.ambientIntervals.forEach(id => clearInterval(id));
    this.ambientIntervals = [];

    this.ambientNodes.forEach(node => {
      try { node.stop(); } catch (e) {}
      try { node.disconnect(); } catch (e) {}
    });
    this.ambientNodes = [];
    this.isAmbientPlaying = false;
  }

  // --------------------------------------------------------------------------
  // 🌲 1. FOREST: Pure Crystal Bird Songs & Gentle Forest Atmosphere (Zero Wind)
  // --------------------------------------------------------------------------
  buildPureBirdsChorus() {
    // Zero background "Gooo" drone! Only pure musical birds singing in harmony.
    const playBirdPhrase = () => {
      if (!this.isAmbientPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      const birdChoice = Math.random();

      if (birdChoice < 0.35) {
        // Pattern 1: Bright Cuckoo / Two-Tone Song (Twee-twoo)
        const notes = [3100, 2450];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const noteT = t + idx * 0.18;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteT);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.08, noteT + 0.04);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.96, noteT + 0.14);

          gain.gain.setValueAtTime(0.001, noteT);
          gain.gain.exponentialRampToValueAtTime(0.24, noteT + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteT + 0.16);

          osc.connect(gain);
          gain.connect(this.ambientMasterGain);
          osc.start(noteT);
          osc.stop(noteT + 0.18);
        });
      } else if (birdChoice < 0.7) {
        // Pattern 2: Joyful Morning Trill (Chit-chit-chit-cheeeer)
        const count = 4;
        for (let i = 0; i < count; i++) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const noteT = t + i * 0.08;
          const isLast = i === count - 1;
          const f0 = isLast ? 3900 : 3200 + (i % 2) * 250;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f0, noteT);
          if (isLast) osc.frequency.exponentialRampToValueAtTime(4500, noteT + 0.14);

          gain.gain.setValueAtTime(0.001, noteT);
          gain.gain.exponentialRampToValueAtTime(isLast ? 0.26 : 0.16, noteT + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteT + (isLast ? 0.28 : 0.07));

          osc.connect(gain);
          gain.connect(this.ambientMasterGain);
          osc.start(noteT);
          osc.stop(noteT + (isLast ? 0.3 : 0.08));
        }
      } else {
        // Pattern 3: Sweet Woodland Nightingale Melody (Warbling 4 notes)
        const melody = [2600, 3100, 3550, 3300];
        melody.forEach((f, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const noteT = t + i * 0.1;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, noteT);
          osc.frequency.exponentialRampToValueAtTime(f + 300, noteT + 0.04);
          osc.frequency.exponentialRampToValueAtTime(f - 100, noteT + 0.09);

          gain.gain.setValueAtTime(0.001, noteT);
          gain.gain.exponentialRampToValueAtTime(0.2, noteT + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteT + 0.1);

          osc.connect(gain);
          gain.connect(this.ambientMasterGain);
          osc.start(noteT);
          osc.stop(noteT + 0.12);
        });
      }
    };

    // Immediate playback
    setTimeout(playBirdPhrase, 100);
    setTimeout(playBirdPhrase, 900);
    const forestTimer = setInterval(() => {
      playBirdPhrase();
      if (Math.random() > 0.4) {
        setTimeout(playBirdPhrase, 800 + Math.random() * 600);
      }
    }, 2400);
    this.ambientIntervals.push(forestTimer);
  }

  // --------------------------------------------------------------------------
  // 🌊 2. WAVES: Clean Shoreline Surf & Gentle Foam (No Low Muffled Noise)
  // --------------------------------------------------------------------------
  buildPureWaves() {
    const wavePeriod = 7.0; // 7 seconds wave cycle

    const playSingleWave = () => {
      if (!this.isAmbientPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const bufSize = this.ctx.sampleRate * 5;
      const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // High-pass soft filtered noise (crystal sand & foam)
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass centered at crisp water frequencies (1200Hz - 3500Hz)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(0.7, now);
      filter.frequency.exponentialRampToValueAtTime(2800, now + 2.5); // wave rush in
      filter.frequency.exponentialRampToValueAtTime(1200, now + 4.8); // gentle recede

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + 2.4); // swell peak
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.2); // fade out

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientMasterGain);

      noise.start(now);
      noise.stop(now + 5.4);
    };

    playSingleWave();
    const waveTimer = setInterval(() => {
      playSingleWave();
    }, wavePeriod * 1000);
    this.ambientIntervals.push(waveTimer);
  }

  // --------------------------------------------------------------------------
  // 🌧️ 3. RAIN: Crystal Clear Water Droplets & Light Patter (No Muddy Rumble)
  // --------------------------------------------------------------------------
  buildPureRainAndDrops() {
    // Pure melodic water droplets: Plink, Plop, Patter
    const playDroplet = () => {
      if (!this.isAmbientPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Clear resonant droplet frequency sweep (1600Hz -> 650Hz)
      const startF = 1400 + Math.random() * 1100;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startF, t);
      osc.frequency.exponentialRampToValueAtTime(startF * 0.45, t + 0.035);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

      osc.connect(gain);
      gain.connect(this.ambientMasterGain);

      osc.start(t);
      osc.stop(t + 0.08);
    };

    // Light crisp patter on window/leaves
    const playLightPatter = () => {
      if (!this.isAmbientPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200 + Math.random() * 1500, t);
      filter.Q.setValueAtTime(4.0, t);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientMasterGain);

      osc.start(t);
      osc.stop(t + 0.03);
    };

    // Frequent pleasant droplets rhythm
    const dropsTimer = setInterval(() => {
      playDroplet();
      if (Math.random() > 0.3) {
        setTimeout(playDroplet, 60 + Math.random() * 90);
      }
      if (Math.random() > 0.4) {
        playLightPatter();
      }
    }, 180);
    this.ambientIntervals.push(dropsTimer);
  }

  // --------------------------------------------------------------------------
  // 🔥 4. HEARTH: Pure Crisp Wood Crackles & Pops (No Heavy Rumble)
  // --------------------------------------------------------------------------
  buildPureCampfireCrackles() {
    // Pure crisp crackles and dry pine wood snaps with ZERO low roaring wind!
    const playMiniCrackle = () => {
      if (!this.isAmbientPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(400 + Math.random() * 2200, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);

      osc.connect(gain);
      gain.connect(this.ambientMasterGain);

      osc.start(t);
      osc.stop(t + 0.018);
    };

    const playDistinctSnap = () => {
      if (!this.isAmbientPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600 + Math.random() * 1200, t);
      filter.Q.setValueAtTime(3.5, t);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(250 + Math.random() * 300, t);

      gain.gain.setValueAtTime(0.32, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientMasterGain);

      osc.start(t);
      osc.stop(t + 0.04);
    };

    // Fast organic crackle shower
    const crackleTimer = setInterval(() => {
      playMiniCrackle();
      if (Math.random() > 0.4) playMiniCrackle();
      if (Math.random() > 0.7) playMiniCrackle();
    }, 90);
    this.ambientIntervals.push(crackleTimer);

    // Satisfying wood pops
    const snapTimer = setInterval(() => {
      if (Math.random() > 0.3) {
        playDistinctSnap();
      }
    }, 480);
    this.ambientIntervals.push(snapTimer);
  }
}

// ==========================================================================
// 3. Application Logic & UI State Management
// ==========================================================================

const audio = new NatureAudioEngine();

// DOM Elements
const body = document.body;
const timerCard = document.querySelector('.timer-card');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Mode Buttons
const modeButtons = document.querySelectorAll('.mode-btn');
const presetsPanel = document.getElementById('presets-panel');
const customTimePanel = document.getElementById('custom-time-panel');
const pomoStatusBadge = document.getElementById('pomo-status-badge');
const pomoBadgeText = document.getElementById('pomo-badge-text');
const pomoCycleCount = document.getElementById('pomo-cycle-count');

// Display
const statusLabel = document.getElementById('status-label');
const mainTimeDisplay = document.getElementById('main-time-display');
const subTimeDisplay = document.getElementById('sub-time-display');
const gaugeProgress = document.getElementById('gauge-progress');
const GAUGE_CIRCUMFERENCE = 816.81; // 2 * PI * 130

// Preset pills & custom input
const presetPills = document.querySelectorAll('.preset-pill');
const inputMinutes = document.getElementById('input-minutes');
const inputSeconds = document.getElementById('input-seconds');
const applyCustomBtn = document.getElementById('apply-custom-btn');

// Action Controls
const toggleBtn = document.getElementById('toggle-btn');
const toggleIcon = document.getElementById('toggle-icon');
const resetBtn = document.getElementById('reset-btn');
const lapBtn = document.getElementById('lap-btn');
const lapContainer = document.getElementById('lap-container');
const lapList = document.getElementById('lap-list');

// Sound Drawer & Controls
const soundSettingsToggle = document.getElementById('sound-settings-toggle');
const soundDrawer = document.getElementById('sound-settings-drawer');
const drawerCloseBtn = document.getElementById('drawer-close-btn');
const previewAlarmBtn = document.getElementById('preview-alarm-btn');
const soundChips = document.querySelectorAll('.sound-chip[data-sound]');
const ambientToggle = document.getElementById('ambient-toggle');
const ambientChips = document.querySelectorAll('.ambient-chip');
const alarmVolSlider = document.getElementById('alarm-vol-slider');
const alarmVolVal = document.getElementById('alarm-vol-val');
const ambientVolSlider = document.getElementById('ambient-vol-slider');
const ambientVolVal = document.getElementById('ambient-vol-val');

// State Variables
let currentMode = 'timer';
let isRunning = false;
let timerInterval = null;

let timerDuration = 300; // 5 min default
let timerRemaining = 300;

let pomodoroPhase = 'work';
let pomodoroWorkDuration = 25 * 60;
let pomodoroBreakDuration = 5 * 60;
let pomodoroCycles = 1;

let swStartTime = 0;
let swElapsedTime = 0;
let swLaps = [];

let selectedAlarmSound = 'bowl';
let selectedAmbientSound = 'forest';
let ambientEnabled = false;

// ==========================================================================
// 4. UI Helper Functions
// ==========================================================================

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatStopwatchTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  const hundredths = Math.floor((ms % 1000) / 10);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
}

function setGaugeProgress(percent) {
  const offset = GAUGE_CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, percent)));
  gaugeProgress.style.strokeDashoffset = offset;
}

function updateDisplay() {
  if (currentMode === 'timer') {
    mainTimeDisplay.textContent = formatTime(timerRemaining);
    const fraction = timerDuration > 0 ? timerRemaining / timerDuration : 0;
    setGaugeProgress(fraction);

    if (isRunning) {
      statusLabel.textContent = 'RUNNING';
      subTimeDisplay.textContent = '心地よい集中時間';
    } else if (timerRemaining === timerDuration) {
      statusLabel.textContent = 'READY';
      subTimeDisplay.textContent = 'リラックスして準備';
    } else {
      statusLabel.textContent = 'PAUSED';
      subTimeDisplay.textContent = '一時停止中';
    }
  } else if (currentMode === 'pomodoro') {
    mainTimeDisplay.textContent = formatTime(timerRemaining);
    const total = pomodoroPhase === 'work' ? pomodoroWorkDuration : pomodoroBreakDuration;
    const fraction = total > 0 ? timerRemaining / total : 0;
    setGaugeProgress(fraction);

    pomoCycleCount.textContent = `#${pomodoroCycles}`;
    if (pomodoroPhase === 'work') {
      pomoBadgeText.textContent = '集中タイム (25分)';
      pomoStatusBadge.style.borderColor = 'rgba(234, 88, 12, 0.4)';
      if (isRunning) {
        statusLabel.textContent = 'FOCUS';
        subTimeDisplay.textContent = '深呼吸して作業に没頭';
      } else {
        statusLabel.textContent = 'READY';
        subTimeDisplay.textContent = '集中をスタート';
      }
    } else {
      pomoBadgeText.textContent = 'リラックス休憩 (5分)';
      pomoStatusBadge.style.borderColor = 'rgba(34, 197, 94, 0.4)';
      if (isRunning) {
        statusLabel.textContent = 'REST';
        subTimeDisplay.textContent = '肩の力を抜いてリフレッシュ';
      } else {
        statusLabel.textContent = 'BREAK READY';
        subTimeDisplay.textContent = '休憩をスタート';
      }
    }
  } else if (currentMode === 'stopwatch') {
    mainTimeDisplay.textContent = formatStopwatchTime(swElapsedTime);
    statusLabel.textContent = isRunning ? 'TRACKING' : (swElapsedTime > 0 ? 'PAUSED' : 'STOPWATCH');
    subTimeDisplay.textContent = `${swLaps.length} ラップ記録`;
    const secFraction = (swElapsedTime % 60000) / 60000;
    setGaugeProgress(secFraction);
  }
}

// ==========================================================================
// 5. Timer Controls & Logic
// ==========================================================================

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timerCard.classList.add('running');
  toggleIcon.className = 'fa-solid fa-pause';
  audio.init();

  if (ambientEnabled) {
    audio.startAmbient(selectedAmbientSound);
  }

  if (currentMode === 'timer' || currentMode === 'pomodoro') {
    let lastTick = performance.now();
    timerInterval = setInterval(() => {
      const now = performance.now();
      const delta = (now - lastTick) / 1000;
      
      if (delta >= 1) {
        const fullSeconds = Math.floor(delta);
        timerRemaining -= fullSeconds;
        lastTick = now - (delta % 1) * 1000;

        if (timerRemaining <= 0) {
          timerRemaining = 0;
          onTimerComplete();
        }
        updateDisplay();
      }
    }, 200);
  } else if (currentMode === 'stopwatch') {
    swStartTime = performance.now() - swElapsedTime;
    timerInterval = setInterval(() => {
      swElapsedTime = performance.now() - swStartTime;
      updateDisplay();
    }, 30);
  }
  updateDisplay();
}

function pauseTimer() {
  if (!isRunning) return;
  isRunning = false;
  timerCard.classList.remove('running');
  toggleIcon.className = 'fa-solid fa-play';
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (ambientEnabled) {
    audio.stopAmbient();
  }
  updateDisplay();
}

function toggleTimer() {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function resetTimer() {
  pauseTimer();
  if (currentMode === 'timer') {
    timerRemaining = timerDuration;
  } else if (currentMode === 'pomodoro') {
    pomodoroPhase = 'work';
    timerDuration = pomodoroWorkDuration;
    timerRemaining = pomodoroWorkDuration;
    pomodoroCycles = 1;
  } else if (currentMode === 'stopwatch') {
    swElapsedTime = 0;
    swLaps = [];
    renderLaps();
  }
  updateDisplay();
}

function onTimerComplete() {
  pauseTimer();
  audio.playAlarm(selectedAlarmSound);

  if (currentMode === 'pomodoro') {
    if (pomodoroPhase === 'work') {
      pomodoroPhase = 'break';
      timerDuration = pomodoroBreakDuration;
      timerRemaining = pomodoroBreakDuration;
      statusLabel.textContent = 'WORK COMPLETE!';
      subTimeDisplay.textContent = '素晴らしい集中でした！お茶をどうぞ';
    } else {
      pomodoroPhase = 'work';
      pomodoroCycles++;
      timerDuration = pomodoroWorkDuration;
      timerRemaining = pomodoroWorkDuration;
      statusLabel.textContent = 'REST COMPLETE!';
      subTimeDisplay.textContent = 'リフレッシュ完了！次の集中へ';
    }
  } else {
    statusLabel.textContent = 'TIME UP!';
    subTimeDisplay.textContent = 'おつかれさまでした ✨';
  }
  setGaugeProgress(0);
}

// ==========================================================================
// 6. Mode Switching
// ==========================================================================

function switchMode(newMode) {
  if (currentMode === newMode) return;
  pauseTimer();
  currentMode = newMode;

  modeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === newMode);
  });

  if (newMode === 'timer') {
    presetsPanel.classList.remove('hidden');
    customTimePanel.classList.remove('hidden');
    pomoStatusBadge.classList.add('hidden');
    lapBtn.classList.add('hidden');
    lapContainer.classList.add('hidden');
    timerRemaining = timerDuration;
  } else if (newMode === 'pomodoro') {
    presetsPanel.classList.add('hidden');
    customTimePanel.classList.add('hidden');
    pomoStatusBadge.classList.remove('hidden');
    lapBtn.classList.add('hidden');
    lapContainer.classList.add('hidden');
    pomodoroPhase = 'work';
    timerDuration = pomodoroWorkDuration;
    timerRemaining = pomodoroWorkDuration;
  } else if (newMode === 'stopwatch') {
    presetsPanel.classList.add('hidden');
    customTimePanel.classList.add('hidden');
    pomoStatusBadge.classList.add('hidden');
    lapBtn.classList.remove('hidden');
    lapContainer.classList.remove('hidden');
  }

  updateDisplay();
}

// Presets & Custom Time Handlers
presetPills.forEach(pill => {
  pill.addEventListener('click', () => {
    presetPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const secs = parseInt(pill.dataset.seconds, 10);
    timerDuration = secs;
    timerRemaining = secs;
    
    inputMinutes.value = Math.floor(secs / 60);
    inputSeconds.value = secs % 60;
    
    pauseTimer();
    updateDisplay();
  });
});

applyCustomBtn.addEventListener('click', () => {
  const min = parseInt(inputMinutes.value, 10) || 0;
  const sec = parseInt(inputSeconds.value, 10) || 0;
  const total = Math.max(1, min * 60 + sec);

  timerDuration = total;
  timerRemaining = total;
  
  presetPills.forEach(p => {
    p.classList.toggle('active', parseInt(p.dataset.seconds, 10) === total);
  });

  pauseTimer();
  updateDisplay();
});

// Stopwatch Lap
lapBtn.addEventListener('click', () => {
  if (currentMode !== 'stopwatch' || swElapsedTime === 0) return;
  const lapTime = swElapsedTime;
  swLaps.unshift(lapTime);
  renderLaps();
});

function renderLaps() {
  lapList.innerHTML = '';
  swLaps.forEach((lap, idx) => {
    const li = document.createElement('li');
    li.className = 'lap-item';
    li.innerHTML = `
      <span>Lap ${swLaps.length - idx}</span>
      <span>${formatStopwatchTime(lap)}</span>
    `;
    lapList.appendChild(li);
  });
}

// Sound Settings & Drawer Handlers
soundSettingsToggle.addEventListener('click', () => {
  audio.init();
  soundDrawer.classList.toggle('open');
});

drawerCloseBtn.addEventListener('click', () => {
  soundDrawer.classList.remove('open');
  if (!isRunning && ambientEnabled) {
    audio.stopAmbient();
  }
});

// Alarm chip selection
soundChips.forEach(chip => {
  chip.addEventListener('click', () => {
    soundChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedAlarmSound = chip.dataset.sound;
    audio.playAlarm(selectedAlarmSound);
  });
});

previewAlarmBtn.addEventListener('click', () => {
  audio.playAlarm(selectedAlarmSound);
});

// Ambient chip selection
ambientChips.forEach(chip => {
  chip.addEventListener('click', () => {
    ambientChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedAmbientSound = chip.dataset.ambient;

    if (ambientEnabled || soundDrawer.classList.contains('open')) {
      ambientToggle.checked = true;
      ambientEnabled = true;
      audio.startAmbient(selectedAmbientSound);
    }
  });
});

// Ambient toggle switch
ambientToggle.addEventListener('change', (e) => {
  ambientEnabled = e.target.checked;
  audio.init();
  if (ambientEnabled) {
    audio.startAmbient(selectedAmbientSound);
  } else {
    audio.stopAmbient();
  }
});

// Volume sliders
alarmVolSlider.addEventListener('input', (e) => {
  const val = parseInt(e.target.value, 10);
  alarmVolVal.textContent = `${val}%`;
  audio.setAlarmVolume(val / 100);
});

ambientVolSlider.addEventListener('input', (e) => {
  const val = parseInt(e.target.value, 10);
  ambientVolVal.textContent = `${val}%`;
  audio.setAmbientVolume(val / 100);
});

// Header Actions (Theme & Fullscreen)
themeToggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  themeToggleBtn.innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
});

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
  }
});

// Mode buttons event listeners
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    switchMode(btn.dataset.mode);
  });
});

// Main Action Buttons
toggleBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize display
updateDisplay();
