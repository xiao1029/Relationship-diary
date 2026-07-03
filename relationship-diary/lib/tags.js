// タグ機能で使う共通の定義。
// 最初からある程度の候補があると、毎回文字入力しなくて済むので選びやすい。
export const PRESET_TAGS = [
  "LINE・連絡",
  "家事",
  "時間の使い方",
  "お金",
  "言葉づかい",
  "約束",
  "家族・親戚",
  "将来の話",
];

/** タグ文字列を正規化する（前後の空白除去、空文字は除外） */
export function normalizeTag(raw) {
  return raw.trim().replace(/\s+/g, " ");
}
