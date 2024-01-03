/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

import NavbarTail from "@/components/navbar-tail";
import { Subtitle, parseSRT } from "@/utils/subtitleParser";

export default function Board() {
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [isVideoDragging, setIsVideoDragging] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isSubtitleDragging, setIsSubtitleDragging] = useState(false);

  const handleVideoDrop = (event: {
    preventDefault: () => void;
    dataTransfer: { files: any[] };
  }) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      setVideoSource(videoUrl);
    }
    setIsVideoDragging(false);
  };

  const handleVideoDragOver = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsVideoDragging(true);
  };

  const handleVideoDragLeave = () => {
    setIsVideoDragging(false);
  };

  // DD FOR SUBS
  const handleSubtitleDrop = (event: {
    preventDefault: () => void;
    dataTransfer: { files: any[] };
  }) => {
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
    <div className="flex flex-col">
      <div>
        <NavbarTail />
      </div>
      <div className="flex flex-row justify-center">
        <div className="basis-3/5 p-5">
          <div
            className={`flex flex-col rounded-lg overflow-hidden border-2 border-dashed border-gray-300 ${
              isVideoDragging ? "border-blue-500" : ""
            } ${videoSource ? "border-none" : ""}`}
            onDrop={handleVideoDrop}
            onDragOver={handleVideoDragOver}
            onDragLeave={handleVideoDragLeave}
          >
            {/* Video player area */}
            {videoSource && (
              <video controls width="100%" height="auto">
                <source src={videoSource} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Drag-and-drop prompt */}
            {!videoSource && (
              <div className="text-center p-4">
                <p>Drag and drop a video file here to play.</p>
              </div>
            )}
          </div>

          <div className="mt-4">
            {/* Player control panel component goes here */}
            <div className="flex justify-center items-center">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Play
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded ml-2">
                Pause
              </button>
            </div>
          </div>
        </div>

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
            <ul role="list" className="divide-y divide-gray-100">
              {subtitles.map((subtitle) => (
                <li
                  key={subtitle.number}
                  className="flex justify-between gap-x-6 py-5"
                >
                  <div className="flex min-w-0 gap-x-4 items-center">
                    <Image
                      src="/static/icons/sub_playing.gif"
                      alt="button image"
                      className="drop-shadow-lg h-3 w-3"
                      width={0}
                      height={0}
                    />
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {subtitle.text}
                      </p>
                    </div>
                  </div>

                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end"></div>
                </li>
              ))}
            </ul>

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
