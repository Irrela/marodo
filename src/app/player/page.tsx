"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Subtitle {
  startTime: string;
  endTime: string;
  text: string;
}

export default function Blackboard() {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [displayedSubtitles, setDisplayedSubtitles] = useState<string[]>([]);
  const videoFilePath = '/sample.mp4';

  useEffect(() => {
    const fetchSubtitles = async () => {
      try {
        const response = await axios.get("/sample.srt");
        const subtitlesArray = response.data.split("\n\n");

        const subtitlesData: Subtitle[] = subtitlesArray.map(
          (subtitle: string) => {
            const subtitleParts = subtitle.split("\n");
            const [startTime, endTime] = subtitleParts[1].split(" --> ");
            const text = subtitleParts.slice(2).join(" ");
            return { startTime, endTime, text };
          }
        );

        setSubtitles(subtitlesData);
      } catch (error) {
        console.error("Error fetching subtitles:", error);
      }
    };

    if (isPlaying) {
      fetchSubtitles();
    }
  }, [isPlaying]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 0.1);
      }, 100);
    }

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [isPlaying]);

  useEffect(() => {
    const currentSubtitle = getCurrentSubtitle();
  
    if (currentSubtitle !== "") {
      setDisplayedSubtitles((prev) => [...prev, currentSubtitle]);
    }
  }, [currentTime]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  function stopPlay() {
    setIsPlaying(false);
  }

  const timeToSeconds = (time: string): number => {
    const [hh, mm, ss] = time.split(":").map(Number);
    return hh * 3600 + mm * 60 + ss;
  };

  function timeToMs(time: string): number {
    const [hh, mm, ss, ms] = time.split(":").map(Number);
    return hh * 3600 * 1000 + mm * 60 * 1000 + ss * 1000 + ms;
  }

  //   const getCurrentSubtitle = (): string => {
  //     const currentSubtitle = subtitles.find(
  //       (subtitle) =>
  //         timeToSeconds(subtitle.startTime) <= currentTime &&
  //         timeToSeconds(subtitle.endTime) >= currentTime
  //     );

  //     return currentSubtitle ? currentSubtitle.text : "";

  //   };

  const getCurrentSubtitle = (): string => {
    const currentSubtitle = subtitles.find(
      (subtitle) =>
        timeToSeconds(subtitle.startTime) <= currentTime &&
        timeToSeconds(subtitle.endTime) >= currentTime
    );
  
    if (currentSubtitle) {
      const newText = currentSubtitle.text;
      if (!displayedSubtitles.includes(newText)) {
        return newText;
      }
    }
  
    return "";
  };  

  const getTotalDuration = (): number => {
    if (subtitles.length === 0) {
      return 0;
    }

    const lastSubtitle = subtitles[subtitles.length - 1];
    return timeToSeconds(lastSubtitle.endTime);
  };

  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  function formatTimeMs(timeInMs: number): string {
    const hours = Math.floor(timeInMs / 3600000);
    const minutes = Math.floor((timeInMs % 3600000) / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const milliseconds = Math.floor(timeInMs % 1000);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(
      3,
      "0"
    )}`;
  }

  const progress = (currentTime / getTotalDuration()) * 100;

  return (
    <div className="bg-cover h-screen flex flex-col items-center justify-center">
      <div className="bg-opacity-75 p-8 max-w-md rounded-md shadow-md">
        <div className="text-black text-lg font-bold mb-4">
          {displayedSubtitles.map((text, index) => (
            <div className="p-2"key={index}>{text}</div>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-black">{formatTime(currentTime)}</div>
          <div className="flex-1">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    文件总时长
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {formatTime(getTotalDuration())}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex relative pt-1">
                  <div className="flex flex-col w-full">
                    <div className="h-2 bg-gray-300 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handlePlay}
        >
          播放
        </button>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={stopPlay}
        >
          暂停
        </button>
      </div>
    </div>
  );
}
