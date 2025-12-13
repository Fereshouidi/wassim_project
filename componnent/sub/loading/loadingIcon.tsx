import { motion } from 'framer-motion';
import React from 'react'

type props = {
    size?: number
    squareSize?: number
}

const LoadingIcon = ({
    size = 120,
    squareSize = 55
}: props) => {



  // أربع نقاط داخل المربع الكبير
  const positions = [
    { x: 0, y: 0 },                        // top-left
    { x: size - squareSize, y: 0 },        // top-right
    { x: size - squareSize, y: size - squareSize }, // bottom-right
    { x: 0, y: size - squareSize },        // bottom-left
  ];

  // ترتيب البداية لكل مربع
  const startIndexes = [0, 1, 2, 3];
  const colors = ["black", "white", "black", "white"];
  const borderColors = ["white", "black", "white", "black"];

  return (
      <div className="relative" style={{ width: size, height: size }}>
        {startIndexes.map((startIdx, i) => (
          <motion.div
            key={i}
            className="absolute rounded shadow-xl"
            style={{
              width: squareSize,
              height: squareSize,
              backgroundColor: colors[i],
              border: `1px solid ${borderColors[i]}`
            }}
            animate={{
              x: positions.map((_, idx) => positions[(startIdx + idx) % 4].x),
              y: positions.map((_, idx) => positions[(startIdx + idx) % 4].y),
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          />
        ))}
      </div>
  )
}

export default LoadingIcon
