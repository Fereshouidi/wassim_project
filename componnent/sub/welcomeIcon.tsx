import { useScreen } from "@/contexts/screenProvider";
import { useTheme } from "@/contexts/themeProvider";
import { motion } from "framer-motion";

export default function WelcomeIcon({ title = "Welcome!", subtitle = "Thank you for joining us!" }) {
  
  const hearts = ["❤️", "💛", "💖", "💚"]; // Animated hearts
  const { screenWidth } = useScreen();
  const { colors } = useTheme();

  return (

    <div className="w-full h-full fixed top-0 left-0 flex justify-center items-center overflow-hidden bg-black/30 backdrop-blur-sm ">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px",
          fontSize: "2rem",
          padding: "30px 50px",
          borderRadius: "15px",
          background: colors.light[100],
          boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        {/* Animated hearts */}
        <div style={{ display: "flex", gap: "10px" }}>
          {hearts.map((heart, index) => (
            <motion.span
              key={index}
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 1 + index * 0.2 }}
              style={{ fontSize:  screenWidth > 1000 ? "30px": "20px"  }}
            >
              {heart}
            </motion.span>
          ))}
        </div>

        {/* Dynamic title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ 
            fontWeight: "bold", 
            color: colors.dark[100],
            fontSize: screenWidth > 1000 ? "30px": "20px" 
          }}
        >
          {title}
        </motion.h1>

        {/* Dynamic subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ fontSize: screenWidth > 1000 ? "16px": "13px" , color: "#555" }}
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </div>



  );
}
