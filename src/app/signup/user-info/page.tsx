"use client";

import api from "@/lib/axios";
import { useState } from "react";
import SignupHeader from "../../../components/signup/SignupHeader";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function SignupInfoPage() {
  const params = useSearchParams();
  const userType = params.get("type"); // 'owner' | 'guest'
  const router = useRouter();

  // 상태 선언
  const [userName, setuserName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [certCode, setcertCode] = useState("");
  const [loginId, setloginId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [insurance, setInsurance] = useState(""); // 'yes' | 'no'
  const [memberType, setMemberType] = useState<"guest" | "staff" | null>(null);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreePromo, setAgreePromo] = useState(false);

  interface SignupPayload {
    userName: string;
    phone: string;
    loginId: string;
    password: string;
    email?: string;
    insurance?: boolean;
    memberType?: "guest" | "staff";
  }

  // 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms || !agreePrivacy) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const payload: SignupPayload = {
      userName: userName,
      phone: phoneNumber,
      loginId,
      password,
    };

    if (email) payload.email = email;

    if (userType === "owner") {
      if (!insurance) {
        alert("보험가입 여부를 선택해주세요.");
        return;
      }
      payload.insurance = insurance === "yes";
    } else {
      if (!memberType) {
        alert("회원 유형을 선택해주세요.");
        return;
      }
      payload.memberType = memberType;
    }

    try {
      await api.post("/auth/signup", payload);
      router.push("/signup/signup-complete");
    } catch (err: unknown) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "회원가입에 실패했습니다.");
      } else {
        alert("예상치 못한 오류가 발생했습니다.");
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <SignupHeader title="회원가입" currentStep={1} />
      <div className="w-full max-w-xs space-y-6">
        {/* 이름 */}
        <div className="space-y-2">
          <p className="text-sm font-bold">이름</p>
          <input
            type="text"
            placeholder="이름 입력"
            value={userName}
            onChange={(e) => setuserName(e.target.value)}
            className="w-full h-14 px-5 rounded-full border border-[#B3B3B3] text-sm"
          />
        </div>

        {/* 전화번호 */}
        <div className="space-y-2">
          <p className="text-sm font-bold">휴대전화 번호</p>
          <div className="relative w-full">
            <input
              type="tel"
              placeholder="-없이 입력"
              value={phoneNumber}
              onChange={(e) => setphoneNumber(e.target.value)}
              className="w-full h-14 px-5 rounded-full border border-[#B3B3B3] text-sm"
            />
            <button className="absolute top-1/2 right-4 -translate-y-1/2 h-[32px] px-4 rounded-full bg-[#DBEBFF] text-sm font-bold">
              인증
            </button>
          </div>
        </div>

        {/* 인증번호 */}
        <div className="space-y-2">
          <p className="text-sm font-bold">인증번호 입력</p>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="인증번호 입력"
              value={certCode}
              onChange={(e) => setcertCode(e.target.value)}
              className="w-full h-14 px-5 rounded-full border border-[#B3B3B3] text-sm"
            />
            <button className="absolute top-1/2 right-4 -translate-y-1/2 h-[32px] px-4 rounded-full bg-[#DBEBFF] text-sm font-bold">
              확인
            </button>
          </div>
        </div>

        {/* 아이디 */}
        <div className="space-y-2">
          <p className="text-sm font-bold">아이디</p>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="아이디 입력"
              value={loginId}
              onChange={(e) => setuserName(e.target.value)}
              className="w-full h-14 px-5 rounded-full border border-[#B3B3B3] text-sm"
            />
            <button className="absolute top-1/2 right-4 -translate-y-1/2 h-[32px] px-4 rounded-full bg-[#DBEBFF] text-sm font-bold">
              중복 확인
            </button>
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="space-y-2">
          <p className="text-sm font-bold">비밀번호</p>
          <input
            type="password"
            placeholder="8자리 이상 영문자, 숫자, 특수문자 포함"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 px-5 rounded-full border border-[#B3B3B3] text-sm"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="space-y-2">
          <p className="text-sm font-bold">비밀번호 확인</p>
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full h-14 px-5 rounded-full border border-[#B3B3B3] text-sm"
          />
        </div>

        {/* 이메일 */}
        <div className="space-y-2">
          <p className="text-sm font-bold">이메일(선택)</p>
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 px-5 rounded-full border border-[#B3B3B3] text-sm"
          />
        </div>

        {/* 보험 여부 (사장님 전용) */}
        {userType === "owner" && (
          <div className="space-y-2">
            <p className="text-sm font-bold">보험 가입 여부</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInsurance("yes")}
                className={`w-full h-14 rounded-full border text-sm ${
                  insurance === "yes" ? "bg-blue-200" : ""
                }`}
              >
                가입
              </button>
              <button
                type="button"
                onClick={() => setInsurance("no")}
                className={`w-full h-14 rounded-full border text-sm ${
                  insurance === "no" ? "bg-blue-200" : ""
                }`}
              >
                미가입
              </button>
            </div>
          </div>
        )}

        {/* 고객/직원 선택 */}
        {userType === "customer" && (
          <div className="space-y-2">
            <p className="text-sm font-bold">회원 유형 선택</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMemberType("guest")}
                className={`w-full h-14 rounded-full border text-sm ${
                  memberType === "guest" ? "bg-blue-200" : ""
                }`}
              >
                고객
              </button>
              <button
                type="button"
                onClick={() => setMemberType("staff")}
                className={`w-full h-14 rounded-full border text-sm ${
                  memberType === "staff" ? "bg-blue-200" : ""
                }`}
              >
                직원
              </button>
            </div>
          </div>
        )}

        {/* 약관 동의 */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span>[필수] 이용약관 동의</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
            />
            <span>[필수] 개인정보 수집 및 이용동의</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={agreePromo}
              onChange={(e) => setAgreePromo(e.target.checked)}
            />
            <span>[선택] 이벤트 및 할인쿠폰 등 혜택/정보 수신</span>
          </label>
        </div>

        {/* 회원가입 버튼 */}
        <button
          onClick={handleSubmit}
          className="w-full h-14 rounded-full border bg-[#2948FF] text-white text-sm"
        >
          회원가입 완료
        </button>
      </div>
    </main>
  );
}
