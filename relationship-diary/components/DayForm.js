"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEntry, saveEntry, deleteEntry } from "@/lib/storage";
import { formatDateTitle, formatWeekday, formatYear } from "@/lib/dates";

const LAYERS = [
  {
    id: "a",
    tag: "01・FACT",
    title: "起きた出来事",
    hint: "感情を交えず、事実だけを書きましょう",
    placeholder: "何が起きましたか？（例：LINEを既読無視された）",
    cls: "fact",
  },
  {
    id: "b",
    tag: "02・FEEL",
    title: "感じたこと",
    hint: "浮かんだ感情や考えをそのまま書き出します",
    placeholder: "どう感じましたか？",
    cls: "feel",
  },
  {
    id: "c",
    tag: "03・INSIGHT",
    title: "気づいたこと",
    hint: "少し離れた視点で見直すと、何が見えますか？",
    placeholder: "分析してみて、気づいたことは？",
    cls: "insight",
  },
];

export default function DayForm({ dateKey }) {
  const router = useRouter();
  const [values, setValues] = useState({ a: "", b: "", c: "" });
  const [savedFlag, setSavedFlag] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const existing = getEntry(dateKey);
    if (existing) {
      setValues({ a: existing.a || "", b: existing.b || "", c: existing.c || "" });
    }
    setLoaded(true);
  }, [dateKey]);

  function handleChange(id, text) {
    setValues((prev) => ({ ...prev, [id]: text }));
  }

  function handleSave() {
    saveEntry(dateKey, values);
    setSavedFlag("保存しました");
    setTimeout(() => setSavedFlag(""), 1800);
  }

  function handleDelete() {
    deleteEntry(dateKey);
    router.push("/");
  }

  const hasAnyContent = values.a || values.b || values.c;

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
      </header>

      <div className="day-body">
        {loaded && (
          <div className="layer-track">
            {LAYERS.map((layer) => (
              <div className={`layer ${layer.cls}`} key={layer.id}>
                <div className="layer-head">
                  <span className="tag">{layer.tag}</span>
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
          padding-bottom: 14px;
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
        .day-body {
          background: var(--paper);
          border-radius: 20px 20px 0 0;
          margin-top: -10px;
          padding: 16px 16px 10px;
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
          gap: 8px;
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
          padding: 8px 10px;
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
          top: 13px;
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
        .tag {
          font-size: 10px;
          letter-spacing: 0.06em;
          font-weight: 700;
        }
        .layer.fact .tag {
          color: var(--fact);
        }
        .layer.feel .tag {
          color: var(--feel);
        }
        .layer.insight .tag {
          color: var(--insight);
        }
        .title {
          font-size: 13.5px;
          font-weight: 700;
        }
        .hint {
          font-size: 10.5px;
          color: var(--ink-soft);
          margin: 1px 0 5px;
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
