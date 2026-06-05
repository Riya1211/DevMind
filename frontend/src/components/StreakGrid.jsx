import React from "react";
import { useGetEntriesQuery, useGetStatsQuery } from "../store/api/entryAPI";

const activityColor = {
  0: "bg-[#1a1a24]", // no entry — dark
  1: "bg-[#22d3a330]", // light green
  2: "bg-[#22d3a360]", // medium green
  3: "bg-[#22d3a3]", // full green
};
// dummy data
//   const pattern = [
//     0, 0, 1, 0, 2, 3, 2,
//     3, 3, 1, 2, 3, 1, 0,
//     3, 3, 2, 1, 3, 3, 3,
//     0, 0, 0, 1, 2, 3, 2,
//   ];
const days = ["M", "T", "W", "T", "F", "S", "S"];

function StreakGrid() {
  const { data: entriesData } = useGetEntriesQuery();
  const { data: statsData } = useGetStatsQuery();

  const streak = statsData?.stats.currentStreak ?? 0;
  const entries = entriesData?.entries ?? [];

  // build pattern from real entries
  const buildPattern = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // get first day of month and how many days in month
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // count entries per date — { "2026-05-16": 3, "2026-05-15": 1 }
    const entryCountByDate = {};
    entries.forEach((entry) => {
      const date = new Date(entry.createdAt);
      // only count entries from current month
      if (date.getMonth() === month && date.getFullYear() === year) {
        const key = date.toDateString();
        entryCountByDate[key] = (entryCountByDate[key] || 0) + 1;
      }
    });

    // figure out what day of week month starts on (0=Sun, 1=Mon...)
    // we want Monday first so adjust
    let startDayOfWeek = firstDay.getDay(); // 0=Sun
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    // now 0=Mon, 6=Sun

    // build 28 or 35 cell grid
    const pattern = [];

    // empty cells before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      pattern.push(-1); // -1 = outside current month
    }

    // fill in each day
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const key = date.toDateString();
      const count = entryCountByDate[key] || 0;

      // convert count to activity level 0-3
      if (count === 0) pattern.push(0);
      else if (count === 1) pattern.push(1);
      else if (count === 2) pattern.push(2);
      else pattern.push(3);
    }

    // pad end to complete the grid to nearest 7
    while (pattern.length % 7 !== 0) {
      pattern.push(-1);
    }

    return pattern;
  };

  const pattern = buildPattern();

  return (
    <div className="bg-[#111118] rounded-lg border border-[#ffffff0f] p-4 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[0.75rem] font-bold font-heading">
          This month
        </span>
        <span className="text-[10px] font-body !text-[#22d3a3]">
          {streak} day streak 🔥
        </span>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {days.map((d, i) => (
          <div
            key={i}
            className="text-[8px] text-center !text-[#4a4a5a] font-body"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid — 28 boxes in 7 columns = 4 rows */}
      <div className="grid grid-cols-7 gap-1">
        {pattern.map((level, i) => (
          <div
            key={i}
            className={`aspect-square rounded-[3px] ${activityColor[level]}`}
          />
        ))}
      </div>
    </div>
  );
}

export default StreakGrid;
