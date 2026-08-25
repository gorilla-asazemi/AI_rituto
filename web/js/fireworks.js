/* =========================================================
   びわ湖大花火大会 特製オリジナル演出 Canvas エンジン (Ver 11.0)
   - 3秒毎: バナナ玉 ➔ 【リアルゴリラ顔イラスト演出】回転舞い落ち！
            ＋ 歓声ボイス演出（🗣️「WoW!」「Gorilla!」「banana!」）
   - 5秒毎: 9月玉 ➔ 【「51オ」完全再現カタカナ文字花火】
   - 7秒毎: 【フィナーレ単独独占演出】➔ ボイスを「た〜まや〜！」に変更！
   - 🎵 Web Audio BGM ＆ 右上コンパクトアイコンボタン
   ========================================================= */

class FestivalFireworksCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.fireworks = [];
    this.fallingGorillas = [];
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.waterLevel = 0.74;
    
    this.isFinaleRunning = false;
    this.audioEnabled = false;
    this.audioCtx = null;
    
    this.init();
    this.setupAudioControls();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // 通常花火（1.8秒毎）
    setInterval(() => {
      if (document.hidden || this.isFinaleRunning) return;
      this.launchColorfulFirework();
    }, 1800);

    // 【3秒毎】バナナ玉 ➔ リアルゴリラ顔面 ＋ ボイス歓声（「WoW!」「Gorilla!」「banana!」）
    setInterval(() => {
      if (document.hidden || this.isFinaleRunning) return;
      this.launchGorillaFace();
    }, 3000);

    // 【5秒毎】9月玉 ➔ カタカナ「51オ」文字花火
    setInterval(() => {
      if (document.hidden || this.isFinaleRunning) return;
      this.launchAge51Firework();
    }, 5000);

    // 【7秒毎・独占演出】フィナーレ時は「た〜まや〜！」
    setInterval(() => {
      if (document.hidden) return;
      this.triggerFinaleSolo();
    }, 7000);

    // 初期起動
    setTimeout(() => this.launchGorillaFace(), 300);
    setTimeout(() => this.launchAge51Firework(), 1400);

    this.animate();
  }

  // 🎵 右上のコンパクト丸型アイコンボタンでBGM/ボイスのON/OFF
  setupAudioControls() {
    const btn = document.getElementById('bgm-toggle-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      this.audioEnabled = !this.audioEnabled;

      if (this.audioEnabled) {
        btn.classList.add('active');
        btn.innerHTML = '<span class="icon">🔊</span>';
        this.startFestivalBGM();
        this.speakVoice('たまやー！');
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<span class="icon">🎵</span>';
        if (this.audioCtx) {
          this.audioCtx.suspend();
        }
      }
    });
  }

  // Web Audio API によるフェスティバルBGM
  startFestivalBGM() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.bgmInterval) clearInterval(this.bgmInterval);
    
    let step = 0;
    const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 293.66];

    this.bgmInterval = setInterval(() => {
      if (!this.audioEnabled || !this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      if (step % 2 === 0) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      }

      const note = notes[step % notes.length];
      const oscM = this.audioCtx.createOscillator();
      const gainM = this.audioCtx.createGain();
      oscM.type = 'triangle';
      oscM.frequency.setValueAtTime(note, now);
      gainM.gain.setValueAtTime(0.12, now);
      gainM.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      oscM.connect(gainM);
      gainM.connect(this.audioCtx.destination);
      oscM.start(now);
      oscM.stop(now + 0.25);

      step++;
    }, 220);
  }

  // 🗣️ ボイス発声（英語歓声 ＆ 「たまやー！」）
  speakVoice(text) {
    if (!this.audioEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    if (text.includes('たまや')) {
      utter.lang = 'ja-JP';
      utter.rate = 0.9;
      utter.pitch = 1.1;
    } else {
      utter.lang = 'en-US';
      utter.rate = 1.25;
      utter.pitch = 1.35;
    }
    utter.volume = 1.0;
    
    window.speechSynthesis.speak(utter);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  // 【ユーザー指定】7秒毎のフィナーレ大花火 ➔ 「たまやー！」
  triggerFinaleSolo() {
    this.isFinaleRunning = true;
    
    const startX = this.width * 0.5;
    const targetY = this.height * 0.08;
    this.fireworks.push(new BaseFirework(startX, this.height * this.waterLevel, targetY, ['#ffd700', '#ff0844', '#ffffff'], 'finale'));

    if (this.audioEnabled) {
      this.speakVoice('たまやー！');
    }

    setTimeout(() => {
      this.isFinaleRunning = false;
    }, 2500);
  }

  launchColorfulFirework() {
    const startX = this.width * (0.15 + Math.random() * 0.7);
    const targetY = this.height * (0.1 + Math.random() * 0.35);
    const colorSets = [
      ['#ff0844', '#ff4757', '#ffd700'],
      ['#ff3366', '#ff99ac', '#ffffff'],
      ['#ff4757', '#00f2fe', '#ffd700'],
      ['#ff7f50', '#ffbe76', '#ffffff'],
    ];
    const colors = colorSets[Math.floor(Math.random() * colorSets.length)];
    this.fireworks.push(new BaseFirework(startX, this.height * this.waterLevel, targetY, colors, 'normal'));
  }

  launchGorillaFace() {
    const startX = this.width * (0.2 + Math.random() * 0.28);
    const targetY = this.height * (0.15 + Math.random() * 0.15);
    this.fireworks.push(new BaseFirework(startX, this.height * this.waterLevel, targetY, ['#ffd700', '#ff9f43'], 'gorilla'));
  }

  launchAge51Firework() {
    const startX = this.width * (0.52 + Math.random() * 0.28);
    const targetY = this.height * (0.15 + Math.random() * 0.15);
    this.fireworks.push(new BaseFirework(startX, this.height * this.waterLevel, targetY, ['#ffffff', '#ffd700', '#ff4757'], 'age51'));
  }

  drawBiwakoBackground(waterY) {
    this.ctx.save();
    
    // 山並み
    this.ctx.fillStyle = '#040817';
    this.ctx.beginPath();
    this.ctx.moveTo(0, waterY);
    
    const mountainPoints = [
      { x: 0, y: waterY - 45 },
      { x: this.width * 0.15, y: waterY - 90 },
      { x: this.width * 0.32, y: waterY - 55 },
      { x: this.width * 0.52, y: waterY - 110 },
      { x: this.width * 0.72, y: waterY - 65 },
      { x: this.width * 0.88, y: waterY - 95 },
      { x: this.width, y: waterY - 40 }
    ];

    this.ctx.lineTo(mountainPoints[0].x, mountainPoints[0].y);
    for (let i = 1; i < mountainPoints.length; i++) {
      this.ctx.lineTo(mountainPoints[i].x, mountainPoints[i].y);
    }
    this.ctx.lineTo(this.width, waterY);
    this.ctx.closePath();
    this.ctx.fill();

    // 琵琶湖水面
    const waterGrad = this.ctx.createLinearGradient(0, waterY, 0, this.height);
    waterGrad.addColorStop(0, 'rgba(8, 18, 48, 0.9)');
    waterGrad.addColorStop(0.4, 'rgba(4, 10, 30, 0.95)');
    waterGrad.addColorStop(1, 'rgba(2, 4, 14, 0.99)');
    this.ctx.fillStyle = waterGrad;
    this.ctx.fillRect(0, waterY, this.width, this.height - waterY);

    // 水面境目
    this.ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, waterY);
    this.ctx.lineTo(this.width, waterY);
    this.ctx.stroke();

    // 街の光
    for (let x = 10; x < this.width; x += 25) {
      if ((x * 19) % 7 < 4) {
        const glowColor = (x % 2 === 0) ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 71, 87, 0.8)';
        this.ctx.fillStyle = glowColor;
        this.ctx.fillRect(x, waterY - 3, 2.5, 2.5);
      }
    }

    this.ctx.restore();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.ctx.fillStyle = 'rgba(7, 12, 28, 0.22)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const waterY = this.height * this.waterLevel;

    this.drawBiwakoBackground(waterY);

    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      fw.update();
      fw.draw(this.ctx);

      if (fw.exploded) {
        this.createCustomExplosion(fw, waterY);
        this.fireworks.splice(i, 1);
      }
    }

    for (let i = this.fallingGorillas.length - 1; i >= 0; i--) {
      const g = this.fallingGorillas[i];
      g.update();
      g.draw(this.ctx, waterY);

      if (g.alpha <= 0 || g.y > waterY + 40) {
        this.fallingGorillas.splice(i, 1);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      p.draw(this.ctx);

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  createCustomExplosion(fw, waterY) {
    if (fw.type === 'gorilla') {
      const expressions = ['smile', 'cry', 'angry', 'cool', 'surprised'];
      const expr = expressions[Math.floor(Math.random() * expressions.length)];
      
      for (let k = 0; k < 2; k++) {
        this.fallingGorillas.push(new RealGorillaFace(
          fw.x + (Math.random() * 50 - 25),
          fw.y + (Math.random() * 30 - 15),
          expr
        ));
      }

      for (let i = 0; i < 35; i++) {
        this.particles.push(new DynamicParticle(fw.x, fw.y, '#ffd700', waterY, false));
      }

      // 📢 ゴリラ花火時の指定3フレーズ（WoW!, Gorilla!, banana!）
      const gorillaVoices = ['WoW!', 'Gorilla!', 'banana!'];
      const randomVoice = gorillaVoices[Math.floor(Math.random() * gorillaVoices.length)];
      this.speakVoice(randomVoice);
    } 
    else if (fw.type === 'age51') {
      const age51PerfectOGrid = [
        {x: -70, y: -35}, {x: -56, y: -35}, {x: -42, y: -35}, {x: -28, y: -35},
        {x: -70, y: -18},
        {x: -70, y: 0}, {x: -56, y: 0}, {x: -42, y: 0}, {x: -28, y: 0},
        {x: -28, y: 18},
        {x: -70, y: 35}, {x: -56, y: 35}, {x: -42, y: 35}, {x: -28, y: 35},

        {x: -8, y: -35}, {x: 2, y: -35},
        {x: 2, y: -18}, {x: 2, y: 0}, {x: 2, y: 18},
        {x: -10, y: 35}, {x: 2, y: 35}, {x: 14, y: 35},

        // カタカナ「オ」完全再現
        {x: 35, y: -22}, {x: 48, y: -22}, {x: 61, y: -22}, {x: 74, y: -22}, {x: 87, y: -22},
        {x: 61, y: -42}, {x: 61, y: -30}, {x: 61, y: -10}, {x: 61, y: 8}, {x: 61, y: 24}, {x: 61, y: 38},
        {x: 52, y: -8}, {x: 43, y: 8}, {x: 34, y: 24}
      ];

      age51PerfectOGrid.forEach(pt => {
        const color = (pt.x > 20) ? '#ff4757' : '#ffffff';
        this.particles.push(new ShapeHoldParticle(fw.x, fw.y, pt.x * 1.45, pt.y * 1.45, color, waterY));
      });
    } 
    else if (fw.type === 'finale') {
      for (let i = 0; i < 250; i++) {
        const colors = ['#ffd700', '#ff0844', '#ffffff', '#ff7f50'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        this.particles.push(new DynamicParticle(fw.x, fw.y, color, waterY, true));
      }
    } 
    else {
      for (let i = 0; i < 75; i++) {
        const color = fw.colors[Math.floor(Math.random() * fw.colors.length)];
        this.particles.push(new DynamicParticle(fw.x, fw.y, color, waterY, false));
      }
    }
  }
}

// リアルゴリラ顔イラストクラス
class RealGorillaFace {
  constructor(x, y, expression) {
    this.x = x;
    this.y = y;
    this.expression = expression;
    this.angle = Math.random() * Math.PI * 2;
    this.rotateSpeed = (Math.random() - 0.5) * 0.07;
    this.vx = (Math.random() - 0.5) * 2.2;
    this.vy = Math.random() * 1.4 + 1.1;
    this.scale = Math.random() * 0.3 + 0.9;
    this.alpha = 1;
    this.decay = 0.005 + Math.random() * 0.003;
  }

  update() {
    this.x += this.vx + Math.sin(Date.now() * 0.003) * 0.8;
    this.y += this.vy;
    this.angle += this.rotateSpeed;
    this.alpha -= this.decay;
  }

  draw(ctx, waterY) {
    if (this.alpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.scale(this.scale, this.scale);

    ctx.shadowBlur = 16;
    ctx.shadowColor = '#ffd700';

    ctx.fillStyle = '#2b1800';
    ctx.beginPath();
    ctx.moveTo(0, -45);
    ctx.lineTo(25, -35);
    ctx.lineTo(38, -15);
    ctx.lineTo(44, 10);
    ctx.lineTo(32, 40);
    ctx.lineTo(-32, 40);
    ctx.lineTo(-44, 10);
    ctx.lineTo(-38, -15);
    ctx.lineTo(-25, -35);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.fillStyle = '#4a2c00';
    ctx.beginPath();
    ctx.rect(-32, -22, 64, 14);
    ctx.fill();

    ctx.fillStyle = '#c49a6c';
    ctx.beginPath();
    ctx.ellipse(0, 15, 26, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1a0b00';
    ctx.strokeStyle = '#1a0b00';
    ctx.lineWidth = 3.5;

    if (this.expression === 'smile') {
      ctx.beginPath(); ctx.arc(-14, -15, 4, 0, Math.PI * 2); ctx.arc(14, -15, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, 18, 14, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
    } 
    else if (this.expression === 'cry') {
      ctx.beginPath(); ctx.moveTo(-18, -18); ctx.lineTo(-10, -12); ctx.moveTo(18, -18); ctx.lineTo(10, -12); ctx.stroke();
      ctx.fillStyle = '#00f2fe'; ctx.beginPath(); ctx.arc(-14, -6, 3.5, 0, Math.PI * 2); ctx.arc(14, -6, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, 26, 9, Math.PI, 0); ctx.stroke();
    } 
    else if (this.expression === 'angry') {
      ctx.beginPath(); ctx.moveTo(-20, -20); ctx.lineTo(-8, -14); ctx.moveTo(20, -20); ctx.lineTo(8, -14); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 26, 12, Math.PI, 0); ctx.stroke();
    } 
    else if (this.expression === 'cool') {
      ctx.fillStyle = '#111111';
      ctx.fillRect(-26, -22, 52, 14);
      ctx.beginPath(); ctx.arc(0, 18, 14, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
    } 
    else {
      ctx.beginPath(); ctx.arc(-14, -15, 5, 0, Math.PI * 2); ctx.arc(14, -15, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, 18, 9, 0, Math.PI * 2); ctx.stroke();
    }

    ctx.fillStyle = '#1a0b00';
    ctx.beginPath();
    ctx.ellipse(-6, 5, 4, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(6, 5, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class BaseFirework {
  constructor(x, startY, targetY, colors, type) {
    this.x = x;
    this.y = startY;
    this.targetY = targetY;
    this.colors = colors;
    this.type = type;
    this.speed = (type === 'finale') ? 11 : 9.5;
    this.exploded = false;
    this.history = [];
  }

  update() {
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > 5) this.history.shift();

    this.y -= this.speed;
    if (this.y <= this.targetY) {
      this.exploded = true;
    }
  }

  draw(ctx) {
    ctx.save();
    
    if (this.type === 'gorilla') {
      ctx.fillStyle = '#ffd700';
      ctx.font = '900 38px sans-serif';
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#ffd700';
      ctx.fillText('🍌', this.x - 18, this.y);

      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 4;
      ctx.beginPath();
      if (this.history.length > 0) {
        ctx.moveTo(this.history[0].x, this.history[0].y + 10);
        ctx.lineTo(this.x, this.y + 10);
      }
      ctx.stroke();
    } 
    else if (this.type === 'age51') {
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 32px sans-serif';
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#ffffff';
      ctx.fillText('9月', this.x - 22, this.y);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      if (this.history.length > 0) {
        ctx.moveTo(this.history[0].x, this.history[0].y + 10);
        ctx.lineTo(this.x, this.y + 10);
      }
      ctx.stroke();
    } 
    else {
      ctx.strokeStyle = this.colors[0];
      ctx.lineWidth = (this.type === 'finale') ? 4 : 2.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.colors[0];
      ctx.beginPath();
      if (this.history.length > 0) {
        ctx.moveTo(this.history[0].x, this.history[0].y);
        ctx.lineTo(this.x, this.y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }
}

class ShapeHoldParticle {
  constructor(startX, startY, targetOffsetX, targetOffsetY, color, waterY) {
    this.startX = startX;
    this.startY = startY;
    this.x = startX;
    this.y = startY;
    this.color = color;
    this.waterY = waterY;

    this.vx = targetOffsetX * 0.085;
    this.vy = targetOffsetY * 0.085;

    this.alpha = 1;
    this.decay = 0.0055;
    this.size = 4.5;
  }

  update() {
    this.vx *= 0.88;
    this.vy *= 0.88;
    this.vy += 0.015;

    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);

    ctx.fillStyle = this.color;
    ctx.shadowBlur = 14;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    if (this.y < this.waterY) {
      const distFromWater = this.waterY - this.y;
      const reflectY = this.waterY + distFromWater * 0.55;

      if (reflectY < window.innerHeight) {
        const waveX = this.x + Math.sin(Date.now() * 0.007 + reflectY * 0.05) * 4;
        ctx.globalAlpha = Math.max(0, this.alpha * 0.5);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 16;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.ellipse(waveX, reflectY, this.size * 2.5, this.size * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}

class DynamicParticle {
  constructor(x, y, color, waterY, isFinale) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.waterY = waterY;
    this.isFinale = isFinale;

    const angle = Math.random() * Math.PI * 2;
    const speed = isFinale ? (Math.random() * 8.5 + 2) : (Math.random() * 5.5 + 1.2);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.gravity = isFinale ? 0.045 : 0.055;
    this.friction = isFinale ? 0.98 : 0.965;
    this.alpha = 1;
    this.decay = isFinale ? (0.005 + Math.random() * 0.006) : (0.012 + Math.random() * 0.014);
    this.size = Math.random() * 3 + 1.5;
  }

  update() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;

    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);

    ctx.fillStyle = this.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    if (this.y < this.waterY) {
      const distFromWater = this.waterY - this.y;
      const reflectY = this.waterY + distFromWater * 0.55;

      if (reflectY < window.innerHeight) {
        const waveX = this.x + Math.sin(Date.now() * 0.007 + reflectY * 0.05) * 5;
        ctx.globalAlpha = Math.max(0, this.alpha * 0.45);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.ellipse(waveX, reflectY, this.size * 2.5, this.size * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FestivalFireworksCanvas('fireworks-canvas');
});
