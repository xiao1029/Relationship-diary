const WEEKDAY_NAMES = [
  "日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日",
];

/** "2026-07-03" -> Date オブジェクト（ローカルタイムゾーン） */
export function parseDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** "2026-07-03" -> "7月3日" */
export function formatDateTitle(key) {
  const date = parseDateKey(key);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

/** "2026-07-03" -> "金曜日" */
export function formatWeekday(key) {
  const date = parseDateKey(key);
  return WEEKDAY_NAMES[date.getDay()];
}

/** "2026-07-03" -> "2026" */
export function formatYear(key) {
  return key.split("-")[0];
}

/** キー文字列が YYYY-MM-DD の形式として妥当かどうか */
export function isValidDateKey(key) {
  return /^\d{4}-\d{2}-\d{2}$/.test(key);
}
