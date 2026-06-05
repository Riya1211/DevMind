import React, { useEffect, useState } from "react";
import { useGetStatsQuery } from "../store/api/entryAPI";

// const cards = [
//   {
//     title: "TOTAL ENTRIES",
//     value: 12,
//     span: "+3",
//     data: "this week",
//     color: "#7c6dfa",
//     delay: 50,
//   },
//   {
//     title: "CURRENT STREAK",
//     value: "7",
//     unit: "d",
//     span: "Best",
//     data: "14 days",
//     color: "#22d3a3",
//     delay: 100,
//   },
//   {
//     title: "SKILLS LOGGED",
//     value: 8,
//     data: ["React", "Node", "MonogDB"],
//     color: "#f59e0b",
//     delay: 150,
//   },
//   {
//     title: "AI SUMMARIES",
//     value: 5,
//     span: 2,
//     data: "quizzes taken",
//     color: "#f87171",
//     delay: 200,
//   },
// ];
function StatCard() {
  const [visible, setVisible] = useState([]);
  const { data, isLoading } = useGetStatsQuery();

  const cards = [
    {
      title: "TOTAL ENTRIES",
      value: data?.stats.totalEntries ?? "—",
      span: "",
      data: "total entries",
      color: "#7c6dfa",
      delay: 50,
    },
    {
      title: "CURRENT STREAK",
      value: data?.stats.currentStreak ?? "—",
      unit: "d",
      span: "Best",
      data: `${data?.stats.bestStreak ?? 0} days`,
      color: "#22d3a3",
      delay: 100,
    },
    {
      title: "SKILLS LOGGED",
      value: data?.stats.skills.length ?? "—",
      data: data?.stats.skills.length > 0 ? data.stats.skills : ["none yet"],
      color: "#f59e0b",
      delay: 150,
    },
    {
      title: "AI SUMMARIES",
      value: data?.stats.aiSummaries ?? "—",
      span: "",
      data: "summaries generated",
      color: "#f87171",
      delay: 200,
    },
  ];

  useEffect(() => {
    cards.forEach((card, i) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, i]);
      }, card.delay);
    });
  }, []);

  return (
    <>
      <div className="grid grid-cols-4 gap-4 p-4">
        {cards.map((card, i) => (
          <div
            key={card.title}
            className={`flex flex-col justify-center p-4 relative bg-[#111118] rounded-[8px] border border-[#ffffff0f] overflow-hidden transition-all duration-300
            ${
              visible.includes(i)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            {/* different color border work like ::after */}
            <div
              style={{
                background: `linear-gradient(90deg, ${card.color}, transparent)`,
              }}
              className="absolute top-0 left-0 right-0 h-[2px]"
            ></div>
            <div className="font-body text-[0.65rem]">{card.title}</div>

            <div className="font-heading mt-1 font-extrabold text-[1.5rem]">
              {card.value}
              {card.unit && (
                <span className="text-[#6b6b80] text-[0.9rem]">
                  {card.unit}
                </span>
              )}
            </div>

            <div className="font-body text-[0.6rem]">
              <span className="text-[#22d3a3] text-[0.6rem]">{card.span}</span>{" "}
              {Array.isArray(card.data)
                ? card.data.map((item, i) => (
                    <span key={item}>
                      {" "}
                      {i > 0 && (
                        <span className="text-[#22d3a3] text-[0.6rem]">·</span>
                      )}{" "}
                      {item}
                    </span>
                  ))
                : card.data}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default StatCard;
