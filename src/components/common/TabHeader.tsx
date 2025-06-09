// components/common/TabHeader.tsx
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

export interface Tab {
  label: string;
  href: string;
}

interface Props {
  tabs: Tab[];
}
export default function TabHeader({ tabs }: Props) {
  const pathname = usePathname();
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <nav className="flex items-center justify-center h-14 gap-6 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`text-sm font-medium transition ${
                isActive
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
