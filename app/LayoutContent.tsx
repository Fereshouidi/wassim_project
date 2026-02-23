"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backEndUrl } from "@/api";
import { getDeviceId } from "@/lib";

// Context Imports
import { useRegisterSection } from "@/contexts/registerSec";
import { useStatusBanner } from "@/contexts/StatusBanner";
import { useLoadingScreen } from "@/contexts/loadingScreen";
import { useClient } from "@/contexts/client";
import { useOwner } from "@/contexts/ownerInfo";
import { useAiChatBubble } from "@/contexts/AiChatBubble";
import { useCartSide } from "@/contexts/cart";

// Component Imports
import RegisterSection from "@/componnent/main/register/register";
import StatusBanner from "@/componnent/sub/banners/statusBanner";
import LoadingScreen from "@/componnent/sub/loading/loadingScreen";
import AiChatBubble from "@/componnent/sub/ai/AiChatBubble";
import CartSide from "@/componnent/main/cartSide";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  // Extracting values from Contexts
  const { registerSectionExist } = useRegisterSection();
  const { statusBannerExist } = useStatusBanner();
  const { loadingScreen } = useLoadingScreen();
  const { setClient } = useClient();
  const { setOwnerInfo } = useOwner();
  const { bubbleProps } = useAiChatBubble();

  useEffect(() => {
    const initializeAppData = async () => {
      try {
        // 1. Get Device ID (Crucial for direct links/tracking)
        const deviceId = await getDeviceId();
        
        // 2. Retrieve token from Local Storage
        const token = localStorage.getItem("clientToken");

        // 3. Parallel fetch of Owner and Client data for performance optimization
        const [ownerRes, clientRes] = await Promise.all([
          axios.get(`${backEndUrl}/getOwnerInfo`),
          (token || deviceId) 
            ? axios.get(`${backEndUrl}/getClientByToken`, { params: { token, deviceId } })
            : Promise.resolve({ data: { client: null } })
        ]);

        // 4. Update Global State/Context
        if (ownerRes.data?.ownerInfo) {
          setOwnerInfo(ownerRes.data.ownerInfo);
        }

        if (clientRes.data?.client) {
          setClient(clientRes.data.client);
          console.log("Client Loaded:", clientRes.data.client);
        }

      } catch (error) {
        console.error("Error during App Initialization:", error);
      }
    };

    initializeAppData();
  }, []); // Runs once on initial mount or page refresh

  return (
    <>
      {/* Render Page Content */}
      {children}

      {/* Global components conditionally rendered based on Context state */}
      {registerSectionExist && <RegisterSection />}
      {statusBannerExist && <StatusBanner />}
      {loadingScreen && <LoadingScreen />}
      {bubbleProps?.exist && <AiChatBubble />}
      
      {/* Side Cart - Persistent across Layout */}
      <CartSide />
    </>
  );
}