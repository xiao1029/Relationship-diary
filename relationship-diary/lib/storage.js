// 記録データの読み書きを担当するモジュール。
// 今はブラウザの localStorage を使ってスマホ内だけに保存する。
// 将来クラウド同期やパートナー共有に対応するときは、
// この関数の中身を差し替えるだけで済むように、
// 呼び出し側からは「日付キーで get / set する」インターフェースだけを見せている。

const STORAGE_KEY = "relationship-diary:entries";

/**
 * "2026-07-03" のようなISO形式の日付キーを作る（月は0始まりで受け取る）
 */
export function dateKey(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export function keyFromDate(date) {
  return dateKey(date.getFullYear(), date.getMonth(), date.getDate());
}

function readAll() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("記録の読み込みに失敗しました", e);
    return {};
  }
}

function writeAll(data) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("記録の保存に失敗しました", e);
  }
}

/** すべての記録を { key: {a,b,c,tags,updatedAt} } の形で返す */
export function getAllEntries() {
  return readAll();
}

/** 指定した日付キーの記録を1件取得する。なければ null */
export function getEntry(key) {
  const all = readAll();
  return all[key] || null;
}

/** 指定した日付キーの記録を保存する。a/b/cが全部空なら削除する */
export function saveEntry(key, { a, b, c, tags = [] }) {
  const all = readAll();
  const isEmpty = !a?.trim() && !b?.trim() && !c?.trim();

  if (isEmpty) {
    delete all[key];
  } else {
    all[key] = { a, b, c, tags, updatedAt: new Date().toISOString() };
  }
  writeAll(all);
  return !isEmpty;
}

/** 指定した日付キーの記録を削除する */
export function deleteEntry(key) {
  const all = readAll();
  delete all[key];
  writeAll(all);
}

/**
 * 使われているタグを { タグ名: 件数 } の形で集計して返す。
 * 件数が多い順に並んだ [{ name, count }] の配列で返す。
 */
export function getTagCounts() {
  const all = readAll();
  const counts = {};
  for (const entry of Object.values(all)) {
    for (const tag of entry.tags || []) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ja"));
}

/**
 * 指定したタグが付いている記録を、日付の新しい順に返す。
 * [{ key, ...entry }] の配列。
 */
export function getEntriesByTag(tag) {
  const all = readAll();
  return Object.entries(all)
    .filter(([, entry]) => (entry.tags || []).includes(tag))
    .map(([key, entry]) => ({ key, ...entry }))
    .sort((x, y) => (x.key < y.key ? 1 : -1));
}
