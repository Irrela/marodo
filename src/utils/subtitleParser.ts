export interface Subtitle {
  number: number;
  startTime: string;
  endTime: string;
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
    const startTime = timeRange[0];
    const endTime = timeRange[1];

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
