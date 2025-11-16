"use client";

import { ClientType } from "@/types";
import React, { createContext, ReactNode, useContext, useState } from "react";

type ClientContextType = {
  client: ClientType | null;
  setClient: (client: ClientType | null) => void;
  updateClient: (data: Partial<ClientType>) => void; // for updating part of the client
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<ClientType | null>(null);

  // Helper to update only some fields of the client
  const updateClient = (data: Partial<ClientType>) => {
    setClient(prev => (prev ? { ...prev, ...data } : { ...data } as ClientType));
  };

  return (
    <ClientContext.Provider value={{ client, setClient, updateClient }}>
      {children}
    </ClientContext.Provider>
  );
};

// Custom hook for easy access
export const useClient = (): ClientContextType => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};
