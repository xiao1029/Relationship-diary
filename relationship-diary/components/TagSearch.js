"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTagCounts, getEntriesByTag } from "@/lib/storage";
import { formatDateTitle, formatWeekday, formatYear } from "@/lib/dates";

export default function TagSearch() {
  const router = useRouter();
  const [tagCounts, setTagCounts] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setTagCounts(getTagCounts());
  }, []);

  useEffect(() => {
    if (activeTag) {
      setEntries(getEntriesByTag(activeTag));
    } else {
      setEntries([]);
    }
  }, [activeTag]);

  return (
    <div className="search-screen">
      <header className="search-header">
        <button className="back-btn" onClick={() => router.push("/")}>
          ‹ カレンダーに戻る
        </button>
        <div className="title-row serif">タグで探す</div>
      </header>

      <div className="search-body">
        {tagCounts.length === 0 ? (
          <p className="empty-note">
            まだタグの付いた記録がありません。日にちページで出来事にタグを付けると、ここから振り返れるようになります。
          </p>
        ) : (
          <>
            <div className="tag-list">
              {tagCounts.map(({ name, count }) => (
                <button
                  key={name}
                  className={`chip${activeTag === name ? " chip-on" : ""}`}
                  onClick={() => setActiveTag(activeTag === name ? null : name)}
                >
                  {name}
                  <span className="count">{count}</span>
                </button>
              ))}
            </div>

            {activeTag && (
              <div className="entry-list">
                {entries.map((entry) => (
                  <button
                    key={entry.key}
                    className="entry-card"
                    onClick={() => router.push(`/day/${entry.key}`)}
                  >
                    <div className="entry-date">
                      {formatYear(entry.key)}年{formatDateTitle(entry.key)}
                      <span className="entry-weekday">
                        {formatWeekday(entry.key)}
                      </span>
                    </div>
                    <div className="entry-snippet">
                      {entry.a || "（出来事の記載なし）"}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!activeTag && (
              <p className="quiet-note">
                タグをタップすると、その出来事があった日の記録が一覧で表示されます。
              </p>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .search-screen {
          display: flex;
          flex-direction: column;
          min-height: 100dvh;
        }
        .search-header {
          background: var(--chrome-bg);
          color: var(--paper);
          flex: 0 0 auto;
          padding-top: max(env(safe-area-inset-top), 20px);
          padding-bottom: 20px;
        }
        .back-btn {
          display: block;
          background: none;
          border: none;
          color: #a9a398;
          font-size: 13px;
          cursor: pointer;
          padding: 14px 20px 10px;
          margin: 0;
          min-height: 44px;
          text-align: left;
          width: 100%;
        }
        .title-row {
          padding: 0 20px;
          font-size: 24px;
          font-weight: 700;
        }
        .search-body {
          background: var(--paper);
          border-radius: 20px 20px 0 0;
          margin-top: -10px;
          padding: 20px 18px 40px;
          flex: 1 1 auto;
        }
        .empty-note,
        .quiet-note {
          font-size: 12.5px;
          color: var(--ink-soft);
          line-height: 1.7;
          padding: 16px;
          border: 1px dashed var(--line);
          border-radius: 14px;
        }
        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
        }
        .chip {
          font-family: "Zen Kaku Gothic New", sans-serif;
          font-size: 12.5px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: #fff;
          color: var(--ink);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .chip-on {
          background: var(--insight);
          border-color: var(--insight);
          color: #fff;
        }
        .count {
          font-size: 10.5px;
          opacity: 0.75;
        }
        .entry-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .entry-card {
          text-align: left;
          background: #fff;
          border: none;
          border-left: 3px solid var(--insight);
          border-radius: 12px;
          padding: 12px 14px;
          box-shadow: 0 2px 8px rgba(43, 42, 40, 0.05);
          cursor: pointer;
        }
        .entry-date {
          font-size: 12px;
          font-weight: 700;
          color: var(--ink);
          display: flex;
          gap: 8px;
          align-items: baseline;
        }
        .entry-weekday {
          font-size: 10.5px;
          font-weight: 400;
          color: var(--ink-soft);
        }
        .entry-snippet {
          margin-top: 4px;
          font-size: 12.5px;
          color: var(--ink-soft);
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  );
}
