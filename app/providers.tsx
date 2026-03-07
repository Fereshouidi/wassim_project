"use client";

import { ScreenProvider } from "@/contexts/screenProvider";
import { ThemeProvider } from "@/contexts/themeProvider";
import { LanguageProvider } from "@/contexts/languageContext";
import { RegisterSectionProvider } from "@/contexts/registerSec";
import { StatusBannerProvider } from "@/contexts/StatusBanner";
import { LoadingScreenProvider } from "@/contexts/loadingScreen";
import { ClientProvider } from "@/contexts/client";
import { OwnerProvider } from "@/contexts/ownerInfo";
import { AiChatBubbleProvider } from "@/contexts/AiChatBubble";
import { CartSideProvider } from "@/contexts/cart";
import LayoutContent from "./LayoutContent";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ScreenProvider>
            <LanguageProvider>
                <ThemeProvider>
                    <RegisterSectionProvider>
                        <StatusBannerProvider>
                            <LoadingScreenProvider>
                                <ClientProvider>
                                    <OwnerProvider>
                                        <AiChatBubbleProvider>
                                            <CartSideProvider>
                                                <LayoutContent>{children}</LayoutContent>
                                            </CartSideProvider>
                                        </AiChatBubbleProvider>
                                    </OwnerProvider>
                                </ClientProvider>
                            </LoadingScreenProvider>
                        </StatusBannerProvider>
                    </RegisterSectionProvider>
                </ThemeProvider>
            </LanguageProvider>
        </ScreenProvider>
    );
}
