"use client";
import React, { useEffect, useState } from "react";
import { useRegisterSection } from "@/contexts/registerSec";
import RegisterSection from "@/componnent/main/register/register";
import StatusBanner from "@/componnent/sub/banners/statusBanner";
import { useStatusBanner } from "@/contexts/StatusBanner";
import { useLoadingScreen } from "@/contexts/loadingScreen";
import LoadingScreen from "@/componnent/sub/loading/loadingScreen";
import { number } from "framer-motion";
import axios from "axios";
import { backEndUrl } from "@/api";
import { useClient } from "@/contexts/client";
import { useOwner } from "@/contexts/ownerInfo";
import AiChatBubble from "@/componnent/sub/ai/AiChatBubble";
import { useAiChatBubble } from "@/contexts/AiChatBubble";
import { useCartSide } from "@/contexts/cart";
import CartSide from "@/componnent/main/cartSide";


export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {

    const { registerSectionExist } = useRegisterSection();
    const { statusBannerExist } = useStatusBanner();
    const { loadingScreen } = useLoadingScreen();
    const [clientToken, setClientToken] = useState<string | null>(null);
    const { setClient } = useClient();
    const { setOwnerInfo } = useOwner();
    const { setBubbleProps, bubbleProps } = useAiChatBubble();
    const { isActive } = useCartSide();
    // answer, textDirection, isTherAnswer, setIsTherAnswer


    useEffect(() => {
        const token = localStorage.getItem("clientToken");

        if (!token) return;

        console.log({token});
        
        
        setClientToken(token);
    }, []);

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(backEndUrl + "/getOwnerInfo")
      .then(({ data }) => setOwnerInfo(data.ownerInfo))
      .catch((err) => {
        throw err
      })
    }
    fetchData();
  }, [])
 
    useEffect(() => {
        const fetchClient = async () => {
            await axios.get( backEndUrl + "/getClientByToken", {
                params: { token: clientToken}
            })
            .then(({data}) => {
                data.client && setClient(data.client);
                console.log({client: data.client});
                
            })
            .catch((err) => {throw err})
        }

        const fetchOwner = async () => {
          await axios.get(backEndUrl + "/getOwnerInfo")
          .then(({ data }) => setOwnerInfo(data.ownerInfo))
          .catch((err) => {
            throw err
          })
        }
        
        fetchOwner();
        clientToken && fetchClient();
    }, [clientToken])
    

  return (
    <>
      {children}
      {registerSectionExist && <RegisterSection />}
      {statusBannerExist && <StatusBanner/>}
      {loadingScreen && <LoadingScreen/>}
      { bubbleProps?.exist && <AiChatBubble/>}
      <CartSide/>
    </>
  );
}
