"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { dateKey, getAllEntries } from "@/lib/storage";

const MONTH_NAMES = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
];
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export default function Calendar() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [entries, setEntries] = useState({});

  // localStorageの読み込みはブラウザ側でのみ行う
  useEffect(() => {
    setEntries(getAllEntries());
  }, []);

  // 他の画面から戻ってきた時に最新の記録状況を反映する
  useEffect(() => {
    function handleFocus() {
      setEntries(getAllEntries());
    }
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  function changeMonth(delta) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  }

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <>
      <header className="cal-header">
        <div className="eyebrow">RELATIONSHIP JOURNAL</div>
        <div className="month-row serif">
          <button
            className="nav-btn"
            onClick={() => changeMonth(-1)}
            aria-label="前の月"
          >
            ‹
          </button>
          <span>{viewYear}年 {MONTH_NAMES[viewMonth]}</span>
          <button
            className="nav-btn"
            onClick={() => changeMonth(1)}
            aria-label="次の月"
          >
            ›
          </button>
        </div>
      </header>

      <div className="cal-body">
        <div className="weekday-row">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>

        <div className="day-grid">
          {cells.map((d, i) => {
            if (d === null) {
              return <div key={`empty-${i}`} className="day-cell empty" />;
            }
            const key = dateKey(viewYear, viewMonth, d);
            const isToday =
              today.getFullYear() === viewYear &&
              today.getMonth() === viewMonth &&
              today.getDate() === d;
            const hasEntry = Boolean(entries[key]);

            return (
              <button
                key={key}
                className={`day-cell${isToday ? " today" : ""}`}
                onClick={() => router.push(`/day/${key}`)}
              >
                <span>{d}</span>
                {hasEntry && <span className="dot" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <p className="quiet-note">
          日付をタップすると、その日のページを開けます。記録がある日には印がつきます。
        </p>
      </div>

      <style jsx>{`
        .cal-header {
          background: var(--chrome-bg);
          color: var(--paper);
          padding: 20px 24px 28px;
        }
        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.18em;
          color: #a9a398;
          margin-bottom: 6px;
        }
        .month-row {
          font-size: 26px;
          font-weight: 700;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }
        .nav-btn {
          font-family: "Zen Kaku Gothic New", sans-serif;
          font-size: 20px;
          color: #a9a398;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 10px;
        }
        .cal-body {
          background: var(--paper);
          border-radius: 24px 24px 0 0;
          margin-top: -18px;
          padding: 22px 18px 40px;
          flex: 1;
        }
        .weekday-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          margin-bottom: 8px;
        }
        .weekday-row span {
          text-align: center;
          font-size: 11px;
          color: var(--ink-soft);
        }
        .day-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          row-gap: 6px;
        }
        .day-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          cursor: pointer;
          position: relative;
          font-size: 13px;
          color: var(--ink);
          background: none;
          border: none;
        }
        .day-cell:hover {
          background: var(--paper-2);
        }
        .day-cell.empty {
          visibility: hidden;
          cursor: default;
        }
        .day-cell.today {
          font-weight: 700;
        }
        .day-cell.today::after {
          content: "";
          position: absolute;
          bottom: 6px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--ink);
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-top: 3px;
          background: var(--insight);
        }
        .quiet-note {
          margin-top: 20px;
          padding: 16px;
          border: 1px dashed var(--line);
          border-radius: 14px;
          font-size: 12.5px;
          color: var(--ink-soft);
          line-height: 1.7;
        }
      `}</style>
    </>
  );
}
