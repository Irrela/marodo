"use client";
import Controls from "./controls";
import ProgressBar from "./progressbar";

export default function AudioPlayer() {
  return (
    <div className="flex flex-col items-center">
      <ProgressBar />
      <Controls />
    </div>
  );
}
