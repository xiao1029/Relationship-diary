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

/** すべての記録を { key: {a,b,c,updatedAt} } の形で返す */
export function getAllEntries() {
  return readAll();
}

/** 指定した日付キーの記録を1件取得する。なければ null */
export function getEntry(key) {
  const all = readAll();
  return all[key] || null;
}

/** 指定した日付キーの記録を保存する。a/b/cが全部空なら削除する */
export function saveEntry(key, { a, b, c }) {
  const all = readAll();
  const isEmpty = !a?.trim() && !b?.trim() && !c?.trim();

  if (isEmpty) {
    delete all[key];
  } else {
    all[key] = { a, b, c, updatedAt: new Date().toISOString() };
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
