/**
 * G-SHOCK Style Analog Clock & Chronograph Canvas Renderer (Dynamic Scale Edition)
 * 可変時間（30分初期設定・カスタム時間）対応のメカニカル時計描画
 */

class GShockClock {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.radius = Math.min(this.centerX, this.centerY) - 15;

    this.totalSeconds = 1800; // 初期設定: 30分
    this.remainingSeconds = 1800;
  }

  // 残り時間・合計時間のセット
  setTime(remainingSeconds, totalSeconds = 1800) {
    this.remainingSeconds = Math.max(0, remainingSeconds);
    this.totalSeconds = Math.max(1, totalSeconds);
    this.draw();
  }

  draw() {
    const { ctx, centerX, centerY, radius } = this;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. ベゼル外枠
    ctx.save();
    const bezelGrad = ctx.createRadialGradient(centerX, centerY, radius - 20, centerX, centerY, radius + 10);
    bezelGrad.addColorStop(0, '#1a222d');
    bezelGrad.addColorStop(0.7, '#3a4454');
    bezelGrad.addColorStop(0.9, '#121720');
    bezelGrad.addColorStop(1, '#4a5568');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = bezelGrad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#64748b';
    ctx.stroke();

    // 2. 文字盤ベース
    const dialGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius - 15);
    dialGrad.addColorStop(0, '#0f1722');
    dialGrad.addColorStop(0.8, '#0b0f17');
    dialGrad.addColorStop(1, '#05070a');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 15, 0, Math.PI * 2);
    ctx.fillStyle = dialGrad;
    ctx.fill();

    // 3. 経過時間円形アークインジケーター（ゲージ）
    const elapsedRatio = Math.min(1, (this.totalSeconds - this.remainingSeconds) / this.totalSeconds);
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (Math.PI * 2 * elapsedRatio);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 28, 0, Math.PI * 2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.stroke();

    if (elapsedRatio > 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 28, startAngle, endAngle);
      ctx.lineWidth = 12;
      const gaugeGrad = ctx.createConicGradient(startAngle, centerX, centerY);
      gaugeGrad.addColorStop(0, '#e5a93b');
      gaugeGrad.addColorStop(0.5, '#00f0ff');
      gaugeGrad.addColorStop(1, '#34c759');
      ctx.strokeStyle = gaugeGrad;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // 4. 目盛り描画
    this.drawTicks();

    // 5. サブダイヤルロゴ
    this.drawSubDials();

    // 6. アナログ針
    this.drawHands();

    // 7. センターキャップ
    ctx.beginPath();
    ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
    const capGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 14);
    capGrad.addColorStop(0, '#cbd5e0');
    capGrad.addColorStop(0.7, '#4a5568');
    capGrad.addColorStop(1, '#1a202c');
    ctx.fillStyle = capGrad;
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  drawTicks() {
    const { ctx, centerX, centerY, radius } = this;
    const tickRadius = radius - 44;

    ctx.save();
    for (let i = 0; i < 60; i++) {
      const angle = (i * Math.PI / 30) - (Math.PI / 2);
      const isMajor = i % 5 === 0;

      const innerLen = isMajor ? 16 : 8;
      const x1 = centerX + Math.cos(angle) * (tickRadius - innerLen);
      const y1 = centerY + Math.sin(angle) * (tickRadius - innerLen);
      const x2 = centerX + Math.cos(angle) * tickRadius;
      const y2 = centerY + Math.sin(angle) * tickRadius;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = isMajor ? 3 : 1.5;
      ctx.strokeStyle = isMajor ? '#e2e8f0' : '#4a5568';
      ctx.stroke();

      // 四分位インデックス（12時: SET TIME, 3時: 25%, 6時: 50%, 9時: 75%）
      if (i % 15 === 0) {
        const labelX = centerX + Math.cos(angle) * (tickRadius - 30);
        const labelY = centerY + Math.sin(angle) * (tickRadius - 30);
        ctx.font = '900 12px Orbitron';
        ctx.fillStyle = '#00f0ff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let labelText = '';
        const totalMin = Math.round(this.totalSeconds / 60);

        if (i === 0) labelText = `${totalMin}m`;
        else if (i === 15) labelText = `${Math.round(totalMin * 0.25)}m`;
        else if (i === 30) labelText = `${Math.round(totalMin * 0.5)}m`;
        else if (i === 45) labelText = `${Math.round(totalMin * 0.75)}m`;

        ctx.fillText(labelText, labelX, labelY);
      }
    }
    ctx.restore();
  }

  drawSubDials() {
    const { ctx, centerX, centerY } = this;
    ctx.save();
    
    ctx.font = '900 11px Orbitron';
    ctx.fillStyle = '#a0aec0';
    ctx.textAlign = 'center';
    ctx.fillText('G-STEEL', centerX, centerY - 65);

    ctx.font = '600 8px Orbitron';
    ctx.fillStyle = '#e5a93b';
    const minText = (this.totalSeconds / 60).toFixed(this.totalSeconds % 60 === 0 ? 0 : 1);
    ctx.fillText(`IMMERSION TIMER (${minText} MIN)`, centerX, centerY - 52);

    ctx.restore();
  }

  drawHands() {
    const { ctx, centerX, centerY, radius } = this;
    const elapsedSeconds = this.totalSeconds - this.remainingSeconds;
    
    // 設定時間の割合に応じた分針の角度
    const minuteAngle = (elapsedSeconds / this.totalSeconds) * (Math.PI * 2) - (Math.PI / 2);
    const secondAngle = ((elapsedSeconds % 60) / 60) * (Math.PI * 2) - (Math.PI / 2);

    // 1. 分針
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(minuteAngle + Math.PI / 2);

    ctx.beginPath();
    ctx.moveTo(-6, 15);
    ctx.lineTo(-4, -radius + 60);
    ctx.lineTo(0, -radius + 45);
    ctx.lineTo(4, -radius + 60);
    ctx.lineTo(6, 15);
    ctx.closePath();

    ctx.fillStyle = '#e2e8f0';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1a202c';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius + 65);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#00f0ff';
    ctx.stroke();

    ctx.restore();

    // 2. 秒針
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(secondAngle + Math.PI / 2);

    ctx.beginPath();
    ctx.moveTo(-2, 25);
    ctx.lineTo(-1, -radius + 35);
    ctx.lineTo(1, -radius + 35);
    ctx.lineTo(2, 25);
    ctx.closePath();

    ctx.fillStyle = '#ff3b30';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 18, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ff3b30';
    ctx.fill();

    ctx.restore();
  }
}

window.GShockClock = GShockClock;
