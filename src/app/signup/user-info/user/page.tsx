"use client";

import { useState } from "react";
import api from "@/lib/api";
import SignupHeader from "@/components/signup/SignupHeader";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UserSignupPage() {
  const router = useRouter();

  const [userName, setuserName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [loginId, setloginId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [memberType, setMemberType] = useState<"guest" | "staff" | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreePromo, setAgreePromo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms || !agreePrivacy) return alert("필수 약관에 동의해주세요.");
    if (password !== passwordConfirm)
      return alert("비밀번호가 일치하지 않습니다.");
    if (!memberType) return alert("회원 유형을 선택해주세요.");

    const payload = {
      userName,
      phone: phoneNumber,
      loginId,
      password,
      email,
      memberType,
    };

    try {
      await api.post("/auth/signup/customer", payload);
      router.push("/signup/signup-complete");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "회원가입에 실패했습니다.");
      } else {
        alert("예상치 못한 오류가 발생했습니다.");
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4">
      <SignupHeader title="회원가입" currentStep={1} />
      {/* 이름, 전화번호, 아이디, 비밀번호 등 기존 폼 복붙 후 회원 유형 선택만 유지 */}
      {/* 약관 동의 및 제출 버튼 포함 */}
    </main>
  );
}
