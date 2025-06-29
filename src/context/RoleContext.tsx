// src/context/RoleContext.tsx
import { createContext } from "react";

// null은 아직 로딩 중인 상태를 표시
export const RoleContext = createContext<string | null>(null);
