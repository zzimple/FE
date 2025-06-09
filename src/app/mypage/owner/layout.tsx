import TabHeader, { Tab } from "@/components/common/TabHeader";

const ownerTabs: Tab[] = [
  { label: '견적서', href: '/mypage/owner/estimates' },
  { label: '나의 가게 관리', href: '/mypage/owner/shop' },
  { label: '매출 관리', href: '/mypage/owner/sales' },
  { label: '나의 정보', href: '/mypage/owner/profile' },
];

export default function OwnerLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <TabHeader tabs={ownerTabs} />
      <div className="px-4 py-6">{children}</div>
    </div>
  )
}

