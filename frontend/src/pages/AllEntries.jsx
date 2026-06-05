import React from "react";
import TopBar from "../components/TopBar";
import EntryList from "../components/EntryList";
import { useNavigate } from "react-router-dom";
import { useGetStatsQuery } from "../store/api/entryAPI";

function AllEntries() {
  const navigate = useNavigate();
    const { data } = useGetStatsQuery();
    const totalEntries = data?.stats.totalEntries ?? 0;
  return (
    <div className="flex flex-col h-screen w-full">
      {/* Top bar */}
      <TopBar
        title="All Entries"
        subtitle={`${totalEntries} entries · sorted by date`}
        actions={
          <>
            <button className="flex items-center px-4 h-7 bg-transparent rounded-lg border border-[#ffffff18] font-heading font-bold text-[#6b6b80] text-[12px] tracking-tight cursor-pointer hover:bg-[#ffffff18] hover:text-white hover:border-[#ffffff18] transition-[background,color,border-color] duration-200">
              Filter ▾
            </button>
            <button 
            onClick={() => navigate("/write")}
            className="flex items-center px-4 h-7 bg-[#7c6dfa] text-white font-bold rounded-lg border border-[#ffffff18] font-heading text-[#6b6b80] text-[0.7rem] tracking-tighter hover:bg-[#a78bfa] cursor-pointer hover:-translate-y-px transition-[background,transform] duration-200">
              ✦ New Entry
            </button>
          </>
        }
      />
      <div className="flex-1 p-4">
        <EntryList limit={null} showSearch={true} />
      </div>
    </div>
  );
}

export default AllEntries;
