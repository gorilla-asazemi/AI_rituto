/**
 * Web Speech API Voice Controller (Speech Recognition & Speech Synthesis)
 * 音声認識コマンド & 時間指定パース & ナレーション (完全例外安全ガード版)
 */

class VoiceController {
  constructor(onCommandCallback) {
    this.onCommand = onCommandCallback;
    this.recognition = null;
    this.synthesis = window.speechSynthesis || null;
    this.isListening = false;
    this.shouldAutoRestart = false; // 自動リスタートはデフォルトOFFで安全管理

    this.statusTextEl = document.getElementById('voice-state-text');
    this.statusBarEl = document.getElementById('voice-status-bar');

    this.initRecognition();
  }

  initRecognition() {
    try {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        if (this.statusTextEl) {
          this.statusTextEl.textContent = '音声機能: ボタン操作モード (標準対応)';
        }
        return;
      }

      this.recognition = new SpeechRec();
      this.recognition.lang = 'ja-JP';
      this.recognition.continuous = false; // エラー防止のため単発認識に設定
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateStatusUI(true, '音声認識: 待機中 («5分» «開始» «ストップ» 等)');
      };

      this.recognition.onerror = (e) => {
        console.warn('Speech Recognition notice:', e.error);
        this.isListening = false;
        this.updateStatusUI(false, '音声認識: ボタン操作受付中');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.shouldAutoRestart) {
          try { this.recognition.start(); } catch (err) {}
        } else {
          this.updateStatusUI(false, '音声認識: 停止中 (ボタン操作可能)');
        }
      };

      this.recognition.onresult = (event) => {
        const lastResultIdx = event.results.length - 1;
        const transcript = event.results[lastResultIdx][0].transcript.trim().toLowerCase();
        console.log('Voice heard:', transcript);

        this.processCommand(transcript);
      };
    } catch (err) {
      console.warn('Speech Recognition init skipped safely:', err);
    }
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.shouldAutoRestart = true;
      try { this.recognition.start(); } catch (e) {}
    }
  }

  stopListening() {
    this.shouldAutoRestart = false;
    if (this.recognition && this.isListening) {
      try { this.recognition.stop(); } catch (e) {}
    }
  }

  updateStatusUI(active, text) {
    if (!this.statusTextEl) return;
    this.statusTextEl.textContent = text;
    if (active) {
      if (this.statusBarEl) this.statusBarEl.classList.add('listening');
    } else {
      if (this.statusBarEl) this.statusBarEl.classList.remove('listening');
    }
  }

  // 時間指定および操作コマンドのパース
  processCommand(transcript) {
    const timeMatch = transcript.match(/(?:(\d+)\s*分)?\s*(?:(\d+)\s*秒)?/);
    if (timeMatch && (timeMatch[1] || timeMatch[2])) {
      if (transcript.includes('分') || transcript.includes('秒')) {
        const minutes = timeMatch[1] ? parseInt(timeMatch[1], 10) : 0;
        const seconds = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
        const totalSec = (minutes * 60) + seconds;

        if (totalSec > 0 && totalSec <= 10800) {
          if (this.onCommand) {
            this.onCommand({
              type: 'setTime',
              minutes,
              seconds,
              totalSeconds: totalSec,
              rawText: transcript
            });
            return;
          }
        }
      }
    }

    if (this.onCommand) {
      this.onCommand({
        type: 'control',
        rawText: transcript
      });
    }
  }

  speak(text, onEndCallback = null) {
    if (!this.synthesis) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      if (onEndCallback) {
        utterance.onend = onEndCallback;
      }

      this.synthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      if (onEndCallback) onEndCallback();
    }
  }

  parseBookInput(transcript) {
    let title = '';
    let author = '';
    let pageStart = null;
    let pageEnd = null;

    const pageMatch = transcript.match(/(\d+)\s*(?:ページ|p|P)?\s*(?:から|〜|~|-)\s*(\d+)\s*(?:ページ|p|P)?/);
    if (pageMatch) {
      pageStart = pageMatch[1];
      pageEnd = pageMatch[2];
    } else {
      const singlePageMatch = transcript.match(/(\d+)\s*(?:ページ|p|P)/);
      if (singlePageMatch) pageStart = singlePageMatch[1];
    }

    let cleanText = transcript.replace(/(\d+)\s*(?:ページ|p|P)?\s*(?:から|〜|~|-)\s*(\d+)\s*(?:ページ|p|P)?/g, '')
                              .replace(/まで|読んだ|本|です/g, '').trim();

    if (cleanText.includes('の')) {
      const parts = cleanText.split('の');
      author = parts[0].trim();
      title = parts.slice(1).join('の').trim();
    } else if (cleanText.includes(' ')) {
      const parts = cleanText.split(/\s+/);
      title = parts[0];
      author = parts.slice(1).join(' ');
    } else {
      title = cleanText;
    }

    return { title, author, pageStart, pageEnd };
  }
}

window.VoiceController = VoiceController;
