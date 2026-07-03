"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEntry, saveEntry, deleteEntry } from "@/lib/storage";
import { formatDateTitle, formatWeekday, formatYear } from "@/lib/dates";
import { PRESET_TAGS, normalizeTag } from "@/lib/tags";

const LAYERS = [
  {
    id: "a",
    code: "01・FACT",
    title: "起きた出来事",
    hint: "感情を交えず、事実だけを書きましょう",
    placeholder: "何が起きましたか？（例：LINEを既読無視された）",
    cls: "fact",
  },
  {
    id: "b",
    code: "02・FEEL",
    title: "感じたこと",
    hint: "浮かんだ感情や考えをそのまま書き出します",
    placeholder: "どう感じましたか？",
    cls: "feel",
  },
  {
    id: "c",
    code: "03・INSIGHT",
    title: "気づいたこと",
    hint: "少し離れた視点で見直すと、何が見えますか？",
    placeholder: "分析してみて、気づいたことは？",
    cls: "insight",
  },
];

export default function DayForm({ dateKey }) {
  const router = useRouter();
  const [values, setValues] = useState({ a: "", b: "", c: "" });
  const [tags, setTags] = useState([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [savedFlag, setSavedFlag] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const existing = getEntry(dateKey);
    if (existing) {
      setValues({ a: existing.a || "", b: existing.b || "", c: existing.c || "" });
      setTags(existing.tags || []);
    }
    setLoaded(true);
  }, [dateKey]);

  function handleChange(id, text) {
    setValues((prev) => ({ ...prev, [id]: text }));
  }

  function toggleTag(name) {
    setTags((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  }

  function handleAddCustomTag() {
    const cleaned = normalizeTag(tagInput);
    if (cleaned && !tags.includes(cleaned)) {
      setTags((prev) => [...prev, cleaned]);
    }
    setTagInput("");
    setShowTagInput(false);
  }

  function handleSave() {
    saveEntry(dateKey, { ...values, tags });
    setSavedFlag("保存しました");
    setTimeout(() => setSavedFlag(""), 1800);
  }

  function handleDelete() {
    deleteEntry(dateKey);
    router.push("/");
  }

  const hasAnyContent = values.a || values.b || values.c;
  // すでに選ばれているタグも一覧の先頭に出す（プリセットに無い自作タグも見えるように）
  const chipList = [...new Set([...tags, ...PRESET_TAGS])];

  return (
    <div className="day-screen">
      <header className="day-header">
        <button className="back-btn" onClick={() => router.push("/")}>
          ‹ カレンダーに戻る
        </button>
        <div className="header-row">
          <div className="date-title serif">{formatDateTitle(dateKey)}</div>
          <div className="date-sub">
            {formatYear(dateKey)}年 ・ {formatWeekday(dateKey)}
          </div>
        </div>

        <div className="tag-row">
          {chipList.map((name) => (
            <button
              key={name}
              className={`chip${tags.includes(name) ? " chip-on" : ""}`}
              onClick={() => toggleTag(name)}
              type="button"
            >
              {name}
            </button>
          ))}

          {showTagInput ? (
            <input
              className="tag-input"
              autoFocus
              value={tagInput}
              placeholder="タグ名"
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustomTag()}
              onBlur={handleAddCustomTag}
            />
          ) : (
            <button
              className="chip chip-add"
              onClick={() => setShowTagInput(true)}
              type="button"
            >
              ＋タグ
            </button>
          )}
        </div>
      </header>

      <div className="day-body">
        {loaded && (
          <div className="layer-track">
            {LAYERS.map((layer) => (
              <div className={`layer ${layer.cls}`} key={layer.id}>
                <div className="layer-head">
                  <span className="code">{layer.code}</span>
                  <span className="title">{layer.title}</span>
                </div>
                <p className="hint">{layer.hint}</p>
                <textarea
                  value={values[layer.id]}
                  placeholder={layer.placeholder}
                  onChange={(e) => handleChange(layer.id, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="save-bar">
          <button className="save-btn" onClick={handleSave}>
            この日を保存する
          </button>
          <div className="bottom-row">
            {hasAnyContent ? (
              <button className="delete-btn" onClick={handleDelete}>
                この日の記録を削除する
              </button>
            ) : (
              <span />
            )}
            <span className="saved-flag" role="status">{savedFlag}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .day-screen {
          display: flex;
          flex-direction: column;
          height: 100dvh;
        }
        .day-header {
          background: var(--chrome-bg);
          color: var(--paper);
          flex: 0 0 auto;
          /* iPhoneのステータスバー（ノッチ/Dynamic Island）と被らないよう、
             セーフエリア分の余白を必ず確保する（最低36pxは保証） */
          padding-top: max(env(safe-area-inset-top), 20px);
          padding-bottom: 10px;
        }
        .back-btn {
          display: block;
          background: none;
          border: none;
          color: #a9a398;
          font-size: 13px;
          cursor: pointer;
          padding: 14px 20px 8px;
          margin: 0;
          min-height: 44px;
          text-align: left;
          width: 100%;
        }
        .header-row {
          padding: 0 20px;
        }
        .date-title {
          font-size: 21px;
          font-weight: 700;
          line-height: 1.1;
        }
        .date-sub {
          font-size: 11.5px;
          color: #a9a398;
          margin-top: 2px;
        }
        .tag-row {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 10px 20px 2px;
          scrollbar-width: none;
        }
        .tag-row::-webkit-scrollbar {
          display: none;
        }
        .chip {
          flex: 0 0 auto;
          font-family: "Zen Kaku Gothic New", sans-serif;
          font-size: 11px;
          padding: 6px 11px;
          border-radius: 999px;
          border: 1px solid rgba(247, 243, 234, 0.28);
          background: transparent;
          color: #c9c4b8;
          cursor: pointer;
          white-space: nowrap;
        }
        .chip-on {
          background: var(--insight);
          border-color: var(--insight);
          color: #fff;
          font-weight: 700;
        }
        .chip-add {
          border-style: dashed;
          color: #a9a398;
        }
        .tag-input {
          flex: 0 0 auto;
          width: 96px;
          font-size: 11px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid var(--insight);
          background: #fff;
          color: var(--ink);
        }
        .tag-input:focus {
          outline: none;
        }
        .day-body {
          background: var(--paper);
          border-radius: 20px 20px 0 0;
          margin-top: -10px;
          padding: 14px 16px 10px;
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
        }
        .layer-track {
          position: relative;
          padding-left: 16px;
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 7px;
          min-height: 0;
        }
        .layer-track::before {
          content: "";
          position: absolute;
          left: 5px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: linear-gradient(
            to bottom,
            var(--fact),
            var(--feel),
            var(--insight)
          );
          border-radius: 2px;
        }
        .layer {
          position: relative;
          background: #fff;
          border-radius: 12px;
          padding: 7px 10px;
          box-shadow: 0 2px 8px rgba(43, 42, 40, 0.05);
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .layer::before {
          content: "";
          position: absolute;
          left: -16px;
          top: 12px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--dot);
          box-shadow: 0 0 0 3px var(--paper);
        }
        .layer.fact {
          --dot: var(--fact);
          border-left: 3px solid var(--fact);
        }
        .layer.feel {
          --dot: var(--feel);
          border-left: 3px solid var(--feel);
        }
        .layer.insight {
          --dot: var(--insight);
          border-left: 3px solid var(--insight);
        }
        .layer-head {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }
        .code {
          font-size: 10px;
          letter-spacing: 0.06em;
          font-weight: 700;
        }
        .layer.fact .code {
          color: var(--fact);
        }
        .layer.feel .code {
          color: var(--feel);
        }
        .layer.insight .code {
          color: var(--insight);
        }
        .title {
          font-size: 13.5px;
          font-weight: 700;
        }
        .hint {
          font-size: 10.5px;
          color: var(--ink-soft);
          margin: 1px 0 4px;
          line-height: 1.3;
        }
        textarea {
          width: 100%;
          flex: 1 1 auto;
          min-height: 0;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 13px;
          line-height: 1.5;
          color: var(--ink);
          background: var(--paper);
          resize: none;
        }
        textarea:focus {
          outline: none;
          border-color: var(--dot);
          background: #fff;
        }
        .save-bar {
          flex: 0 0 auto;
          padding-top: 8px;
        }
        .save-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 12px;
          background: var(--chrome-bg);
          color: var(--paper);
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
        }
        .save-btn:active {
          opacity: 0.85;
        }
        .bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 20px;
          margin-top: 4px;
        }
        .delete-btn {
          border: none;
          background: none;
          color: var(--ink-soft);
          font-size: 11px;
          padding: 4px 0;
          cursor: pointer;
          text-decoration: underline;
        }
        .saved-flag {
          font-size: 11px;
          color: var(--insight);
          margin-left: auto;
        }
      `}</style>
    </div>
  );
}
