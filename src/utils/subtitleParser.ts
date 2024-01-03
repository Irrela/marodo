export interface Subtitle {
  number: number;
  startTime: number;
  endTime: number;
  text: string;
}

export function parseSRT(srtContent: string | ArrayBuffer | null | undefined): Subtitle[] {
  if (!srtContent) {
    throw new Error("SRT content is null or undefined.");
  }

  // Convert ArrayBuffer to string if needed
  const contentString =
    typeof srtContent === "string"
      ? srtContent
      : new TextDecoder("utf-8").decode(srtContent);

  
  // 切分字幕
  const subtitles = contentString.trim().split(/\n\s*\n/);

  // 处理每个字幕块
  const parsedSubtitles: Subtitle[] = subtitles.map((subtitle) => {
    const subtitleLines = subtitle.split(/\n/);
    
    // 第一行是序号
    const number = parseInt(subtitleLines[0].trim(), 10);

    // 第二行是时间范围
    const timeRange = subtitleLines[1].trim().split(' --> ');
    const startTime = parseTimeToSeconds(timeRange[0]);
    const endTime = parseTimeToSeconds(timeRange[1]);

    // 剩下的是文本
    const text = subtitleLines.slice(2).join(' ');

    return {
      number,
      startTime,
      endTime,
      text,
    };
  });

  return parsedSubtitles;
}


export const parseTimeToSeconds = (timeStr: string): number => {
  // 将时间字符串解析为时、分、秒和毫秒
  const [, hours, minutes, seconds, milliseconds] = timeStr.match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/) || [];

  // 计算总秒数
  const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);

  // 加上毫秒的部分
  const totalSecondsWithMilliseconds = totalSeconds + parseInt(milliseconds) / 1000;

  return totalSecondsWithMilliseconds;
};


// 添加一个简单的缓动函数，使得动画更加平滑
export function easeInOutQuad(t: number, b: number, c: number, d: number): number {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}