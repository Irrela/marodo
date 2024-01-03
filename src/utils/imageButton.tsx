import Image from "next/image";

type ImageButtonProps = {
    src: string;
    onClick: () => void;
    // ? 代表 这表示 className 是可选的，即可以传递也可以不传递。
    className?: string;
  };
  
export function ImageButton({ onClick, src, className }: ImageButtonProps) {
    const buttonSize = 1;
    return (
      <button onClick={onClick}>
        <Image
          src={src}
          alt="button image"
          className={`w-10 h-10 drop-shadow-lg ${className ?? ""}`}
          width={buttonSize}
          height={buttonSize}
        />
      </button>
    );
}