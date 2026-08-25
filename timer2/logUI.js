/**
 * Reading Log UI Rendering Module
 * 読書履歴のカードUI表示、ブックリスト（書籍一覧・タイトル順/著者順/年月日順並べ替え）、
 * 年月アーカイブアコーディオン、期間別動的統計、編集・削除、検索制御
 */

class ReadingLogUI {
  constructor(onEditCallback = null) {
    this.gridEl = document.getElementById('history-cards-grid');
    this.emptyMsgEl = document.getElementById('empty-history-msg');
    this.countEl = document.getElementById('history-count');
    this.historyHeaderTitle = document.getElementById('history-header-title');
    
    // 統計エレメント
    this.statPeriodLabel = document.getElementById('stat-period-label');
    this.statMonthHours = document.getElementById('stat-month-hours');
    this.statTotalHours = document.getElementById('stat-total-hours');
    this.statTotalSessions = document.getElementById('stat-total-sessions');
    this.statTotalBooks = document.getElementById('stat-total-books');

    this.searchInput = document.getElementById('search-input');
    this.btnClearSearch = document.getElementById('btn-clear-search');
    this.filterPeriodSelect = document.getElementById('filter-period-select');
    this.sortBooksSelect = document.getElementById('sort-books-select');

    // モード切り替えボタン
    this.btnViewTimeline = document.getElementById('btn-view-timeline');
    this.btnViewBooks = document.getElementById('btn-view-books');

    this.viewMode = 'timeline'; // 'timeline' or 'books'
    this.sortBy = 'date_desc';  // 'date_desc', 'date_asc', 'title_asc', 'author_asc'

    this.onEditCallback = onEditCallback;

    this.initEvents();
  }

  initEvents() {
    // 検索入力イベント
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.renderLogs(e.target.value);
      });
    }

    if (this.btnClearSearch) {
      this.btnClearSearch.addEventListener('click', () => {
        this.searchInput.value = '';
        this.renderLogs();
      });
    }

    // 期間切替セレクトボックス
    if (this.filterPeriodSelect) {
      this.filterPeriodSelect.addEventListener('change', () => {
        this.updateUI(this.searchInput ? this.searchInput.value : '');
      });
    }

    // ソート順セレクトボックス（タイトル順/著者順/年月日順）
    if (this.sortBooksSelect) {
      this.sortBooksSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderLogs(this.searchInput ? this.searchInput.value : '');
      });
    }

    // 表示モード切替（タイムライン ↔ ブックリスト）
    if (this.btnViewTimeline) {
      this.btnViewTimeline.addEventListener('click', () => {
        this.setViewMode('timeline');
      });
    }

    if (this.btnViewBooks) {
      this.btnViewBooks.addEventListener('click', () => {
        this.setViewMode('books');
      });
    }
  }

  setViewMode(mode) {
    this.viewMode = mode;
    if (mode === 'timeline') {
      if (this.btnViewTimeline) this.btnViewTimeline.classList.add('active');
      if (this.btnViewBooks) this.btnViewBooks.classList.remove('active');
      if (this.historyHeaderTitle) this.historyHeaderTitle.textContent = 'READING ARCHIVE LOG (読書履歴タイムライン)';
    } else {
      if (this.btnViewBooks) this.btnViewBooks.classList.add('active');
      if (this.btnViewTimeline) this.btnViewTimeline.classList.remove('active');
      if (this.historyHeaderTitle) this.historyHeaderTitle.textContent = 'BOOKLIST SHELF (登録書籍ブックリスト)';
    }
    this.renderLogs(this.searchInput ? this.searchInput.value : '');
  }

  setOnEditCallback(callback) {
    this.onEditCallback = callback;
  }

  // 期間選択ドロップダウンオプションの動的生成
  populatePeriodOptions() {
    if (!this.filterPeriodSelect) return;

    const currentSelected = this.filterPeriodSelect.value || 'all';
    const { years, yearMonths } = ReadingStorage.getAvailableYearsAndMonths();

    let html = '<option value="all">全期間 (All Time)</option>';

    if (years.length > 0) {
      html += '<optgroup label="── 年別アーカイブ ──">';
      years.forEach(y => {
        html += `<option value="year_${y}">📅 ${y}年 全体</option>`;
      });
      html += '</optgroup>';
    }

    if (yearMonths.length > 0) {
      html += '<optgroup label="── 月別アーカイブ ──">';
      yearMonths.forEach(ym => {
        html += `<option value="ym_${ym.key}">🗓️ ${ym.label}</option>`;
      });
      html += '</optgroup>';
    }

    this.filterPeriodSelect.innerHTML = html;
    this.filterPeriodSelect.value = currentSelected;
  }

  // UI全体（統計 + カードリスト）の更新
  updateUI(filterKeyword = '') {
    this.populatePeriodOptions();
    this.updateStats();
    this.renderLogs(filterKeyword);
  }

  // 統計データの表示更新
  updateStats() {
    const filterKey = this.filterPeriodSelect ? this.filterPeriodSelect.value : 'all';
    const stats = ReadingStorage.getStatistics(filterKey);

    if (this.statPeriodLabel) {
      if (filterKey === 'all') {
        this.statPeriodLabel.textContent = '全期間の読書時間';
      } else if (filterKey.startsWith('year_')) {
        const y = filterKey.replace('year_', '');
        this.statPeriodLabel.textContent = `${y}年の読書時間`;
      } else if (filterKey.startsWith('ym_')) {
        const ymParts = filterKey.replace('ym_', '').split('-');
        this.statPeriodLabel.textContent = `${ymParts[0]}年${ymParts[1]}月の読書時間`;
      }
    }

    this.statMonthHours.innerHTML = `${stats.periodHours} <span class="stat-unit">時間</span>`;
    this.statTotalHours.innerHTML = `${stats.totalHours} <span class="stat-unit">時間</span>`;
    this.statTotalSessions.innerHTML = `${stats.totalSessions} <span class="stat-unit">回</span>`;
    this.statTotalBooks.innerHTML = `${stats.totalBooks} <span class="stat-unit">冊</span>`;
  }

  // メインの描画分岐（タイムライン / ブックリスト）
  renderLogs(filterKeyword = '') {
    if (this.viewMode === 'books') {
      this.renderBookList(filterKeyword);
    } else {
      this.renderTimeline(filterKeyword);
    }
  }

  // 📚 ブックリスト（書籍別カード ＆ ソート表示）
  renderBookList(filterKeyword = '') {
    const filterKey = this.filterPeriodSelect ? this.filterPeriodSelect.value : 'all';
    const books = ReadingStorage.getBookList(this.sortBy, filterKeyword, filterKey);

    this.gridEl.innerHTML = '';
    this.countEl.textContent = `書籍数: 全 ${books.length} 冊`;

    if (books.length === 0) {
      this.emptyMsgEl.style.display = 'block';
      return;
    }

    this.emptyMsgEl.style.display = 'none';

    const booksContainer = document.createElement('div');
    booksContainer.className = 'book-list-grid';

    books.forEach(book => {
      const card = document.createElement('div');
      card.className = 'book-list-card';

      const totalHours = (book.totalMinutes / 60).toFixed(1);
      const pageInfo = book.latestPage ? `P.${book.latestPage}` : 'セッション記録';

      card.innerHTML = `
        <div class="book-card-header">
          <div class="book-card-cover-icon">📖</div>
          <div class="book-card-main">
            <div class="book-card-title">${this.escapeHTML(book.title)}</div>
            <div class="book-card-author">👤 ${this.escapeHTML(book.author)}</div>
          </div>
        </div>

        <div class="book-card-stats">
          <span class="book-stat-item">⏱ 通算: <strong>${totalHours}時間</strong></span>
          <span class="book-stat-item">🔄 記録数: <strong>${book.sessionCount}回</strong></span>
          <span class="book-stat-item">🔖 進行: <strong>${pageInfo}</strong></span>
        </div>

        ${book.latestMemo ? `<div class="log-card-memo">“${this.escapeHTML(book.latestMemo)}”</div>` : ''}

        <div class="book-card-footer">
          <span>🕒 最終読書: ${book.latestDateStr || ''}</span>
          <span class="book-action-link">この本の履歴を見る ➔</span>
        </div>
      `;

      // クリックでその本のタイムライン履歴へ即ジャンプ
      card.addEventListener('click', () => {
        if (this.searchInput) this.searchInput.value = book.title;
        this.setViewMode('timeline');
      });

      booksContainer.appendChild(card);
    });

    this.gridEl.appendChild(booksContainer);
  }

  // 📜 タイムライン履歴（年月アコーディオン表示）
  renderTimeline(filterKeyword = '') {
    const filterKey = this.filterPeriodSelect ? this.filterPeriodSelect.value : 'all';
    const groups = ReadingStorage.getGroupedLogs(filterKeyword, filterKey);
    
    this.gridEl.innerHTML = '';

    let totalCount = 0;
    groups.forEach(g => totalCount += g.logs.length);
    this.countEl.textContent = `表示: 全 ${totalCount} 件`;

    if (groups.length === 0) {
      this.emptyMsgEl.style.display = 'block';
      return;
    }

    this.emptyMsgEl.style.display = 'none';

    groups.forEach(group => {
      const groupContainer = document.createElement('div');
      groupContainer.className = 'log-group-container';

      const hours = (group.totalMinutes / 60).toFixed(1);
      const bookCount = group.uniqueBooks.size;

      const headerEl = document.createElement('div');
      headerEl.className = 'log-group-header';
      headerEl.innerHTML = `
        <div class="log-group-info">
          <span class="log-group-title">📁 ${group.groupKey}</span>
          <span class="log-group-badge">⏱ ${hours}時間 / 📚 ${bookCount}冊 / 記録 ${group.logs.length}件</span>
        </div>
        <span class="group-toggle-icon">▼</span>
      `;

      headerEl.addEventListener('click', () => {
        groupContainer.classList.toggle('collapsed');
      });

      const cardsGrid = document.createElement('div');
      cardsGrid.className = 'history-cards-grid';

      group.logs.forEach(log => {
        const card = document.createElement('div');
        card.className = 'log-card';

        const pageText = (log.pageStart || log.pageEnd)
          ? `📖 P.${log.pageStart || '?'} 〜 P.${log.pageEnd || '?'}`
          : `📖 読書セッション`;

        card.innerHTML = `
          <div class="log-card-actions">
            <button class="btn-edit-log" data-id="${log.id}" title="この記録を編集">✏️ 編集</button>
            <button class="btn-delete-log" data-id="${log.id}" title="この記録を削除">🗑</button>
          </div>
          <div class="log-card-header">
            <div class="log-card-title">${this.escapeHTML(log.title)}</div>
          </div>
          <div class="log-card-author">👤 ${this.escapeHTML(log.author || '著者不明')}</div>
          <div class="log-card-date">🕒 ${log.dateStr || ''}</div>
          <div class="log-card-pages">${pageText}</div>
          ${log.memo ? `<div class="log-card-memo">“${this.escapeHTML(log.memo)}”</div>` : ''}
        `;

        const btnEdit = card.querySelector('.btn-edit-log');
        btnEdit.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.onEditCallback) {
            this.onEditCallback(log);
          }
        });

        const btnDelete = card.querySelector('.btn-delete-log');
        btnDelete.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`『${log.title}』の記録を削除してもよろしいですか？`)) {
            ReadingStorage.deleteLog(log.id);
            this.updateUI(this.searchInput ? this.searchInput.value : '');
          }
        });

        cardsGrid.appendChild(card);
      });

      groupContainer.appendChild(headerEl);
      groupContainer.appendChild(cardsGrid);
      this.gridEl.appendChild(groupContainer);
    });
  }

  escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}

window.ReadingLogUI = ReadingLogUI;
