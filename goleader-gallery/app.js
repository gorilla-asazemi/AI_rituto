/**
 * 『＠ゴリーダー元素』ジャングル美術館 JavaScript
 * Facebookライクなリアクション・フローティングドック＆アグリゲーション
 */

document.addEventListener('DOMContentLoaded', () => {
  initCardFlip();
  initFacebookReactions();
  initSpotlight();
});

/**
 * ③ 美術館のインタラクティブ・スポットライト（カーソル追従）
 */
function initSpotlight() {
  const cards = document.querySelectorAll('.art-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * ① カードの裏返し（3Dフリップ）制御
 */
function initCardFlip() {
  const cards = document.querySelectorAll('.art-card');

  cards.forEach(card => {
    // カード全体クリックで裏返しをトグル
    card.addEventListener('click', (e) => {
      // リアクション関連UIやリンクが押されたときは裏返さない
      if (
        e.target.closest('.fb-react-container') || 
        e.target.closest('.fb-reactions-dock') || 
        e.target.closest('.fb-main-btn') || 
        e.target.closest('.dock-item') || 
        e.target.closest('a')
      ) {
        return;
      }
      
      card.classList.toggle('flipped');
    });

    // 裏面の戻るボタン
    const closeBtn = card.querySelector('.back-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.remove('flipped');
      });
    }
  });
}

/**
 * ② Facebook完全再現リアクション機能
 * - ホバー/長押しでフローティングドック表示
 * - 絵文字のホバー拡大＆ツールチップ
 * - 選択時のメインボタン変化＆カウント/アイコンスタック更新
 * - 舞い上がるフローティング絵文字アニメーション
 */
function initFacebookReactions() {
  // 保存されたリアクション状態を復元（カードごとの選択状態）
  const userSelections = JSON.parse(localStorage.getItem('goleader_user_reactions') || '{}');
  // 各カードのカウントデータ（なければ初期データ）
  const initialCounts = {
    '001': { wakaru: 18, omoro: 7, majide: 3, sorena: 12, hee: 2, ahona: 4 },
    '002': { wakaru: 31, omoro: 9, majide: 5, sorena: 45, hee: 4, ahona: 8 },
    '003': { wakaru: 24, omoro: 6, majide: 2, sorena: 38, hee: 8, ahona: 3 }
  };

  const storedCounts = JSON.parse(localStorage.getItem('goleader_reaction_counts') || JSON.stringify(initialCounts));

  const containers = document.querySelectorAll('.fb-react-container');

  containers.forEach(container => {
    const card = container.closest('.art-card');
    if (!card) return;
    const cardId = container.getAttribute('data-card-id');
    const mainBtn = container.querySelector('.fb-main-btn');
    const mainEmoji = mainBtn.querySelector('.main-btn-emoji');
    const mainText = mainBtn.querySelector('.main-btn-text');
    const dock = container.querySelector('.fb-reactions-dock');
    const dockItems = container.querySelectorAll('.dock-item');

    // 初期カウントのセット
    if (!storedCounts[cardId]) {
      storedCounts[cardId] = { wakaru: 10, omoro: 5, majide: 2, sorena: 8, hee: 3, ahona: 1 };
    }

    // 保存されているユーザーのリアクションがあれば反映
    const currentReaction = userSelections[cardId];
    if (currentReaction) {
      applySelectedState(mainBtn, mainEmoji, mainText, currentReaction);
    }

    // サマリーバー（アイコンスタックと合計数）を更新
    updateFacebookSummary(card, storedCounts[cardId]);

    // メインボタンを直接クリックした時の処理（デフォルト 👍 わかるわ～ をトグル）
    mainBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      const activeType = userSelections[cardId];

      if (activeType) {
        // 取り消し
        storedCounts[cardId][activeType] = Math.max(0, storedCounts[cardId][activeType] - 1);
        delete userSelections[cardId];
        resetMainBtn(mainBtn, mainEmoji, mainText);
      } else {
        // デフォルトの「わかるわ～」をセット
        const defaultType = 'wakaru';
        const defaultEmoji = '👍';
        const defaultLabel = 'わかるわ～';
        storedCounts[cardId][defaultType] += 1;
        userSelections[cardId] = { type: defaultType, emoji: defaultEmoji, label: defaultLabel };
        applySelectedState(mainBtn, mainEmoji, mainText, userSelections[cardId]);
        spawnFloatingEmoji(mainBtn, defaultEmoji, card);
      }

      saveData(userSelections, storedCounts);
      updateFacebookSummary(card, storedCounts[cardId], true);
    });

    // ドック内の各絵文字をクリックした時の処理
    dockItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();

        const type = item.getAttribute('data-type');
        const emoji = item.getAttribute('data-emoji');
        const label = item.getAttribute('data-label');
        const prevType = userSelections[cardId] ? userSelections[cardId].type : null;

        if (prevType === type) {
          // 同じものをもう一度選んだら取り消し
          storedCounts[cardId][type] = Math.max(0, storedCounts[cardId][type] - 1);
          delete userSelections[cardId];
          resetMainBtn(mainBtn, mainEmoji, mainText);
        } else {
          // 前のがあれば減らす
          if (prevType) {
            storedCounts[cardId][prevType] = Math.max(0, storedCounts[cardId][prevType] - 1);
          }
          // 新しいものを増やす
          storedCounts[cardId][type] += 1;
          userSelections[cardId] = { type, emoji, label };
          applySelectedState(mainBtn, mainEmoji, mainText, userSelections[cardId]);
          spawnFloatingEmoji(item, emoji, card);
        }

        // スマホなどのタッチ時用にドックを閉じるクラスを解除
        container.classList.remove('dock-open');

        saveData(userSelections, storedCounts);
        updateFacebookSummary(card, storedCounts[cardId], true);
      });
    });

    // モバイル・タッチサポート（長押しまたはタップでドックの開閉）
    let pressTimer;
    mainBtn.addEventListener('touchstart', () => {
      pressTimer = setTimeout(() => {
        container.classList.add('dock-open');
      }, 350);
    }, { passive: true });

    mainBtn.addEventListener('touchend', () => {
      clearTimeout(pressTimer);
    }, { passive: true });
  });
}

/**
 * 選択状態のUI反映
 */
function applySelectedState(btn, emojiEl, textEl, data) {
  btn.className = `fb-main-btn active ${data.type}`;
  emojiEl.textContent = data.emoji;
  textEl.textContent = data.label;
}

/**
 * 未選択（デフォルト）状態へのリセット
 */
function resetMainBtn(btn, emojiEl, textEl) {
  btn.className = 'fb-main-btn';
  emojiEl.textContent = '👍';
  textEl.textContent = 'いいね（共感）';
}

/**
 * サマリー行（アイコンスタックと合計数）の更新
 */
function updateFacebookSummary(card, countObj, triggerPop = false) {
  const cardId = card.getAttribute('data-id');
  const totalEl = card.querySelector(`#total-count-${cardId}`);
  const stackEl = card.querySelector(`#stack-${cardId}`);

  const emojiMap = {
    wakaru: { emoji: '👍', bg: '#1877f2', label: 'わかるわ～' },
    sorena: { emoji: '🎯', bg: '#e52d27', label: 'それな' },
    omoro: { emoji: '😆', bg: '#f7b125', label: 'おもろ' },
    majide: { emoji: '😲', bg: '#f7b125', label: 'マジで' },
    hee: { emoji: '💡', bg: '#10b981', label: 'へぇ～' },
    ahona: { emoji: '🤣', bg: '#f97316', label: 'んなアホな' }
  };

  let total = 0;
  const activeList = [];

  for (const [key, cnt] of Object.entries(countObj)) {
    total += cnt;
    if (cnt > 0 && emojiMap[key]) {
      activeList.push({ ...emojiMap[key], count: cnt });
    }
  }

  // 合計数の更新
  if (totalEl) {
    totalEl.textContent = String(total);
    if (triggerPop) {
      totalEl.classList.remove('popped');
      void totalEl.offsetWidth;
      totalEl.classList.add('popped');
    }
  }

  // アイコンスタックの更新（上位3つの絵文字を重ねて表示）
  if (stackEl) {
    activeList.sort((a, b) => b.count - a.count);
    const topThree = activeList.slice(0, 3);

    stackEl.innerHTML = '';
    topThree.forEach((item, idx) => {
      const span = document.createElement('span');
      span.className = 'fb-mini-icon';
      span.style.background = item.bg;
      span.style.color = '#ffffff';
      span.title = `${item.label} (${item.count}件)`;
      span.textContent = item.emoji;
      span.style.zIndex = String(5 - idx);
      stackEl.appendChild(span);
    });

    if (topThree.length === 0) {
      const defaultSpan = document.createElement('span');
      defaultSpan.className = 'fb-mini-icon';
      defaultSpan.style.background = '#1877f2';
      defaultSpan.style.color = '#ffffff';
      defaultSpan.textContent = '👍';
      stackEl.appendChild(defaultSpan);
    }
  }
}

/**
 * フローティング絵文字マイクロアニメーション
 */
function spawnFloatingEmoji(targetEl, emoji, card) {
  const backFrame = card.querySelector('.back-frame') || card;
  const targetRect = targetEl.getBoundingClientRect();
  const frameRect = backFrame.getBoundingClientRect();

  const bubble = document.createElement('div');
  bubble.className = 'floating-emoji';
  bubble.textContent = emoji;

  const left = (targetRect.left + targetRect.width / 2) - frameRect.left;
  const top = targetRect.top - frameRect.top;

  bubble.style.left = `${left}px`;
  bubble.style.top = `${top}px`;

  const randomX = (Math.random() - 0.5) * 50;
  bubble.style.setProperty('--random-x', `${randomX}px`);

  backFrame.appendChild(bubble);

  bubble.addEventListener('animationend', () => {
    bubble.remove();
  });
}

/**
 * LocalStorageへの保存
 */
function saveData(userSelections, storedCounts) {
  try {
    localStorage.setItem('goleader_user_reactions', JSON.stringify(userSelections));
    localStorage.setItem('goleader_reaction_counts', JSON.stringify(storedCounts));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}
