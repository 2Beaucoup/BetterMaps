"use client";

import React, { useContext, createContext, FC, useState } from "react";

// Define the context type
interface NeighborhoodContextType {
  neighborhood: string | null;
  setNeighborhood: (neighborhood: string | null) => void;
}

const NeighborhoodContext = createContext<NeighborhoodContextType | undefined>(
  undefined,
);

export const useNeighborhood = () => {
  const context = useContext(NeighborhoodContext);
  if (!context) {
    throw new Error(
      "useNeighborhood must be used within a NeighborhoodProvider",
    );
  }
  return context;
};

export const NeighborhoodProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [neighborhood, setNeighborhood] = useState<string | null>(null);

  return (
    <NeighborhoodContext.Provider
      value={{
        neighborhood,
        setNeighborhood,
      }}
    >
      {children}
    </NeighborhoodContext.Provider>
  );
};
