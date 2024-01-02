"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

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

          {/* TODO: A player control panel */}
          <div className="mt-4">
            {/* Your player control panel component goes here */}
            {/* For example: */}
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
          <StackLists />
        </div>
      </div>
    </div>
  );
}
