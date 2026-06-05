import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetEntriesQuery } from "../store/api/entryAPI";

// const allEntries = [
//   {
//     title: "JWT Auth — finally clicked",
//     date: "today",
//     content:
//       "Spent 3hrs on middleware. The key insight was that the token gets decoded before the route handler runs, not inside it...",
//     tags: ["Node.js", "Auth", "breakthrough"],
//   },

//   {
//     title: "useEffect dependency hell",
//     date: "May 15",
//     content:
//       "Finally understand the exhaustive-deps lint rule. The array isn't 'when to run' it's 'what values this effect depends on'...",
//     tags: ["React", "struggle"],
//   },

//   {
//     title: "MongoDB aggregation pipeline",
//     date: "May 13",
//     content:
//       "$match → $group → $project is the pattern. Think of it like SQL but each stage transforms the whole dataset...",
//     tags: ["MongoDB", "notes"],
//   },

//   {
//     title: "Postman collection setup",
//     date: "May 11",
//     content:
//       "Environment variables in Postman are a game changer. Set {{base_url}} and {{token}} once, reuse everywhere...",
//     tags: ["Postman", "tip"],
//   },
// ];

const tagColors = [
  "bg-[#7c6dfa18] text-[#a78bfa] border border-[#7c6dfa22]",
  "bg-[#22d3a318] text-[#22d3a3] border border-[#22d3a322]",
  "bg-[#f59e0b18] text-[#f59e0b] border border-[#f59e0b22]",
  "bg-[#f8717118] text-[#f87171] border border-[#f8717122]",
];

// helper function — strips HTML tags for preview
const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

function EntryList({ limit = null, showSearch = false, className = "" }) {
  const { data, isLoading, error } = useGetEntriesQuery();

  const currentMonth = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  // for dashboard we are setting a limit
  // const entries = limit ? allEntries.slice(0, limit) : allEntries;
  const entries = data?.entries
    ? limit
      ? data.entries.slice(0, limit)
      : data.entries
    : [];

  const navigate = useNavigate();
  return (
    <div
      className={`flex flex-col rounded-lg bg-[#111118] border border-[#ffffff0f] overflow-hidden ${className} `}
    >
      <div className="flex justify-between py-2 px-4 border-b-1 border-[#ffffff0f]">
        {showSearch ? (
          <>
            <div className="flex items-center font-heading text-[0.8rem] font-bold tracking-tighter">
              {currentMonth}
            </div>

            <div className="flex items-center px-4 h-7 bg-[#1a1a24] rounded-lg border border-[#ffffff18] font-body text-[#6b6b80] text-[11px] tracking-tight">
              ⌕ search entries...
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center font-heading text-[0.8rem] font-bold tracking-tighter">
              Recent entries
            </div>

            <div
              onClick={() => navigate("/entries")}
              className="px-4 font-body !text-[#a78bfa] text-[11px] tracking-tight cursor-pointer"
            >
              view all →
            </div>
          </>
        )}
      </div>
      {/* entries scroll inside that is why adding one more div */}
      <div className="flex-1 overflow-y-auto">
        {entries.map((entry) => (
          <div
            onClick={() => navigate(`/write/${entry._id}`)}
            key={entry.title}
            className="px-4 py-3 border-b-1 border-[#ffffff0f] cursor-pointer hover:bg-[#ffffff18] transition-[background] duration-150"
          >
            <div className="flex justify-between">
              <h2 className="font-heading font-bold text-[0.85rem]">
                {entry.title}
              </h2>
              <p className="font-body text-[0.62rem] tracking-tight">
                {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
            {/* line-clamp-2 helps to cuts text to 2 lines and adds ... automatically.   */}
            <p className="font-body text-[0.65rem] mt-1 mb-2 line-clamp-2">
              {stripHtml(entry.content)}
            </p>

            <div className="flex gap-2">
              {entry.tags.map((tag, i) => {
                // for tag color
                const color = tagColors[i % tagColors.length];

                return (
                  <span
                    key={tag}
                    className={`p-1 text-[0.54rem] rounded-[3px] font-semibold ${color}`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EntryList;
