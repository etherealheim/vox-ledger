"use client"

import Link from 'next/link';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <div className="flex items-center p-4">
      <Link href="/" className="flex items-center group">
        <motion.div className="flex items-center">
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hover:fill-gray-500"
            whileHover={{ scaleY: -1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }} // Use spring animation
          >
            <path
              d="M12 22L0 2H24L12 22Z"
              fill="white"
            />
          </motion.svg>
          <span className="font-bold ml-2">
            Vox Observer
          </span>
        </motion.div>
      </Link>
    </div>
  );
};

export default Logo;