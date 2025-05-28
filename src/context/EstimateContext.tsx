"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type MoveType = "small" | "family" | null;

interface EstimateContextValue {
  moveType: MoveType;
  setMoveType: (type: MoveType) => void;
}

const EstimateContext = createContext<EstimateContextValue | undefined>(
  undefined
);

export function EstimateProvider({ children }: { children: ReactNode }) {
  const [moveType, setMoveType] = useState<MoveType>(null);

  return (
    <EstimateContext.Provider value={{ moveType, setMoveType }}>
      {children}
    </EstimateContext.Provider>
  );
}

export function useEstimate() {
  const ctx = useContext(EstimateContext);
  if (!ctx) throw new Error("useEstimate must be used within EstimateProvider");
  return ctx;
}
