"use client";

import Link from 'next/link';

const Logo = () => {
  return (
    <div className="flex items-center p-4">
      <Link href="/" className="flex items-center group">
        <div className="flex items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1"
            className="transition-all duration-500 ease-in-out"
          >
            <path
              d="M12 22L0 2H24L12 22Z"
              fill="white"
              stroke="white" // Add stroke color
              strokeWidth={1}
              className="transition-all duration-500 ease-in-out group-hover:fill-transparent"
            />
          </svg>
          <span className="font-bold ml-2">Vox Observer</span>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
