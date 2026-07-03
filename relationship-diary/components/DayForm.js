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
    hint: "事実だけを、感情を混ぜずに書いてみましょう。（例：LINEを既読無視された）",
    placeholder: "何が起きましたか？",
    cls: "fact",
  },
  {
    id: "b",
    tag: "02・FEEL",
    title: "感じたこと",
    hint: "その時、頭に浮かんだ感情や考えをそのまま書き出します。",
    placeholder: "どう感じましたか？",
    cls: "feel",
  },
  {
    id: "c",
    tag: "03・INSIGHT",
    title: "気づいたこと",
    hint: "「感じたこと」を少し離れた視点で見直すと、何が見えてきますか？",
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
    <>
      <header className="day-header">
        <button className="back-btn" onClick={() => router.push("/")}>
          ‹ カレンダーに戻る
        </button>
        <div className="date-title serif">{formatDateTitle(dateKey)}</div>
        <div className="date-sub">
          {formatYear(dateKey)}年 ・ {formatWeekday(dateKey)}
        </div>
      </header>

      <div className="day-body">
        {loaded && (
          <div className="layer-track">
            {LAYERS.map((layer) => (
              <div className={`layer ${layer.cls}`} key={layer.id}>
                <div className="tag">{layer.tag}</div>
                <div className="title">{layer.title}</div>
                <p className="hint">{layer.hint}</p>
                <textarea
                  value={values[layer.id]}
                  placeholder={layer.placeholder}
                  onChange={(e) => handleChange(layer.id, e.target.value)}
                  rows={4}
                />
              </div>
            ))}
          </div>
        )}

        <div className="save-bar">
          <button className="save-btn" onClick={handleSave}>
            この日を保存する
          </button>
          {hasAnyContent && (
            <button className="delete-btn" onClick={handleDelete}>
              この日の記録を削除する
            </button>
          )}
          <div className="saved-flag" role="status">{savedFlag}</div>
        </div>
      </div>

      <style jsx>{`
        .day-header {
          background: var(--chrome-bg);
          color: var(--paper);
          padding: 20px 20px 22px;
        }
        .back-btn {
          background: none;
          border: none;
          color: #a9a398;
          font-size: 13px;
          cursor: pointer;
          padding: 0 0 12px 0;
        }
        .date-title {
          font-size: 24px;
          font-weight: 700;
        }
        .date-sub {
          font-size: 12px;
          color: #a9a398;
          margin-top: 2px;
        }
        .day-body {
          background: var(--paper);
          border-radius: 24px 24px 0 0;
          margin-top: -14px;
          padding: 24px 20px 40px;
          flex: 1;
          position: relative;
        }
        .layer-track {
          position: relative;
          padding-left: 22px;
        }
        .layer-track::before {
          content: "";
          position: absolute;
          left: 8px;
          top: 10px;
          bottom: 10px;
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
          margin-bottom: 22px;
          background: #fff;
          border-radius: 16px;
          padding: 16px 16px 14px;
          box-shadow: 0 2px 10px rgba(43, 42, 40, 0.05);
        }
        .layer::before {
          content: "";
          position: absolute;
          left: -22px;
          top: 20px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--dot);
          box-shadow: 0 0 0 4px var(--paper);
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
        .tag {
          font-size: 11px;
          letter-spacing: 0.08em;
          font-weight: 700;
          margin-bottom: 2px;
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
          font-size: 15px;
          font-weight: 700;
          margin: 2px 0 3px;
        }
        .hint {
          font-size: 11.5px;
          color: var(--ink-soft);
          margin: 0 0 10px;
          line-height: 1.5;
        }
        textarea {
          width: 100%;
          min-height: 78px;
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--ink);
          background: var(--paper);
          resize: vertical;
        }
        textarea:focus {
          outline: none;
          border-color: var(--dot);
          background: #fff;
        }
        .save-bar {
          position: sticky;
          bottom: 0;
          background: linear-gradient(to top, var(--paper) 65%, rgba(247, 243, 234, 0));
          padding: 18px 4px 4px;
        }
        .save-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 14px;
          background: var(--chrome-bg);
          color: var(--paper);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
        }
        .save-btn:active {
          opacity: 0.85;
        }
        .delete-btn {
          width: 100%;
          padding: 10px;
          border: none;
          background: none;
          color: var(--ink-soft);
          font-size: 12px;
          margin-top: 10px;
          cursor: pointer;
          text-decoration: underline;
        }
        .saved-flag {
          text-align: center;
          font-size: 11.5px;
          color: var(--insight);
          margin-top: 8px;
          height: 14px;
        }
      `}</style>
    </>
  );
}
