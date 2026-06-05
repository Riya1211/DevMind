import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import toast from "react-hot-toast";
import { useGetStatsQuery } from "../store/api/entryAPI";


const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
    const { data: statsData } = useGetStatsQuery();
  
    const streak = statsData?.stats.currentStreak ?? 0;

  // Helper to get initials — "Riya Rathore" → "RR"
const getInitials = (name) => {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out Successfully");
    navigate("/login");
  };
  const navSections = [
    {
      title: "MAIN",
      items: [
        { icon: "◈", label: "Dashboard", path: "/" },
        { icon: "✦", label: "Write Entry", path: "/write" },
        { icon: "≡", label: "All Entries", path: "/entries" },
      ],
    },

    {
      title: "AI TOOLS",
      items: [
        { icon: "◎", label: "AI Chat", path: "/chat" },
        { icon: "⬡", label: "Quiz Me" },
        { icon: "↗", label: "Semantic Search" },
      ],
    },

    {
      title: "ACCOUNT",
      items: [
        { icon: "⊙", label: "Log Out", onClick: handleLogout },
        { icon: "⚙", label: "Settings" },
      ],
    },
  ];

  return (
    <div className="inner-box flex flex-col h-screen w-56 bg-cyan-500 fixed top-0 left-0 border-r-1 border-[#ffffff0f]">
      <div className="h-16 px-4 flex items-center gap-1 border-b-1 border-[#ffffff0f]">
        <Logo />
        <div className="flex flex-col">
          <div className="font-heading text-[1.1rem] font-extrabold tracking-tighter">
            DevMind
          </div>
          <div className="font-body text-[0.6rem]">DEVELOPER JOURNAL</div>
        </div>
      </div>
      {/* <div className='flex-1 p-4 flex flex-col font-heading text-grey'>
            <div className='flex flex-col'>
                <h5 className='text-[0.6rem] py-2 tracking-widest'>MAIN</h5>
                <div className='flex px-2 py-1 items-center gap-3 rounded-[4px] cursor-pointer hover:bg-[#1a1a24] hover:text-white transition-all duration-200'>
                    <span>◈</span>
                    <div className='text-[0.8rem] font-semibold'>Dashboard</div>
                </div>
                <div className='flex px-2 py-1 items-center gap-3 rounded-[4px] cursor-pointer hover:bg-[#1a1a24] hover:text-white transition-all duration-200'>
                    <span>✦</span>
                    <div className='text-[0.8rem] font-semibold'>Write Entry</div>
                </div>
                <div className='flex px-2 py-1 items-center gap-3 rounded-[4px] cursor-pointer hover:bg-[#1a1a24] hover:text-white transition-all duration-200'>
                    <span className='text-[1rem]'>≡</span>
                    <div className='text-[0.8rem] font-semibold'>All Entries</div>
                </div>
            </div>
            <div className='flex flex-col'>
                <h5 className='text-[0.6rem] py-2 mt-2 tracking-widest'>AI <span className='ml-1'>TOOLS</span></h5>
                <div className='flex px-2 py-1 items-center gap-3 rounded-[4px] cursor-pointer hover:bg-[#1a1a24] hover:text-white transition-all duration-200'>
                    <span className='text-[0.8rem]'>◎</span>
                    <div className='text-[0.8rem] font-semibold'>AI Chat</div>
                </div>
                <div className='flex px-2 py-1 items-center gap-3 rounded-[4px] cursor-pointer hover:bg-[#1a1a24] hover:text-white transition-all duration-200'>
                    <span className='text-[1rem]'>⬡</span>
                    <div className='text-[0.8rem] font-semibold'>Quiz Me</div>
                </div>
                <div className='flex px-2 py-1 items-center gap-3 rounded-[4px] cursor-pointer hover:bg-[#1a1a24] hover:text-white transition-all duration-200'>
                    <span className='text-[0.8rem]'>↗</span>
                    <div className='text-[0.8rem] font-semibold'>Semantic Search</div>
                </div>
            </div>
            <div className='flex flex-col'>
                <h5 className='text-[0.6rem] py-2 mt-2 tracking-widest'>ACCOUNT</h5>
                <div className='flex px-2 py-1 items-center gap-3 rounded-[4px] cursor-pointer hover:bg-[#1a1a24] hover:text-white transition-all duration-200'>
                    <span className='text-[1rem]'>⊙</span>
                    <div className='text-[0.8rem] font-semibold'>Log Out</div>
                </div>
                <div className='flex px-2 py-1 items-center gap-3 rounded-[4px] cursor-pointer hover:bg-[#1a1a24] hover:text-white transition-all duration-200'>
                    <span className='text-[1rem]'>⚙</span>
                    <div className='text-[0.8rem] font-semibold'>Settings</div>
                </div>
            </div>
        </div> */}
      <div className="flex-1 p-4 flex flex-col font-heading text-grey border-b-1 border-[#ffffff0f]">
        {navSections.map((section) => (
          <div key={section.title} className="flex flex-col">
            <h5 className="text-[0.6rem] py-2 mt-2 tracking-widest">
              {section.title}
            </h5>

            {section.items.map((item) =>
              item.path ? (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.path === "/"}
                >
                  {({ isActive }) => (
                    <div
                      className={`
                        relative flex px-2 py-1 mt-[0.9px] items-center gap-3 rounded-[4px] 
                        cursor-pointer border border-transparent 
                        transition-[background,color,border-color] duration-200
                        ${
                          isActive
                            ? "bg-[#7c6dfa22] text-[#a78bfa] border-[#7c6dfa22]"
                            : "hover:bg-[#1a1a24] hover:text-white"
                        }
                      `}
                    >
                      {/* active bar */}
                      <div
                        className={`
                        absolute left-0 top-1/2 -translate-y-1/2
                        w-[3px] h-4 bg-[#7c6dfa] rounded-r-sm
                        transition-[opacity,transform] duration-250 ease-out
                        ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-[0.4]"}
                      `}
                      />

                      <span>{item.icon}</span>
                      <div className="text-[0.8rem] font-semibold">
                        {item.label}
                      </div>
                    </div>
                  )}
                </NavLink>
              ) : (
                // No path — plain div, no routing, no active state
                <div
                  key={item.label}
                  onClick={item.onClick} 
                  className="relative flex px-2 py-1 mt-[0.9px] items-center gap-3 rounded-[4px] cursor-pointer border border-transparent hover:bg-[#1a1a24] hover:text-white transition-[background,color,border-color] duration-200"
                >
                  <span>{item.icon}</span>
                  <div className="text-[0.8rem] font-semibold">
                    {item.label}
                  </div>
                </div>
              ),
            )}
          </div>
        ))}
      </div>
      <div className="h-20 relative px-4 ">
        <div className="h-13 w-40 flex items-center justify-center px-[0.5rem] bg-[#1a1a24] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#ffffff0f] gap-2">
          <div className="flex shrink-0 h-[32px] w-[32px] items-center justify-center bg-gradient-to-br from-[#7c6dfa] to-[#22d3a3] rounded-lg font-heading font-bold text-[12px]">
            {getInitials(user?.name)}
          </div>
          <div className="flex flex-col flex-1 leading-tight">
            <div className="font-heading font-bold text-[0.85rem]">{user?.name}.</div>
            <div className="font-body text-[0.55rem]">@dev . streak {streak}d</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
