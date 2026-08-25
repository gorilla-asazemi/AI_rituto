/**
 * LocalStorage Reading Log Data Manager
 * 読書ノートの保存、更新、年別・月別グループ化集計、ブックリスト抽出＆多目的な並べ替え(ソート)、検索、JSONエクスポート
 */

const STORAGE_KEY = 'gsteel_reading_logs_v1';

class ReadingStorage {
  // 全読書ノートの取得
  static getLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load reading logs from LocalStorage', e);
      return [];
    }
  }

  // 新しい読書ノートの追加
  static saveLog(logEntry) {
    const logs = this.getLogs();
    const now = new Date();
    const newEntry = {
      id: 'log_' + Date.now(),
      timestamp: now.toISOString(),
      dateStr: now.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      title: logEntry.title || '無題の書籍',
      author: logEntry.author || '不明',
      pageStart: logEntry.pageStart ? parseInt(logEntry.pageStart, 10) : null,
      pageEnd: logEntry.pageEnd ? parseInt(logEntry.pageEnd, 10) : null,
      memo: logEntry.memo || '',
      durationMinutes: logEntry.durationMinutes || 30
    };

    logs.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    return newEntry;
  }

  // 読書ノートの更新（編集）
  static updateLog(id, updatedEntry) {
    const logs = this.getLogs();
    const index = logs.findIndex(log => log.id === id);
    if (index !== -1) {
      logs[index] = {
        ...logs[index],
        title: updatedEntry.title || '無題の書籍',
        author: updatedEntry.author || '不明',
        pageStart: updatedEntry.pageStart ? parseInt(updatedEntry.pageStart, 10) : null,
        pageEnd: updatedEntry.pageEnd ? parseInt(updatedEntry.pageEnd, 10) : null,
        memo: updatedEntry.memo || ''
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      return logs[index];
    }
    return null;
  }

  // ノートの削除
  static deleteLog(id) {
    let logs = this.getLogs();
    logs = logs.filter(log => log.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    return logs;
  }

  // データが存在する年・年月の自動抽出
  static getAvailableYearsAndMonths() {
    const logs = this.getLogs();
    const yearsMap = new Map();
    const yearMonthsMap = new Map();

    logs.forEach(log => {
      const date = new Date(log.timestamp);
      if (isNaN(date.getTime())) return;

      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const ymKey = `${y}-${String(m).padStart(2, '0')}`;
      const ymLabel = `${y}年${String(m).padStart(2, '0')}月`;

      yearsMap.set(y, `${y}年`);
      yearMonthsMap.set(ymKey, { year: y, month: m, label: ymLabel, key: ymKey });
    });

    const years = Array.from(yearsMap.keys()).sort((a, b) => b - a);
    const yearMonths = Array.from(yearMonthsMap.values()).sort((a, b) => b.key.localeCompare(a.key));

    return { years, yearMonths };
  }

  // キーワード ＆ 期間フィルターによるログ抽出
  static searchLogs(keyword = '', filterKey = 'all') {
    let logs = this.getLogs();

    if (filterKey && filterKey !== 'all') {
      if (filterKey.startsWith('year_')) {
        const targetYear = parseInt(filterKey.replace('year_', ''), 10);
        logs = logs.filter(log => {
          const d = new Date(log.timestamp);
          return d.getFullYear() === targetYear;
        });
      } else if (filterKey.startsWith('ym_')) {
        const targetYM = filterKey.replace('ym_', '');
        logs = logs.filter(log => {
          const d = new Date(log.timestamp);
          const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          return ym === targetYM;
        });
      }
    }

    if (keyword && keyword.trim() !== '') {
      const term = keyword.toLowerCase().trim();
      logs = logs.filter(log => {
        return (
          (log.title && log.title.toLowerCase().includes(term)) ||
          (log.author && log.author.toLowerCase().includes(term)) ||
          (log.memo && log.memo.toLowerCase().includes(term)) ||
          (log.dateStr && log.dateStr.includes(term))
        );
      });
    }

    return logs;
  }

  // ブックリスト（書籍単位の集計 ＆ タイトル順/著者順/年月日順ソート）
  static getBookList(sortBy = 'date_desc', keyword = '', filterKey = 'all') {
    const filteredLogs = this.searchLogs(keyword, filterKey);
    const booksMap = new Map();

    filteredLogs.forEach(log => {
      const titleKey = (log.title || '無題の書籍').trim().toLowerCase();
      if (!booksMap.has(titleKey)) {
        booksMap.set(titleKey, {
          title: log.title || '無題の書籍',
          author: log.author || '不明',
          totalMinutes: 0,
          sessionCount: 0,
          latestTimestamp: log.timestamp,
          latestDateStr: log.dateStr,
          latestPage: log.pageEnd || log.pageStart || null,
          latestMemo: log.memo || '',
          logs: []
        });
      }

      const book = booksMap.get(titleKey);
      book.logs.push(log);
      book.totalMinutes += (log.durationMinutes || 30);
      book.sessionCount += 1;

      // より新しいタイムスタンプで更新
      if (new Date(log.timestamp) > new Date(book.latestTimestamp)) {
        book.latestTimestamp = log.timestamp;
        book.latestDateStr = log.dateStr;
        if (log.author && log.author !== '不明') book.author = log.author;
        if (log.pageEnd || log.pageStart) book.latestPage = log.pageEnd || log.pageStart;
        if (log.memo) book.latestMemo = log.memo;
      }
    });

    const bookList = Array.from(booksMap.values());

    // 並べ替え（ソート）ロジック
    bookList.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.latestTimestamp) - new Date(a.latestTimestamp);
      } else if (sortBy === 'date_asc') {
        return new Date(a.latestTimestamp) - new Date(b.latestTimestamp);
      } else if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title, 'ja-JP', { numeric: true, sensitivity: 'base' });
      } else if (sortBy === 'author_asc') {
        return a.author.localeCompare(b.author, 'ja-JP', { numeric: true, sensitivity: 'base' });
      }
      return 0;
    });

    return bookList;
  }

  // 年月ごとにグループ化したログ配列の生成
  static getGroupedLogs(keyword = '', filterKey = 'all') {
    const filteredLogs = this.searchLogs(keyword, filterKey);
    const groupsMap = new Map();

    filteredLogs.forEach(log => {
      const date = new Date(log.timestamp);
      const y = isNaN(date.getTime()) ? new Date().getFullYear() : date.getFullYear();
      const m = isNaN(date.getTime()) ? new Date().getMonth() + 1 : date.getMonth() + 1;
      const groupKey = `${y}年${String(m).padStart(2, '0')}月`;

      if (!groupsMap.has(groupKey)) {
        groupsMap.set(groupKey, {
          groupKey,
          year: y,
          month: m,
          logs: [],
          totalMinutes: 0,
          uniqueBooks: new Set()
        });
      }

      const group = groupsMap.get(groupKey);
      group.logs.push(log);
      const mins = log.durationMinutes || 30;
      group.totalMinutes += mins;
      if (log.title) group.uniqueBooks.add(log.title.trim().toLowerCase());
    });

    const groups = Array.from(groupsMap.values());
    groups.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    return groups;
  }

  // 選択された期間に応じた動的統計データの算出
  static getStatistics(filterKey = 'all') {
    const logs = this.searchLogs('', filterKey);
    let totalMinutes = 0;
    const uniqueBooks = new Set();

    logs.forEach(log => {
      const minutes = log.durationMinutes || 30;
      totalMinutes += minutes;
      if (log.title && log.title.trim() !== '') {
        uniqueBooks.add(log.title.trim().toLowerCase());
      }
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const allLogs = this.getLogs();
    let monthMinutes = 0;
    allLogs.forEach(log => {
      const d = new Date(log.timestamp);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        monthMinutes += log.durationMinutes || 30;
      }
    });

    return {
      periodHours: (totalMinutes / 60).toFixed(1),
      monthHours: (monthMinutes / 60).toFixed(1),
      totalSessions: logs.length,
      totalBooks: uniqueBooks.size
    };
  }

  // JSONデータのダウンロード（バックアップ）
  static exportJSON() {
    const logs = this.getLogs();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `reading_logs_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}

window.ReadingStorage = ReadingStorage;
