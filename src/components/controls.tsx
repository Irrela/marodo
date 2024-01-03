"use client";
import Image from "next/image";

export default function Controls() {
  function onClick() {}

  return (
    <div className="flex flex-row mt-4">
      <ImageButton src="/static/icons/ic_shuffle.svg" onClick={onClick} />
      <ImageButton src="/static/icons/ic_prev.svg" onClick={onClick} />
      <ImageButton
        src="/static/icons/ic_play.svg"
        className="mr-2 ml-2"
        onClick={onClick}
      />
      <ImageButton src="/static/icons/ic_next.svg" onClick={onClick} />
      <ImageButton src="/static/icons/ic_repeat.svg" onClick={onClick} />
    </div>
  );
}

type ImageButtonProps = {
  src: string;
  onClick: () => void;
  // ? 代表 这表示 className 是可选的，即可以传递也可以不传递。
  className?: string;
};

function ImageButton({ onClick, src, className }: ImageButtonProps) {
  const buttonSize = 65;
  return (
    <button onClick={onClick}>
      <Image
        src={src}
        alt="button image"
        className={`drop-shadow-lg ${className ?? ""}`}
        width={buttonSize}
        height={buttonSize}
      />
    </button>
  );
}
