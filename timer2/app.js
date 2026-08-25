/**
 * Main Application Orchestrator (Dynamic Immersion & Voice Custom Timer Edition)
 * 可変タイマー（声/ボタン設定）、5分/10分自動インターバル切替、BGM & 読書ノート編集統合
 */

document.addEventListener('DOMContentLoaded', () => {
  const clock = new GShockClock('clock-canvas');
  let logUI = null;

  // ブラウザの音声自動再生制限(Autoplay Policy)を解除するためのユーザー操作リスナー
  const unlockAudio = async () => {
    if (audioEngine) {
      await audioEngine.init();
    }
  };
  window.addEventListener('click', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });

  // タイマー状態変数
  let totalSeconds = 1800; // 初期設定: 30分 (1800秒)
  let remainingSeconds = 1800;
  let timerInterval = null;
  let isRunning = false;
  let currentPhase = 1;

  // DOM要素の参照
  const digitalTimerEl = document.getElementById('digital-timer');
  const phaseIndicatorEl = document.getElementById('phase-indicator');
  const bgmIndicatorEl = document.getElementById('bgm-indicator');
  const phaseTimerTextEl = document.getElementById('phase-timer-text');
  const btnStart = document.getElementById('btn-start');
  const btnReset = document.getElementById('btn-reset');
  const motivationBanner = document.getElementById('motivation-banner');
  const bannerTitle = document.getElementById('banner-title');
  const bannerText = document.getElementById('banner-text');

  // 時間設定要素
  const btnPresets = document.querySelectorAll('.btn-preset');
  const inputCustomMin = document.getElementById('input-custom-min');
  const inputCustomSec = document.getElementById('input-custom-sec');
  const btnSetCustomTime = document.getElementById('btn-set-custom-time');

  // モーダル要素
  const recordModal = document.getElementById('record-modal');
  const recordForm = document.getElementById('record-form');
  const btnModalVoiceRec = document.getElementById('btn-modal-voice-rec');
  const btnModalSkip = document.getElementById('btn-modal-skip');
  const modalVoiceStatus = document.getElementById('modal-voice-status');
  const modalHeaderTitle = document.getElementById('modal-header-title');
  const modalHeaderBadge = document.getElementById('modal-header-badge');
  const modalVoicePrompt = document.getElementById('modal-voice-prompt');
  const inputEditLogId = document.getElementById('edit-log-id');

  // LogUI の初期化と編集コールバックの接続
  logUI = new ReadingLogUI((logToEdit) => {
    openRecordModal(logToEdit);
  });
  logUI.updateUI();

  // タブ切り替え
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audioEngine.playClickSound();
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');

      if (targetId === 'log-section') {
        logUI.updateUI();
      }
    });
  });

  // 音声コマンドコントローラー
  const voiceCtrl = new VoiceController((cmd) => {
    console.log('Voice Command Event:', cmd);

    // モーダルが開いている時の読書ノート音声入力
    if (recordModal.classList.contains('active')) {
      const parsed = voiceCtrl.parseBookInput(cmd.rawText);
      if (parsed.title) document.getElementById('book-title').value = parsed.title;
      if (parsed.author) document.getElementById('book-author').value = parsed.author;
      if (parsed.pageStart) document.getElementById('page-start').value = parsed.pageStart;
      if (parsed.pageEnd) document.getElementById('page-end').value = parsed.pageEnd;

      modalVoiceStatus.innerHTML = `✅ 音声入力認識: 「${cmd.rawText}」`;
      return;
    }

    // 1. 時間指定コマンドの処理 (例: 「5分」「15分30秒」)
    if (cmd.type === 'setTime') {
      setCustomTime(cmd.totalSeconds, true, cmd.minutes, cmd.seconds);
      return;
    }

    // 2. タイマー操作コマンドの処理 (「開始」「ストップ」「リセット」等)
    const text = cmd.rawText;
    if (text.includes('スタート') || text.includes('開始') || text.includes('はじめて') || text.includes('再開')) {
      if (!isRunning) startTimer();
    } else if (text.includes('ストップ') || text.includes('停止') || text.includes('一時停止') || text.includes('止めて')) {
      if (isRunning) pauseTimer();
    } else if (text.includes('リセット') || text.includes('終わり') || text.includes('おわり') || text.includes('終了')) {
      resetTimer();
    }
  });

  // カスタム時間セット関数
  function setCustomTime(newTotalSec, isVoice = false, voiceMin = 0, voiceSec = 0) {
    if (isRunning) pauseTimer();

    totalSeconds = newTotalSec;
    remainingSeconds = newTotalSec;
    currentPhase = 1;

    // プリセットボタンの表示更新
    btnPresets.forEach(b => {
      const m = parseInt(b.getAttribute('data-min'), 10);
      if (m * 60 === newTotalSec) b.classList.add('active');
      else b.classList.remove('active');
    });

    const m = Math.floor(newTotalSec / 60);
    const s = newTotalSec % 60;
    inputCustomMin.value = m;
    inputCustomSec.value = s;

    updateDisplay();

    const timeLabel = s > 0 ? `${m}分${s}秒` : `${m}分`;
    bannerTitle.textContent = `TIME SET: ${timeLabel}`;
    bannerText.textContent = `タイマー時間を「${timeLabel}」に設定しました。「開始」と話しかけるかSTARTボタンでスタートします。`;

    if (isVoice) {
      voiceCtrl.speak(`タイマー時間を${timeLabel}にセットしました。「開始」と言ってスタートできます。`);
    }
  }

  // プリセットボタンイベント
  btnPresets.forEach(btn => {
    btn.addEventListener('click', () => {
      audioEngine.playClickSound();
      const min = parseInt(btn.getAttribute('data-min'), 10);
      setCustomTime(min * 60);
    });
  });

  // カスタム時間手動入力イベント
  btnSetCustomTime.addEventListener('click', () => {
    audioEngine.playClickSound();
    const m = parseInt(inputCustomMin.value, 10) || 0;
    const s = parseInt(inputCustomSec.value, 10) || 0;
    const sec = (m * 60) + s;
    if (sec > 0) setCustomTime(sec);
  });

  // 初期画面表示
  updateDisplay();

  // タイマー動作制御
  async function startTimer() {
    if (isRunning) return;

    isRunning = true;

    // ボタン切り替え・カウントダウン開始を最優先実行
    btnStart.querySelector('.btn-label').textContent = 'PAUSE / 一時停止';
    btnStart.classList.add('active');

    // 効果音・BGM呼び出し
    try {
      if (audioEngine) {
        await audioEngine.playClickSound();
        await audioEngine.startBGM(currentPhase);
      }
    } catch (err) {
      console.warn('Audio start non-blocking error:', err);
    }

    timerInterval = setInterval(() => {
      remainingSeconds--;
      updateDisplay();

      checkPhaseTransition();

      if (remainingSeconds <= 0) {
        completeTimer();
      }
    }, 1000);
  }

  function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    audioEngine.playClickSound();
    clearInterval(timerInterval);

    btnStart.querySelector('.btn-label').textContent = 'START / 再開';
    btnStart.classList.remove('active');

    audioEngine.stopBGM();
  }

  function resetTimer() {
    audioEngine.playClickSound();
    pauseTimer();
    remainingSeconds = totalSeconds;
    currentPhase = 1;
    updateDisplay();

    bannerTitle.textContent = 'IMMERSION SYSTEM READY';
    bannerText.textContent = '声で「5分」「15分30秒」のように時間を設定してから「開始」と言うか、ボタンでスタートできます。';
    motivationBanner.classList.remove('highlight');
  }

  // 表示更新ロジック
  function updateDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    digitalTimerEl.textContent = timeStr;
    clock.setTime(remainingSeconds, totalSeconds);

    const intervalSec = totalSeconds <= 1500 ? 300 : 600;
    const intervalMinLabel = totalSeconds <= 1500 ? '5分' : '10分';

    const secondsInInterval = remainingSeconds % intervalSec;
    const nextMin = Math.floor(secondsInInterval / 60);
    const nextSec = secondsInInterval % 60;
    phaseTimerTextEl.textContent = `切替まで: ${String(nextMin).padStart(2, '0')}:${String(nextSec).padStart(2, '0')} (${intervalMinLabel}毎)`;
  }

  // BGM切り替え & 励ましボイス発生の判定
  function checkPhaseTransition() {
    const elapsed = totalSeconds - remainingSeconds;
    const intervalSec = totalSeconds <= 1500 ? 300 : 600;

    if (elapsed > 0 && elapsed % intervalSec === 0 && remainingSeconds > 0) {
      const intervalNum = elapsed / intervalSec;
      currentPhase = (intervalNum % 3) + 1;

      const elapsedMin = Math.floor(elapsed / 60);
      let bgmName = 'CAFÉ ACOUSTIC BGM';
      if (currentPhase === 2) bgmName = 'RAINY LO-FI JAZZ BGM';
      if (currentPhase === 3) bgmName = 'DEEP PIANO AMBIENT';

      let msg = '';
      if (intervalNum % 2 === 1) {
        msg = `いい感じ！${elapsedMin}分経過、読書の集中ゾーンに入ったよ。すばらしい没入です。`;
      } else {
        msg = `ワクワクするね！${elapsedMin}分経過、物語と知識の世界へ深く引き込まれています。`;
      }

      triggerPhaseChange(currentPhase, `PHASE ${currentPhase} : ZONE ${intervalNum}`, bgmName, msg);
    }
  }

  async function triggerPhaseChange(phaseNum, phaseTitle, bgmTitle, message) {
    await audioEngine.playPhaseSignal();
    await audioEngine.startBGM(phaseNum);

    phaseIndicatorEl.textContent = phaseTitle;
    bgmIndicatorEl.textContent = bgmTitle;

    bannerTitle.textContent = `IMMERSION STEP: ${phaseTitle}`;
    bannerText.textContent = message;
    motivationBanner.classList.add('highlight');

    voiceCtrl.speak(message);
  }

  // タイマー完了
  async function completeTimer() {
    pauseTimer();
    remainingSeconds = 0;
    updateDisplay();

    await audioEngine.playFinishBell();

    const elapsedMin = Math.round(totalSeconds / 60);
    bannerTitle.textContent = `${elapsedMin} MIN SESSION COMPLETE!`;
    bannerText.textContent = `お疲れ様でした！${elapsedMin}分間の集中読書タイムが完了しました。`;

    const promptMsg = `お疲れ様でした！${elapsedMin}分セッション達成です。今日読んだ本を記録しましょう。何の本を読みましたか？`;
    
    voiceCtrl.speak(promptMsg, () => {
      openRecordModal();
    });

    setTimeout(() => {
      openRecordModal();
    }, 1500);
  }

  // ノートモーダル（新規記録 / 編集 両対応）
  function openRecordModal(editLog = null) {
    recordForm.reset();

    if (editLog) {
      // 編集モード
      if (inputEditLogId) inputEditLogId.value = editLog.id;
      if (modalHeaderBadge) modalHeaderBadge.textContent = 'EDIT READING LOG';
      if (modalHeaderTitle) modalHeaderTitle.textContent = '✏️ 読書ノートの編集';
      if (modalVoicePrompt) modalVoicePrompt.textContent = '🎙 内容を直接編集するか、声で上書き修正できます';

      document.getElementById('book-title').value = editLog.title || '';
      document.getElementById('book-author').value = editLog.author || '';
      document.getElementById('page-start').value = editLog.pageStart || '';
      document.getElementById('page-end').value = editLog.pageEnd || '';
      document.getElementById('book-memo').value = editLog.memo || '';
    } else {
      // 新規作成モード
      if (inputEditLogId) inputEditLogId.value = '';
      if (modalHeaderBadge) modalHeaderBadge.textContent = 'SESSION COMPLETE!';
      if (modalHeaderTitle) modalHeaderTitle.textContent = '🎉 読書セッション達成！お疲れ様でした';
      if (modalVoicePrompt) modalVoicePrompt.textContent = '🎙 「今日読んだ本を記録しましょう。何の本を読みましたか？」';
    }

    modalVoiceStatus.innerHTML = '<span class="pulse-dot"></span> 声で「書名・著者・何ページから何ページ」を話してください';
    recordModal.classList.add('active');
    voiceCtrl.startListening();
  }

  function closeRecordModal() {
    recordModal.classList.remove('active');
  }

  btnStart.addEventListener('click', () => {
    if (isRunning) pauseTimer();
    else startTimer();
  });

  btnReset.addEventListener('click', resetTimer);

  btnModalVoiceRec.addEventListener('click', () => {
    modalVoiceStatus.innerHTML = '🎙 音声入力待ち...（「思考の整理学、外山滋比古、45ページから90ページ」のように話してください）';
    voiceCtrl.startListening();
  });

  btnModalSkip.addEventListener('click', closeRecordModal);

  // フォーム保存ハンドラー (新規作成 / 更新対応)
  recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    audioEngine.playClickSound();

    const editId = inputEditLogId ? inputEditLogId.value : '';
    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim();
    const pageStart = document.getElementById('page-start').value.trim();
    const pageEnd = document.getElementById('page-end').value.trim();
    const memo = document.getElementById('book-memo').value.trim();

    if (!title) {
      alert('書名を入力してください');
      return;
    }

    if (editId) {
      // 更新（編集）
      ReadingStorage.updateLog(editId, {
        title,
        author,
        pageStart,
        pageEnd,
        memo
      });
    } else {
      // 新規保存
      ReadingStorage.saveLog({
        title,
        author,
        pageStart,
        pageEnd,
        memo,
        durationMinutes: Math.round(totalSeconds / 60)
      });
    }

    closeRecordModal();
    logUI.updateUI();

    document.getElementById('tab-log').click();
  });

  const btnOpenAddModal = document.getElementById('btn-open-add-modal');
  if (btnOpenAddModal) {
    btnOpenAddModal.addEventListener('click', () => openRecordModal());
  }

  const btnExportJson = document.getElementById('btn-export-json');
  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      audioEngine.playClickSound();
      ReadingStorage.exportJSON();
    });
  }
});
