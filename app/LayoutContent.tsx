"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backEndUrl } from "@/api";
import { getDeviceId } from "@/lib";

// استيراد الـ Contexts
import { useRegisterSection } from "@/contexts/registerSec";
import { useStatusBanner } from "@/contexts/StatusBanner";
import { useLoadingScreen } from "@/contexts/loadingScreen";
import { useClient } from "@/contexts/client";
import { useOwner } from "@/contexts/ownerInfo";
import { useAiChatBubble } from "@/contexts/AiChatBubble";
import { useCartSide } from "@/contexts/cart";

// استيراد المكونات
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
  // استخراج القيم من الـ Contexts
  const { registerSectionExist } = useRegisterSection();
  const { statusBannerExist } = useStatusBanner();
  const { loadingScreen } = useLoadingScreen();
  const { setClient } = useClient();
  const { setOwnerInfo } = useOwner();
  const { bubbleProps } = useAiChatBubble();

  useEffect(() => {
    const initializeAppData = async () => {
      try {
        // 1. جلب معرف الجهاز (مهم جداً للروابط المباشرة)
        const deviceId = await getDeviceId();
        
        // 2. جلب التوكن من التخزين المحلي
        const token = localStorage.getItem("clientToken");

        // 3. جلب بيانات المالك والعميل في وقت واحد (Parallel) لزيادة السرعة
        const [ownerRes, clientRes] = await Promise.all([
          axios.get(`${backEndUrl}/getOwnerInfo`),
          (token || deviceId) 
            ? axios.get(`${backEndUrl}/getClientByToken`, { params: { token, deviceId } })
            : Promise.resolve({ data: { client: null } })
        ]);

        // 4. تحديث البيانات في الـ Context
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
  }, []); // تعمل مرة واحدة فقط عند أول دخول للموقع (أو تحديث الصفحة)

  return (
    <>
      {/* عرض محتوى الصفحة (children) */}
      {children}

      {/* المكونات العالمية التي تظهر بناءً على حالة الـ Context */}
      {registerSectionExist && <RegisterSection />}
      {statusBannerExist && <StatusBanner />}
      {loadingScreen && <LoadingScreen />}
      {bubbleProps?.exist && <AiChatBubble />}
      
      {/* سلة التسوق الجانبية - تظهر دائماً في الـ Layout */}
      <CartSide />
    </>
  );
}