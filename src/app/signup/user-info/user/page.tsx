"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SignupHeader from "@/components/signup/SignupHeader";
import InputField from "@/components/signup/form/InputField";
import PhoneVerificationField from "@/components/signup/form/PhoneVerificationField";
import MemberTypeSelector from "@/components/signup/form/MemberTypeSelectorProps";
import TermsAgreement from "@/components/signup/form/TermsAgreementProps";
import api from "@/lib/api";
import axios from "axios";

export default function UserSignupPage() {
  const router = useRouter();

  const [loginId, setLoginId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState<"GUEST" | "STAFF" | null>(null);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreePromo, setAgreePromo] = useState(false);

  const [showTimer, setShowTimer] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);


  const [passwordMismatchError, setPasswordMismatchError] = useState("");
  const [emailError, setEmailError] = useState("");

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (!passwordConfirm) {
      setPasswordMismatchError("");
    } else if (password !== passwordConfirm) {
      setPasswordMismatchError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMismatchError("");
    }
  }, [password, passwordConfirm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms || !agreePrivacy)
      return alert("필수 약관에 동의해주세요.");

    if (!userRole)
      return alert("회원 유형을 선택해주세요.");

    const payload = {
      userName,
      phoneNumber,
      loginId,
      password,
      email,
      userRole: userRole,
    };

    try {
      await api.post("/users/register", payload);
      console.log("payload", payload);
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
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <SignupHeader title="회원가입" currentStep={1} />

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-6">

        {/* 이름 */}
        <InputField label="이름" value={userName} onChange={setUserName} />


        {/* 전화번호 + 인증번호*/}
        <PhoneVerificationField
          phone={phoneNumber}
          setPhone={setPhoneNumber}
          code={code}
          setCode={setCode}
          onSMSSent={() => {
            setSmsSent(true);
            setShowTimer(true);
          }}
          setIsVerified={setIsVerified}
        />

        {/* 아이디 입력력 */}
        <InputField label="아이디" value={loginId} onChange={setLoginId} />

        {/* 비밀번호 입력 */}
        <InputField label="비밀번호" type="password" value={password} onChange={setPassword} />

        {/* 비밀번호 확인 */}
        <InputField label="비밀번호 확인"
          type="password"
          value={passwordConfirm}
          onChange={setPasswordConfirm}
        />

        {passwordMismatchError && (
          <p className="text-red-500 text-xs pl-2">{passwordMismatchError}</p>
        )}

        {/* 이메일 입력 (선택) */}
        <InputField
          label="이메일(선택)"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            if (value && !isValidEmail(value)) {
              setEmailError("올바른 이메일 형식이 아닙니다.");
            } else {
              setEmailError("");
            }
          }}
        />

        {emailError && (
          <p className="text-red-500 text-xs pl-2">{emailError}</p>
        )}
        {/* 회원 유형 선택: 고객 / 직원 */}
        <MemberTypeSelector userRole={userRole} setUserRole={setUserRole} />


        {/* 약관 동의 항목들 */}
        <TermsAgreement
          agreeTerms={agreeTerms}
          setAgreeTerms={setAgreeTerms}
          agreePrivacy={agreePrivacy}
          setAgreePrivacy={setAgreePrivacy}
          agreePromo={agreePromo}
          setAgreePromo={setAgreePromo}
        />

        {/* 📩 회원가입 완료 버튼 */}
        <button type="submit" className="w-full h-14 rounded-full bg-[#2948FF] text-white text-sm">
          회원가입 완료
        </button>
      </form>
    </main>
  );
}