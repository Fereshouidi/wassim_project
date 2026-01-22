import { useLoadingScreen } from "@/contexts/loadingScreen";
import { motion } from "framer-motion";
import LoadingIcon from "./loadingIcon";

export default function LoadingScreen() {

  const { setLoadingScreen } = useLoadingScreen();


  return (
    <div 
        className="w-full h-screen fixed top-0 left-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-[1px]"
        onClick={() => setLoadingScreen(false)}
    >
      <LoadingIcon/>
    </div>
  );
}