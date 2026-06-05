import React from "react";

function TopBar({ title, subtitle, actions }) {
  return (
    <>
      <div className="h-20 flex p-4 border-b-1 border-[#ffffff0f] justify-between">
        <div className="flex flex-col justify-center leading-tight">
          <div className="font-heading text-[1.4rem] font-extrabold tracking-tighter">
            {title}
          </div>
          <div className="font-body text-[0.7rem]">
           {subtitle}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
    </>
  );
}

export default TopBar;
