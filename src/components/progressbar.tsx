"use client";

export default function ProgressBar() {
  return (
    <div className="flex flex-col w-full">
      {/* <input
        type="range"
        min={1}
        max={100}
        value={50}
        step={0.25}
        className="w-full h-7px bg-white rounded-lg outline-none cursor-pointer drop-shadow-lg accent-[#505050]"
      />       */}
      <input
        type="range"
        min={1}
        max={100}
        value={50}
        step={0.25}
        className="slider"
      />
      
      <div className="flex w-full flex-row justify-between mt-1">
        <span className="text-xs">01:00</span>
        <span className="text-xs">02:00</span>
      </div>
    </div>
  );
}
