import React from "react";

const messages = [
  {
    id: 1,
    sender: "AI",
    role: "AI",
    text: "I've read all your 12 journal entries. Ask me anything — I'll answer using only what you've written, so it's grounded in YOUR understanding, not generic docs.",
  },

  {
    id: 2,
    sender: "YOU",
    role: "user",
    text: "What topics have I struggled with?",
  },

  {
    id: 3,
    sender: "AI",
    role: "AI",
    text: `Based on your entries:
(1) useEffect dependencies on May 15 — you called it "hell".
(2) Async/await in Express on May 8 — you had unhandled promise rejections.
(3) CSS Flexbox on May 3.

Want me to quiz you on any of these?`,
  },
];

function AIChat({ variant = "full",  className="" }) {
  const isCompact = variant === "compact";
  return (
    <>
      <div
        className={`flex flex-col bg-[#111118] rounded-lg border border-[#ffffff0f] overflow-hidden ${className}
        ${isCompact ? "h-full" : "max-w-[580px] mx-auto"}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b-1 border-[#ffffff0f]">
          <div className="w-2 h-2 rounded-full bg-[#22d3a3] animate-pulse" />
          {!isCompact ? (
            // only show on full page
            <>
              <span className="font-heading text-[0.7rem] font-bold">
                Grounded in your notes
              </span>
              <span className="ml-auto text-[10px] !text-[#22d3a3] font-body">
                12 entries indexed
              </span>
            </>
          ) : (
            <span className="font-heading text-[0.7rem] font-bold">AI Assistant</span>
          )}
        </div>

        {/* Messages */}
        <div
          className={`flex-1 overflow-y-auto flex flex-col gap-2 p-3  ${isCompact ? "min-h-[140px]" : "min-h-[300px]"}`}
        >
          {messages.map((msg) => (
            <div key={msg.id} className={msg.role === "user" ? "self-end" : ""}>
              <h6 className="font-body text-[0.5rem] mb-[0.2rem]">
                {msg.sender}
              </h6>
              <div
                className={`text-[11px] font-body px-3 py-2 rounded-lg leading-relaxed
                ${
                  msg.role === "user"
                    ? "bg-[#7c6dfa] !text-white rounded-br-sm"
                    : "bg-[#1a1a24] !text-white rounded-bl-sm border border-[#ffffff0f]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 p-3 border-t border-[#ffffff0f]">
          <input
            className="flex-1 bg-[#1a1a24] border border-[#ffffff18] rounded-lg px-3 py-2 text-[11px] font-body !text-white outline-none focus:border-[#7c6dfa]"
            placeholder={
              isCompact
                ? "Ask anything..."
                : "Ask about your entries, quiz me, summarise..."
            }
          />
          <button className="w-8 h-8 bg-[#7c6dfa] rounded-lg text-white flex items-center justify-center hover:bg-[#a78bfa] transition-colors cursor-pointer">
            ↑
          </button>
        </div>
      </div>

      {/* Quick actions — only on full page */}
      {!isCompact && (
        <div className="grid grid-cols-2 gap-2 mt-2 pb-3 max-w-[580px] mx-auto">
          <button className="flex items-center justify-center p-3 bg-transparent rounded-lg border border-[#ffffff18] font-heading font-bold text-[#6b6b80] text-[0.65rem] tracking-tight cursor-pointer hover:bg-[#ffffff18] hover:text-white hover:border-[#ffffff18] transition-[background,color,border-color] duration-200">
            ⬡ Quiz me on React hooks
          </button>
          <button className="flex items-center justify-center p-3 bg-transparent rounded-lg border border-[#ffffff18] font-heading font-bold text-[#6b6b80] text-[0.65rem] tracking-tight cursor-pointer hover:bg-[#ffffff18] hover:text-white hover:border-[#ffffff18] transition-[background,color,border-color] duration-200">
            ↗ Summarise this week
          </button>
          <button className="flex items-center justify-center p-3 bg-transparent rounded-lg border border-[#ffffff18] font-heading font-bold text-[#6b6b80] text-[0.65rem] tracking-tight cursor-pointer hover:bg-[#ffffff18] hover:text-white hover:border-[#ffffff18] transition-[background,color,border-color] duration-200">
            ◎ What should I revise?
          </button>
          <button className="flex items-center justify-center p-3 bg-transparent rounded-lg border border-[#ffffff18] font-heading font-bold text-[#6b6b80] text-[0.65rem] tracking-tight cursor-pointer hover:bg-[#ffffff18] hover:text-white hover:border-[#ffffff18] transition-[background,color,border-color] duration-200">
            ✦ Find linked entries
          </button>
        </div>
      )}
    </>
  );
}

export default AIChat;
