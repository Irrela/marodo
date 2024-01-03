/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

import NavbarTail from "@/components/navbar-tail";
import StackLists from "@/components/stack-lists";
import Controls from "@/components/controls";
import AudioPlayer from "@/components/audioplayer";

export default function Board() {
  const [videoSource, setVideoSource] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      setVideoSource(videoUrl);
    }
    setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Data for StackLists
  const subtitles = [
    {
      number: "Leslie Alexander",
      startTime: "",
      endTime: "",
      text: "leslie.alexander@example.com",
    },
    {
        number: "Leslie Alexander",
        startTime: "",
        endTime: "",
        text: "leslie.alexander@example.com",
      },
  ];

  return (
    <div className="flex flex-col">
      <div>
        <NavbarTail />
      </div>
      <div className="flex flex-row justify-center">
        <div className="basis-3/5 p-5">
          <div
            className={`flex flex-col rounded-lg overflow-hidden border-2 border-dashed border-gray-300 ${
              isDragging ? "border-blue-500" : ""
            } ${videoSource ? "border-none" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
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

        <div className="basis-2/5 px-5">
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
                    className={`drop-shadow-l h-4 w-4`}
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
        </div>
      </div>
    </div>
  );
}
