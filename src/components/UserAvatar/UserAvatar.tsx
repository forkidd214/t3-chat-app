import * as React from "react";
import Image from "next/image";

type UserAvatarProps = {
  className?: string;
  src?: string;
  alt: string;
};

export default function UserAvatar({ src, alt, className }: UserAvatarProps) {
  return (
    <div
      className={`relative flex aspect-square h-6 place-content-center overflow-hidden rounded-full bg-transparent p-1 ${className}`}
    >
      {src ? (
        <Image
          className="brightness-125"
          src={src}
          alt={alt}
          fill
          sizes="100%"
          style={{
            objectFit: "cover",
          }}
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-full w-full text-zinc-400"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
}
