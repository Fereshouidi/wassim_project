import { Metadata } from "next";
import Home from "./home/page";


export async function generateMetadata(): Promise<Metadata> {
    return {
      title: "SilverWay",
      description: "",
      openGraph: {
        title: "",
        description: "",
        images: [],
        url: `https://silver-way.vercel.app`,
        type: "website",
      },
    };
}

export default function App() {


  return (
    <Home/>
  );
}
