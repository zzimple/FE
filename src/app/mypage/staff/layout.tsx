import TabHeader, { Tab } from "@/components/common/TabHeader";

const ownerTabs: Tab[] = [
  { label: "나의 스케줄", href: "/mypage/staff/schedule" },
  { label: "나의 정보", href: "/mypage/staff/profile" },
];

export default function OwnerLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <TabHeader tabs={ownerTabs} />
      <div className="px-4 py-6">{children}</div>
    </div>
  )
}

