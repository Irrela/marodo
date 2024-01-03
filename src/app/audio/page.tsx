"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

import Navbar from "@/components/navbar";
import { Subtitle, parseSRT } from "@/utils/subtitleParser";

export default function Audio() {
  const [mediaSource, setMediaSource] = useState<string | null>(null);
  const [isMediaDragging, setIsMediaDragging] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isSubtitleDragging, setIsSubtitleDragging] = useState(false);
  const [currentAudioTime, setCurrentVideoTime] = useState<number>(0);
  const subtitlesListRef = useRef<HTMLUListElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 在组件内部定义一个状态来追踪用户是否正在主动滚动
  const [userScrolling, setUserScrolling] = useState(false);

  useEffect(() => {
    const audioElement = document.querySelector("audio");

    const handleTimeUpdate = () => {
      if (audioElement) {
        setCurrentVideoTime(audioElement.currentTime);
      }
    };

    if (audioElement) {
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [mediaSource]); // 仅在 mediaSource 变化时重新绑定监听器

  // 在 useEffect 中添加滚动逻辑
  useEffect(() => {
    if (subtitlesListRef.current && !userScrolling) {
      const currentSubtitleIndex = subtitles.findIndex(
        (subtitle) =>
          currentAudioTime >= subtitle.startTime &&
          currentAudioTime < subtitle.endTime
      );

      // 如果找到了匹配的字幕
      if (currentSubtitleIndex !== -1) {
        const list = subtitlesListRef.current;
        const currentSubtitleElement = list.children[currentSubtitleIndex];

        // 计算字幕元素底部相对于列表的位置
        const subtitleBottom =
          currentSubtitleElement.offsetTop +
          currentSubtitleElement.offsetHeight;

        // 如果字幕接近页面底部，触发滚动
        if (subtitleBottom > list.scrollTop + list.clientHeight - 100) {
          const itemHeight = currentSubtitleElement.offsetHeight;
          const scrollPosition =
            currentSubtitleElement.offsetTop -
            list.clientHeight / 2 +
            itemHeight / 2;

          // 滚动到这个位置
          list.scrollTop = scrollPosition;
        }
      }
    }
  }, [currentAudioTime, subtitles]);

  useEffect(() => {
    // ...

    const handleScroll = () => {
      if (subtitlesListRef.current) {
        // 用户正在主动滚动
        setUserScrolling(true);

        // 在2秒后重置用户滚动状态
        setTimeout(() => {
          setUserScrolling(false);
        }, 5000);

        // 其他滚动逻辑...
      }
    };

    // 添加滚动事件监听器
    subtitlesListRef.current.addEventListener("scroll", handleScroll);

    return () => {
      // 移除滚动事件监听器
      subtitlesListRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [currentAudioTime, subtitles]);

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

  const handleClickSubtitle = (startTimeStr: number) => {
    const audioElement = document.querySelector("audio");

    if (audioElement) {
      if (!isNaN(startTimeStr) && isFinite(startTimeStr)) {
        audioElement.currentTime = startTimeStr;
      } else {
        console.error("Invalid startTime:", startTimeStr);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div>
        <Navbar />
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
            {/* Audio player area */}
            {mediaSource && (
              <audio controls autoPlay={isPlaying} className="w-full">
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
                    currentAudioTime >= subtitle.startTime &&
                    currentAudioTime < subtitle.endTime
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
                        currentAudioTime >= subtitle.startTime &&
                        currentAudioTime < subtitle.endTime
                          ? "visible"
                          : "invisible"
                      }`}
                      width={0}
                      height={0}
                    />
                    <div className="min-w-0 flex-auto">
                      <p
                        className={`text-sm font-semibold leading-6 ${
                          currentAudioTime >= subtitle.startTime &&
                          currentAudioTime < subtitle.endTime
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
