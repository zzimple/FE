"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SignupHeader from "@/components/signup/SignupHeader";
import InputField from "@/components/signup/form/InputField";
import PhoneVerificationField from "@/components/signup/form/PhoneVerificationField";
import TermsAgreement from "@/components/signup/form/TermsAgreementProps";
import ToggleButtonGroup from "@/components/common/ToggleButtonGroup";
import { publicApi as api } from "@/lib/axios";
import axios from "axios";

type UserRole = "GUEST" | "STAFF";

export default function UserSignupPage() {
  const router = useRouter();

  // 기본 상태 변수들
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");

  // 약관 동의 상태
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreePromo, setAgreePromo] = useState(false);

  // 에러 상태
  const [passwordMismatchError, setPasswordMismatchError] = useState("");
  const [emailError, setEmailError] = useState("");

  // 비밀번호 유효성 검사 상태
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // 이메일 유효성 검사
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 비밀번호 유효성 검사 함수
  const validatePassword = (pwd: string) => {
    setPasswordValidation({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    });
  };

  // 비밀번호 변경 시 유효성 검사
  useEffect(() => {
    validatePassword(password);
  }, [password]);

  // 비밀번호 확인 검사
  useEffect(() => {
    if (!passwordConfirm) {
      setPasswordMismatchError("");
    } else if (password !== passwordConfirm) {
      setPasswordMismatchError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMismatchError("");
    }
  }, [password, passwordConfirm]);

  // 회원가입 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userRole) {
      alert("회원 유형을 선택해주세요.");
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    const payload = {
      userRole,
      userName,
      phoneNumber,
      password,
      email,
    };

    try {
      await api.post("/user/register", payload);
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
    <main className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 py-4 sm:py-6 md:py-8 bg-white">
      <div className="w-full max-w-[320px] sm:max-w-md md:max-w-lg mb-4 sm:mb-6 md:mb-8">
        <SignupHeader title="회원가입" currentStep={1} />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-[320px] sm:max-w-md md:max-w-lg">
        <div className="space-y-4 sm:space-y-5">
          {/* 회원 유형 선택 */}
          <ToggleButtonGroup<UserRole>
            label="회원 유형 선택"
            options={[
              { value: "GUEST", label: "고객" },
              { value: "STAFF", label: "직원" }
            ]}
            value={userRole}
            onChange={setUserRole}
            className="mb-3 sm:mb-4"
          />

          {/* 이름 */}
          <div className="mb-3 sm:mb-4">
            <InputField 
              label="이름"
              value={userName}
              onChange={setUserName} 
            />
          </div>

          {/* 전화번호 + 인증번호*/}
          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
            <PhoneVerificationField
              phone={phoneNumber}
              setPhone={setPhoneNumber}
              code={code}
              setCode={setCode}
              onSMSSent={() => { }}
              setIsVerified={() => { }}
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="mb-3 sm:mb-4">
            <InputField
              label="비밀번호"
              type="password"
              value={password}
              onChange={setPassword}
            />
            {/* 비밀번호 조건 체크리스트 */}
            <div className="mt-2 space-y-1 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${passwordValidation.length ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={`text-xs ${passwordValidation.length ? 'text-green-500' : 'text-gray-500'}`}>
                  8자 이상
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${passwordValidation.uppercase ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={`text-xs ${passwordValidation.uppercase ? 'text-green-500' : 'text-gray-500'}`}>
                  대문자 포함
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${passwordValidation.lowercase ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={`text-xs ${passwordValidation.lowercase ? 'text-green-500' : 'text-gray-500'}`}>
                  소문자 포함
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${passwordValidation.number ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={`text-xs ${passwordValidation.number ? 'text-green-500' : 'text-gray-500'}`}>
                  숫자 포함
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${passwordValidation.special ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={`text-xs ${passwordValidation.special ? 'text-green-500' : 'text-gray-500'}`}>
                  특수문자 포함
                </span>
              </div>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="mb-3 sm:mb-4">
            <InputField
              label="비밀번호 확인"
              type="password"
              value={passwordConfirm}
              onChange={setPasswordConfirm}
            />
            {passwordMismatchError && (
              <p className="text-red-500 text-xs mt-2 pl-2">{passwordMismatchError}</p>
            )}
          </div>

          {/* 이메일 입력 (선택) */}
          <div className="mb-3 sm:mb-4">
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
              <p className="text-red-500 text-xs mt-2 pl-2">{emailError}</p>
            )}
          </div>

          {/* 약관 동의 그룹 */}
          <div className="mb-5 sm:mb-6">
            <TermsAgreement
              agreeTerms={agreeTerms}
              setAgreeTerms={setAgreeTerms}
              agreePrivacy={agreePrivacy}
              setAgreePrivacy={setAgreePrivacy}
              agreePromo={agreePromo}
              setAgreePromo={setAgreePromo}
            />
          </div>

          {/* 회원가입 완료 버튼 */}
          <button
            type="submit"
            className="w-full h-11 sm:h-12 rounded-full bg-[#2948FF] text-white text-sm sm:text-base font-medium hover:bg-[#1E3AD7] active:bg-[#152BA8] transition-colors"
          >
            회원가입 완료
          </button>
        </div>
      </form>
    </main>
  );
} 