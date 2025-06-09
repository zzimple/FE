import ToggleButtonGroup from "../common/ToggleButtonGroup";

type UserRole = "GUEST" | "STAFF";

interface MemberTypeSelectorProps {
  userRole: UserRole | null;
  setUserRole: (value: UserRole) => void;
}

export default function MemberTypeSelector({ 
  userRole: memberType, 
  setUserRole: setMemberType 
}: MemberTypeSelectorProps) {
  return (
    <ToggleButtonGroup<UserRole>
      label="회원 유형 선택"
      options={[
        { value: "GUEST", label: "고객" },
        { value: "STAFF", label: "직원" }
      ]}
      value={memberType}
      onChange={setMemberType}
    />
  );
} 