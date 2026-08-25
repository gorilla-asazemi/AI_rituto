/**
 * Dynamic Multi-Genre Immersion Engine (Distinct 3-Phase Ambient Edition)
 * 一聴してはっきり世界観・音色・ジャンルの違いを体感できる最高峰マルチBGMエンジン
 */

class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.currentPhase = 1;
    this.isPlaying = false;
    this.loopTimer = null;
    this.activeNodes = [];
  }

  // AudioContext の初期化と Resume
  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      try {
        this.audioCtx.resume();
      } catch (e) {}
    }
  }

  // クリーンアップ
  clearBGM() {
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }

  // BGM再生開始
  startBGM(phase = 1) {
    this.init();

    if (this.isPlaying && this.currentPhase === phase) return;

    this.clearBGM();
    this.currentPhase = phase;
    this.isPlaying = true;

    switch (phase) {
      case 1:
        this.playPhase1BossaCafe();
        break;
      case 2:
        this.playPhase2RainyLoFiRhodes();
        break;
      case 3:
        this.playPhase3CrystalPianoAmbient();
        break;
      default:
        this.playPhase1BossaCafe();
        break;
    }
  }

  // ☕ PHASE 1: 陽のあたるカフェ・アコースティックボサノバ (軽快なギター指弾き＆カフェ雰囲気)
  playPhase1BossaCafe() {
    // 暖かく心地よいカフェノイズ
    this.startBackgroundNoise(450, 0.025);

    // 明るく軽快なボサノバ風進行
    const progression = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [164.81, 196.00, 246.94, 293.66], // Em7
      [146.83, 174.61, 220.00, 261.63], // Dm7
      [130.81, 164.81, 196.00, 246.94], // Cmaj7
      [174.61, 220.00, 261.63, 349.23], // Fmaj7(9)
      [164.81, 207.65, 246.94, 293.66], // E7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ];

    const melodyNotes = [329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

    let stepIdx = 0;
    const playStep = () => {
      if (!this.isPlaying || this.currentPhase !== 1) return;
      this.init();

      const chord = progression[stepIdx % progression.length];
      stepIdx++;

      // ボサノバ風カッティング（裏拍を感じさせる軽快なストローク）
      chord.forEach((freq, idx) => {
        // シンコペーションのタイミング（0ms, 180ms, 420ms, 600ms）
        const patternDelays = [0, 180, 420, 600];
        const delay = patternDelays[idx % patternDelays.length] + (Math.random() * 20 - 10);
        
        setTimeout(() => {
          if (!this.isPlaying || this.currentPhase !== 1) return;
          // アコースティックギター調の歯切れ良いトライアングル波
          this.triggerGuitarTone(freq, 1.8, 0.05);
        }, Math.max(0, delay));
      });

      // 時折跳ねる軽やかなメロディ
      if (Math.random() > 0.3) {
        const randomNote = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
        setTimeout(() => {
          if (!this.isPlaying || this.currentPhase !== 1) return;
          this.triggerGuitarTone(randomNote, 1.5, 0.04);
        }, 900 + Math.random() * 400);
      }
    };

    playStep();
    this.loopTimer = setInterval(playStep, 3200);
  }

  // 🌧️ PHASE 2: 雨音メロウ Lo-Fi エレピ ＋ ウォームベース (メロウで大人な雰囲気)
  playPhase2RainyLoFiRhodes() {
    // しとしと降り注ぐ高音カット雨音ノイズ
    this.startBackgroundNoise(750, 0.04);

    const progression = [
      [138.59, 207.65, 246.94, 311.13, 370.00], // C#m7
      [146.83, 220.00, 261.63, 329.63, 440.00], // F#m7
      [123.47, 185.00, 220.00, 293.66, 370.00], // B7
      [164.81, 207.65, 246.94, 311.13, 392.00]  // Emaj7
    ];

    let stepIdx = 0;
    const playStep = () => {
      if (!this.isPlaying || this.currentPhase !== 2) return;
      this.init();

      const chord = progression[stepIdx % progression.length];
      stepIdx++;

      // 1. 低音ベースライン（しっかりした音圧のベース）
      const rootFreq = chord[0];
      this.triggerBassTone(rootFreq, 3.2, 0.06);

      // 2. メロウなRhodesエレピ（アルペジオ＆残響）
      chord.slice(1).forEach((freq, idx) => {
        const delay = idx * 240 + (Math.random() * 30 - 15);
        setTimeout(() => {
          if (!this.isPlaying || this.currentPhase !== 2) return;
          this.triggerRhodesTone(freq, 2.8, 0.045);
        }, Math.max(0, delay));
      });
    };

    playStep();
    this.loopTimer = setInterval(playStep, 3600);
  }

  // 🌌 PHASE 3: 深層没入・クリスタルピアノ ＋ ディープドローン (澄み切った余韻と静寂)
  playPhase3CrystalPianoAmbient() {
    // 深層アンビエントドローン
    this.startBackgroundNoise(300, 0.02);

    const progression = [
      [220.00, 329.63, 392.00, 493.88, 659.25], // Am9
      [174.61, 261.63, 329.63, 440.00, 523.25], // Fmaj7
      [196.00, 293.66, 392.00, 493.88, 587.33], // Gadd9
      [130.81, 196.00, 261.63, 329.63, 392.00]  // Cmaj7
    ];

    let stepIdx = 0;
    const playStep = () => {
      if (!this.isPlaying || this.currentPhase !== 3) return;
      this.init();

      const chord = progression[stepIdx % progression.length];
      stepIdx++;

      // 澄み切ったクリスタル高音ピアノ
      chord.forEach((freq, idx) => {
        const delay = idx * 320 + (Math.random() * 20);
        setTimeout(() => {
          if (!this.isPlaying || this.currentPhase !== 3) return;
          this.triggerCrystalPianoTone(freq, 4.0, 0.04);
        }, Math.max(0, delay));
      });
    };

    playStep();
    this.loopTimer = setInterval(playStep, 4200);
  }

  // --- 各ジャンル専用の音色合成メソッド ---

  // Phase 1用: 歯切れよく明るいアコースティックギター調
  triggerGuitarTone(freq, duration, volume) {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);

      // アタックが早く歯切れ良い減衰
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.04);
      gain.gain.linearRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (e) {}
  }

  // Phase 2用: Rhodesエレピ調 (モジュレーションの効いた深い和音)
  triggerRhodesTone(freq, duration, volume) {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // マロウで丸みのある800Hzフィルター
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, now);

      // ゆったりとしたフェード
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.08);
      gain.gain.linearRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (e) {}
  }

  // Phase 2用: ウォーム低音ベース
  triggerBassTone(freq, duration, volume) {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq / 2, now); // 1オクターブ下

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.05);
      gain.gain.linearRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (e) {}
  }

  // Phase 3用: 澄み切ったクリスタル高音ピアノ
  triggerCrystalPianoTone(freq, duration, volume) {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // 倍音ハーモニクス
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.06);
      gain.gain.linearRampToValueAtTime(0.0001, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
    } catch (e) {}
  }

  // カフェ・雨音の背景ノイズ
  startBackgroundNoise(cutoffFreq, volume) {
    if (!this.audioCtx) return;

    try {
      const sampleRate = this.audioCtx.sampleRate;
      const bufferSize = sampleRate * 2;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(cutoffFreq, this.audioCtx.currentTime);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start();
      this.activeNodes.push(noise, gain);
    } catch (e) {
      console.warn('Noise generation error:', e);
    }
  }

  stopBGM() {
    this.isPlaying = false;
    this.clearBGM();
  }

  playClickSound() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try { this.audioCtx.resume(); } catch(e){}
    }
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.018, now + 0.01);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch(e) {}
  }

  playPhaseSignal() {
    this.init();
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      setTimeout(() => {
        this.triggerGuitarTone(freq, 0.35, 0.04);
      }, idx * 120);
    });
  }

  playFinishBell() {
    this.init();
    [130.81, 261.63, 392.00, 523.25].forEach((freq, idx) => {
      this.triggerCrystalPianoTone(freq, 3.5, 0.06 / (idx + 1));
    });
  }
}

window.audioEngine = new AudioEngine();
