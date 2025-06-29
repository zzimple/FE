// app/providers.tsx
"use client";

import { ReactNode, useState, useEffect } from "react";
import { RoleContext } from "@/context/RoleContext";

export function Providers({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch("/users/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => setRole(data.role))
      .catch(() => setRole(null));
  }, []);

  return (
    <RoleContext.Provider value={role}>
      {children}
    </RoleContext.Provider>
  );
}
