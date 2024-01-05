"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

import Navbar from "@/components/navbar";
import { Subtitle, parseSRT } from "@/utils/subtitleParser";

export default function Board() {
  const [mediaSource, setMediaSource] = useState<string | null>(null);
  const [isMediaDragging, setIsMediaDragging] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isSubtitleDragging, setIsSubtitleDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const handleMediaDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;

    if (droppedFiles.length > 0) {
      const mediaFile = droppedFiles[0];
      const mediaUrl = URL.createObjectURL(mediaFile);

      setMediaSource(mediaUrl);
    }
  };

  const handleMediaDragOver = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsMediaDragging(true);
  };

  const handleMediaDragLeave = () => {
    setIsMediaDragging(false);
  };

  // DD FOR SUBS
  const handleSubtitleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === "text/plain" || file.name.endsWith(".srt"))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const subtitleText = e.target?.result;
        const parsedSubtitles: Subtitle[] = parseSRT(subtitleText);
        setSubtitles(parsedSubtitles);
        setIsSubtitleDragging(false);
      };
      reader.readAsText(file);
    }
  };

  const handleSubtitleDragOver = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsSubtitleDragging(true);
  };

  const handleSubtitleDragLeave = () => {
    setIsSubtitleDragging(false);
  };

  return (
    <div className="flex flex-col bg-slate-200">
      <div className="pb-3">
        <Navbar />
      </div>

      <div
        className={`flex flex-col rounded-lg overflow-hidden border-2 border-dashed border-gray-300 ${
          isMediaDragging ? "border-blue-500" : ""
        } ${mediaSource ? "border-none" : ""}`}
        onDrop={handleMediaDrop}
        onDragOver={handleMediaDragOver}
        onDragLeave={handleMediaDragLeave}
      >
        {/* Audio player area */}
        {mediaSource && (
          <audio
            controls
            autoPlay={isPlaying}
            className="w-full"
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          >
            <source src={mediaSource} type="audio/mp3" />
            <source src={mediaSource} type="audio/m4a" />
            Your browser does not support the audio element.
          </audio>
        )}

        {/* Drag-and-drop prompt */}
        {!mediaSource && (
          <div className="text-center p-4">
            <p>Drag and drop a video file here to play.</p>
          </div>
        )}
      </div>

      {/* Desc */}
      <div className="flex items-center px-5 py-2">
        <div className="mr-3">
          <Image
            className="rounded-lg"
            src="/static/icons/npr_indicator.jpeg"
            alt="Your Image"
            width={80}
            height={80}
          />
        </div>
        <div>
          <p className="text-lg font-bold">
            WTF is a bitcoin ETF?
          </p>
          <p>
            2024-1-5
          </p>
        </div>
      </div>

      {/* Board Area */}
      <div className="px-5">
        <div className="flex flex-col p-7 rounded-lg overflow-hidden border-2 border-gray-700 bg-white">
          <div className="h-24 overflow-y-auto">
            {subtitles
              .filter(
                (subtitle) =>
                  subtitle.startTime <= currentTime &&
                  subtitle.endTime >= currentTime
              )
              .map((subtitle, index) => (
                <p className="" key={index}>
                  {subtitle.text}
                </p>
              ))}
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center">
        {/* Subtitles Area */}
        <div className="basis-2/5 p-5">
          <div
            className={`basis-2/5 px-5 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 ${
              isSubtitleDragging ? "border-blue-500" : ""
            } ${subtitles.length > 0 ? "border-none" : ""}`}
            onDrop={handleSubtitleDrop}
            onDragOver={handleSubtitleDragOver}
            onDragLeave={handleSubtitleDragLeave}
          >
            {/* Subtitles Area */}

            {/* Drag-and-drop prompt for subtitles */}
            {subtitles.length === 0 && (
              <div className="text-center p-4">
                <p>Drag and drop a subtitles file here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
