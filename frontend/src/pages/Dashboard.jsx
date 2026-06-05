import React from "react";
import StatCard from "../components/StatCard.jsx";
import TopBar from "../components/TopBar.jsx";
import EntryList from "../components/EntryList.jsx";
import AIChat from "../components/AIChat.jsx";
import StreakGrid from "../components/StreakGrid.jsx";
import { useNavigate } from "react-router-dom";
import { useGetStatsQuery } from "../store/api/entryAPI.js";

function Dashboard() {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good morning ✦"
      : hour < 18
        ? "Good afternoon ✦"
        : "Good evening ✦";

  const { data } = useGetStatsQuery();
  const streak = data?.stats.currentStreak ?? 0;
  return (
    <div className="flex flex-col h-screen w-full">

      <TopBar
        title={greeting}
        subtitle={`${currentDate} · ${streak} day streak 🔥`}
        actions={
          <>
            <button className="flex items-center px-4 h-7 bg-transparent rounded-lg border border-[#ffffff18] font-heading font-bold text-[#6b6b80] text-[12px] tracking-tight cursor-pointer hover:bg-[#ffffff18] hover:text-white hover:border-[#ffffff18] transition-[background,color,border-color] duration-200">
              ⌕ Search
            </button>
            <button
              onClick={() => navigate("/write")}
              className="flex items-center px-4 h-7 bg-[#7c6dfa] text-white font-bold rounded-lg border border-[#ffffff18] font-heading text-[#6b6b80] text-[0.7rem] tracking-tighter hover:bg-[#a78bfa] cursor-pointer hover:-translate-y-px transition-[background,transform] duration-200"
            >
              ✦ New Entry
            </button>
          </>
        }
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        <StatCard />
        {/* tells flex to actually shrink/grow properly (without this, flex-1 can break) */}
        <div className="flex gap-2 pt-4 px-4 flex-1 min-h-0">
          <EntryList
            limit={4}
            showSearch={false}
            className="flex-1 rounded-b-none"
          />
          <div className="w-[340px] flex flex-col gap-3 min-h-0">
            <AIChat variant="compact" className="flex-1 min-h-0" />
            <StreakGrid />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
