import { useLoadingScreen } from "@/contexts/loadingScreen";
import { motion } from "framer-motion";

export default function LoadingScreen() {

  const { setLoadingScreen } = useLoadingScreen();


  const size = 120; // حجم المربع الكبير
  const squareSize = 55; // جعل المربعات أكبر قليلاً

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
    <div 
        className="w-full h-screen fixed top-0 left-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-[1px]"
        onClick={() => setLoadingScreen(false)}
    >
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
    </div>
  );
}