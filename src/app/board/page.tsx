"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

import NavbarTail from "@/components/navbar-tail";
import { Subtitle, parseSRT } from "@/utils/subtitleParser";

export default function Board() {
  const [mediaSource, setMediaSource] = useState<string | null>(null);
  const [isMediaDragging, setIsMediaDragging] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isSubtitleDragging, setIsSubtitleDragging] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
  const subtitlesListRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const videoElement = document.querySelector("video");

    const handleTimeUpdate = () => {
      if (videoElement) {
        setCurrentVideoTime(videoElement.currentTime);
      }
    };

    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [mediaSource]); // 仅在 mediaSource 变化时重新绑定监听器

  // 在 useEffect 中添加滚动逻辑
  useEffect(() => {
    if (subtitlesListRef.current) {
      const currentSubtitleIndex = subtitles.findIndex(
        (subtitle) =>
          currentVideoTime >= subtitle.startTime &&
          currentVideoTime < subtitle.endTime
      );

      // 如果找到了匹配的字幕
      if (currentSubtitleIndex !== -1) {
        // 计算这个字幕在列表中的位置
        const itemHeight: number =
          subtitlesListRef.current.children[currentSubtitleIndex].offsetHeight;
        const scrollPosition =
          subtitlesListRef.current.children[currentSubtitleIndex].offsetTop -
          subtitlesListRef.current.clientHeight / 2 +
          itemHeight / 2;

        // 滚动到这个位置
        subtitlesListRef.current.scrollTop = scrollPosition;
      }
    }
  }, [currentVideoTime, subtitles]);

  const handleMediaDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      setMediaSource(videoUrl);
    }
    setIsMediaDragging(false);
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

  const handleClickSubtitle = (startTimeStr: number) => {
    const videoElement = document.querySelector("video");

    if (videoElement) {
      if (!isNaN(startTimeStr) && isFinite(startTimeStr)) {
        videoElement.currentTime = startTimeStr;
      } else {
        console.error("Invalid startTime:", startTimeStr);
      }
    }
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
              isMediaDragging ? "border-blue-500" : ""
            } ${mediaSource ? "border-none" : ""}`}
            onDrop={handleMediaDrop}
            onDragOver={handleMediaDragOver}
            onDragLeave={handleMediaDragLeave}
          >
            {/* Media player area */}
            {mediaSource && (
              <video controls width="100%" height="auto">
                <source src={mediaSource} type="video/mp4" />
                <source src={mediaSource} type="video/mov" />
                <source src={mediaSource} type="video/webm" />
                <source src={mediaSource} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Drag-and-drop prompt */}
            {!mediaSource && (
              <div className="text-center p-4">
                <p>Drag and drop a video file here to play.</p>
              </div>
            )}
          </div>

          {/* Player control panel */}
          <div className="mt-4">
            <div className="flex justify-center items-center">
              <button className="bg-green-700 text-white px-4 py-2 rounded ml-2">
                Prev
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
                Play
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded ml-2">
                Pause
              </button>
              <button className="bg-green-700 text-white px-4 py-2 rounded ml-2">
                Next
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-full ml-2">
                Loop
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
            <ul
              ref={subtitlesListRef}
              role="list"
              className="divide-y divide-black-100 overflow-y-auto"
              style={{ maxHeight: "80vh" }} // 设置最大高度
            >
              {" "}
              {subtitles.map((subtitle) => (
                <li
                  key={subtitle.number}
                  className={`flex justify-between gap-x-6 py-5 ${
                    currentVideoTime >= subtitle.startTime &&
                    currentVideoTime < subtitle.endTime
                      ? "bg-zinc-100"
                      : ""
                  }`}
                  onClick={() => handleClickSubtitle(subtitle.startTime)}
                >
                  <div className="flex min-w-0 gap-x-4 items-center pl-3">
                    <Image
                      src="/static/icons/sub_playing.gif"
                      alt="button image"
                      className={`drop-shadow-lg h-3 w-3 ${
                        currentVideoTime >= subtitle.startTime &&
                        currentVideoTime < subtitle.endTime
                          ? "visible"
                          : "invisible"
                      }`}
                      width={0}
                      height={0}
                    />
                    <div className="min-w-0 flex-auto">
                      <p
                        className={`text-sm font-semibold leading-6 ${
                          currentVideoTime >= subtitle.startTime &&
                          currentVideoTime < subtitle.endTime
                            ? "text-indigo-500" // 将当前播放的字幕变为紫色
                            : "text-gray-900"
                        }`}
                      >
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
