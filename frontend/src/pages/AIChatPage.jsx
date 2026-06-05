import React from "react";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import AIChat from "../components/AIChat";

function AIChatPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen w-full">
      <TopBar
        title="AI Assistant"
        subtitle="Powered by your journal entries"
        actions={
          <>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-4 h-7 bg-transparent rounded-lg border border-[#ffffff18] font-heading font-bold text-[#6b6b80] text-[12px] tracking-tight cursor-pointer hover:bg-[#ffffff18] hover:text-white hover:border-[#ffffff18] transition-[background,color,border-color] duration-200"
            >
              ← Back
            </button>
            <button className="flex items-center px-4 h-7 bg-transparent rounded-lg border border-[#ffffff18] font-heading font-bold text-[#6b6b80] text-[12px] tracking-tight cursor-pointer hover:bg-[#ffffff18] hover:text-white hover:border-[#ffffff18] transition-[background,color,border-color] duration-200">
              ⬡ Quiz Me
            </button>
          </>
        }
      />
      <div className="p-4">
        <AIChat variant="full"/>
      </div>
    </div>
  );
}

export default AIChatPage;
