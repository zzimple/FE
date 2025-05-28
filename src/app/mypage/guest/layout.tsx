import TabHeader, { Tab } from "@/components/common/TabHeader";

const ownerTabs: Tab[] = [
  { label: "나의 견적서", href: "/mypage/guest/estimate" },
  { label: "나의 정보", href: "/mypage/guest/profile" },
];

export default function OwnerLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <TabHeader tabs={ownerTabs} />
      <div className="px-4 py-6">{children}</div>
    </div>
  )
}

