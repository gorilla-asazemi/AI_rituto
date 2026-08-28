/**
 * 『＠ゴリーダー元素』ジャングル美術館 JavaScript
 * Facebookライクなリアクション・フローティングドック＆アグリゲーション
 */

document.addEventListener('DOMContentLoaded', () => {
  initCardFlip();
  initFacebookReactions();
  initSpotlight();
  initFavoritesAndPagination();
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
 * ① カードの裏返し（3Dフリップ＆1.5倍拡大）＆排他制御＆「済」スタンプ記録
 */
function initCardFlip() {
  const cards = document.querySelectorAll('.art-card');
  let readCards = JSON.parse(localStorage.getItem('goleader_read_cards') || '[]');

  // 初期の「済」状態を反映
  cards.forEach(card => {
    const cardId = card.getAttribute('data-id');
    if (readCards.includes(cardId)) {
      card.classList.add('is-read');
    }
  });

  cards.forEach(card => {
    // カード全体クリックで裏返しをトグル
    card.addEventListener('click', (e) => {
      // リアクション関連UIやお気に入りボタン、リンクが押されたときは裏返さない
      if (
        e.target.closest('.fb-react-container') || 
        e.target.closest('.fb-reactions-dock') || 
        e.target.closest('.fb-main-btn') || 
        e.target.closest('.dock-item') || 
        e.target.closest('.fav-btn') || 
        e.target.closest('a')
      ) {
        return;
      }
      
      const isCurrentlyFlipped = card.classList.contains('flipped');

      // 別のカードをすべて表向き（元）に戻す
      cards.forEach(c => {
        if (c !== card) {
          c.classList.remove('flipped');
        }
      });

      if (!isCurrentlyFlipped) {
        // カードを裏返す（1.5倍拡大表示）
        card.classList.add('flipped');

        // 一度でも読んだカードとして「済」を記録
        const cardId = card.getAttribute('data-id');
        if (cardId && !readCards.includes(cardId)) {
          readCards.push(cardId);
          try {
            localStorage.setItem('goleader_read_cards', JSON.stringify(readCards));
          } catch (err) {
            console.warn('読了記録の保存に失敗:', err);
          }
        }
        card.classList.add('is-read');
      } else {
        // 既に裏返っている場合は元に戻す
        card.classList.remove('flipped');
      }
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

  // 画面の外（余白）をクリックしたときにも拡大裏面を閉じる
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.art-card')) {
      cards.forEach(c => c.classList.remove('flipped'));
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
  const userSelections = JSON.parse(localStorage.getItem('goleader_user_reactions_v3') || '{}');
  // 各カードのカウントデータ（リセット状態：すべて0）
  const initialCounts = {
    '001': { wakaru: 0, omoro: 0, majide: 0, sorena: 0, hee: 0, ahona: 0 },
    '002': { wakaru: 0, omoro: 0, majide: 0, sorena: 0, hee: 0, ahona: 0 },
    '003': { wakaru: 0, omoro: 0, majide: 0, sorena: 0, hee: 0, ahona: 0 },
    '004': { wakaru: 0, omoro: 0, majide: 0, sorena: 0, hee: 0, ahona: 0 },
    '005': { wakaru: 0, omoro: 0, majide: 0, sorena: 0, hee: 0, ahona: 0 },
    '006': { wakaru: 0, omoro: 0, majide: 0, sorena: 0, hee: 0, ahona: 0 },
    '007': { wakaru: 0, omoro: 0, majide: 0, sorena: 0, hee: 0, ahona: 0 },
    '008': { wakaru: 0, omoro: 0, majide: 0, sorena: 0, hee: 0, ahona: 0 }
  };

  const storedCounts = JSON.parse(localStorage.getItem('goleader_reaction_counts_v3') || JSON.stringify(initialCounts));

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
      storedCounts[cardId] = { wakaru: 0, omoro: 0, majide: 0, sorena: 0, hee: 0, ahona: 0 };
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

  // データ保存用ヘルパー
  function saveData(userSel, counts) {
    try {
      localStorage.setItem('goleader_user_reactions_v3', JSON.stringify(userSel));
      localStorage.setItem('goleader_reaction_counts_v3', JSON.stringify(counts));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }
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

/**
 * ④ お気に入り保存機能＆10件ごとのページネーション制御
 */
function initFavoritesAndPagination() {
  const ITEMS_PER_PAGE = 10;
  let currentPage = 1;
  let currentFilter = 'all'; // 'all' or 'favorites'

  const allCards = Array.from(document.querySelectorAll('.art-card'));
  const favBtns = document.querySelectorAll('.fav-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const countAllEl = document.getElementById('countAll');
  const countFavEl = document.getElementById('countFav');
  const countInfoEl = document.getElementById('galleryCountInfo');
  const paginationEl = document.getElementById('galleryPagination');
  const artGrid = document.getElementById('artGrid');

  // お気に入りIDリストの読み込み
  let favorites = JSON.parse(localStorage.getItem('goleader_favorites') || '[]');

  // 各カードのお気に入り状態を初期化
  function syncFavoriteButtons() {
    favBtns.forEach(btn => {
      const cardId = btn.getAttribute('data-card-id');
      const isFav = favorites.includes(cardId);
      const icon = btn.querySelector('i');
      if (isFav) {
        btn.classList.add('is-fav');
        if (icon) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
        }
        btn.setAttribute('title', 'お気に入りから解除');
      } else {
        btn.classList.remove('is-fav');
        if (icon) {
          icon.classList.remove('fa-solid');
          icon.classList.add('fa-regular');
        }
        btn.setAttribute('title', 'お気に入りに保存');
      }
    });

    // 件数バッジ更新
    if (countAllEl) countAllEl.textContent = String(allCards.length);
    if (countFavEl) countFavEl.textContent = String(favorites.length);
  }

  // お気に入りトグル処理
  favBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // フリップ防止
      const cardId = btn.getAttribute('data-card-id');
      const index = favorites.indexOf(cardId);

      if (index === -1) {
        favorites.push(cardId);
      } else {
        favorites.splice(index, 1);
      }

      localStorage.setItem('goleader_favorites', JSON.stringify(favorites));
      syncFavoriteButtons();
      renderGallery();
    });
  });

  // フィルター切り替え処理
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      currentPage = 1;
      renderGallery();
    });
  });

  // ギャラリー表示とページネーションのレンダリング
  function renderGallery() {
    // 1. フィルター適用
    const visibleCards = allCards.filter(card => {
      const cardId = card.getAttribute('data-id');
      if (currentFilter === 'favorites') {
        return favorites.includes(cardId);
      }
      return true;
    });

    const totalItems = visibleCards.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    // 2. 該当ページのアイテムを抽出
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // 空表示要素のチェックと削除
    const existingEmpty = artGrid.querySelector('.empty-favorites');
    if (existingEmpty) {
      existingEmpty.remove();
    }

    if (totalItems === 0) {
      allCards.forEach(card => card.style.display = 'none');
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'empty-favorites';
      emptyDiv.innerHTML = `
        <i class="fa-regular fa-star"></i>
        <h3>お気に入りの言霊はまだありません</h3>
        <p>作品カード右上の星マーク（☆）をタップすると、ここに保存されます。</p>
      `;
      artGrid.appendChild(emptyDiv);
      if (countInfoEl) countInfoEl.textContent = '0件';
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    // 全カードの表示・非表示を切り替え
    allCards.forEach(card => {
      card.style.display = 'none';
    });

    const pageCards = visibleCards.slice(startIndex, endIndex);
    pageCards.forEach(card => {
      card.style.display = 'flex';
    });

    // 3. 表示件数情報の更新
    if (countInfoEl) {
      const displayStart = startIndex + 1;
      const displayEnd = Math.min(endIndex, totalItems);
      countInfoEl.textContent = `${totalItems}作品中 ${displayStart}〜${displayEnd}件を表示`;
    }

    // 4. ページネーションボタンの生成
    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (!paginationEl) return;
    paginationEl.innerHTML = '';

    // 1ページのみの場合はページネーションボタンを非表示
    if (totalPages <= 1) {
      return;
    }

    // 前へボタン
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i> 前へ';
    prevBtn.disabled = (currentPage === 1);
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderGallery();
        scrollToGallery();
      }
    });
    paginationEl.appendChild(prevBtn);

    // 各ページ番号ボタン
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
      pageBtn.textContent = String(i);
      pageBtn.addEventListener('click', () => {
        currentPage = i;
        renderGallery();
        scrollToGallery();
      });
      paginationEl.appendChild(pageBtn);
    }

    // 次へボタン
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '次へ <i class="fa-solid fa-chevron-right"></i>';
    nextBtn.disabled = (currentPage === totalPages);
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderGallery();
        scrollToGallery();
      }
    });
    paginationEl.appendChild(nextBtn);
  }

  function scrollToGallery() {
    const gallery = document.querySelector('.gallery-container');
    if (gallery) {
      gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // 初回同期とレンダリング
  syncFavoriteButtons();
  renderGallery();
}
