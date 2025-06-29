"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SignupHeader from "@/components/signup/SignupHeader";
import InputField from "@/components/signup/form/InputField";
import PhoneVerificationField from "@/components/signup/form/PhoneVerificationField";
import TermsAgreement from "@/components/signup/form/TermsAgreementProps";
import AddressSearchButton from "@/components/common/AddressSearchButton";
import { publicApi as api } from "@/lib/axios";
import axios from "axios";
import ToggleButtonGroup from "@/components/common/ToggleButtonGroup";

// 비밀번호 유효성 검사 함수를 컴포넌트 외부로 이동
const validatePassword = (password: string) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
};

// 모든 비밀번호 조건이 만족되었는지 확인하는 함수
const isPasswordValid = (validations: ReturnType<typeof validatePassword>) => {
  return Object.values(validations).every(Boolean);
};

export default function OwnerSignupPage() {
  const router = useRouter();

  // 기본 상태 변수들
  const [b_no, setB_no] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [insured, setInsured] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  // 가게 이름들
  const [storeName, setStoreName] = useState("");
  const [roadFullAddr, setRoadFullAddr] = useState("");
  const [roadAddrPart1, setRoadAddrPart1] = useState("");
  const [addrDetail, setAddrDetail] = useState("");
  const [zipNo, setZipNo] = useState("");

  // 약관 동의 상태
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreePromo, setAgreePromo] = useState(false);

  // 에러 상태
  const [passwordMismatchError, setPasswordMismatchError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordValidations, setPasswordValidations] = useState(() => validatePassword(""));

  const [checkResult, setCheckResult] = useState<null | boolean>(null);

  // 이메일 유효성 검사
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // URL에서 사업자번호 추출
  useEffect(() => {
    const bno = new URLSearchParams(window.location.search).get("bno");
    if (bno) {
      setB_no(bno);
    }
  }, []);

  useEffect(() => {
    // 비밀번호 유효성 검사
    const validations = validatePassword(password);
    setPasswordValidations(validations);

    // 비밀번호 일치 여부 검사
    if (!passwordConfirm) {
      setPasswordMismatchError("");
    } else if (password !== passwordConfirm) {
      setPasswordMismatchError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMismatchError("");
    }
  }, [password, passwordConfirm]);

  // 주소 검색 콜백
  useEffect(() => {
    (window as any).onJusoCallback = ({
      roadFullAddr,
      roadAddrPart1,
      addrDetail,
      zipNo,
    }: {
      roadFullAddr: string;
      zipNo: string;
      addrDetail: string;
      roadAddrPart1: string;
    }) => {
      setRoadFullAddr(roadFullAddr);
      setRoadAddrPart1(roadAddrPart1);
      setAddrDetail(addrDetail);
      setZipNo(zipNo);
    };
  }, []);

  // 회원가입 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 조건 검사
    const errors = [];

    // 0. 이름 검사
    if (!userName) {
      errors.push("이름을 입력해주세요.");
    }

    // 1. 전화번호 인증 검사
    if (!isVerified) {
      errors.push("전화번호 인증을 완료해주세요.");
    }

    // 2. 비밀번호 유효성 검사
    if (!isPasswordValid(passwordValidations)) {
      errors.push("비밀번호가 모든 조건을 만족하지 않습니다.");
    }

    // 3. 비밀번호 일치 검사
    if (password !== passwordConfirm) {
      errors.push("비밀번호가 일치하지 않습니다.");
    }

    // 4. 필수 약관 동의 검사
    if (!agreeTerms || !agreePrivacy) {
      errors.push("필수 약관에 동의해주세요.");
    }

    // 에러가 있으면 alert로 표시하고 제출 중단
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    const payload = {
      userName,
      phoneNumber,
      b_no,
      password,
      insured,
      storeName,
      roadFullAddr,
      roadAddrPart1,
      addrDetail,
      zipNo,
    };

    try {
      await api.post("/owner/register", payload);
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
    <main className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 py-4 sm:py-6 md:py-8 bg-white pt-12">
      <div className="w-full max-w-[320px] sm:max-w-md md:max-w-lg mb-4 sm:mb-6 md:mb-8">
        <SignupHeader title="회원가입" currentStep={1} />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-[320px] sm:max-w-md md:max-w-lg">
        <div className="space-y-4 sm:space-y-5">
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
              onSMSSent={() => {
                setIsVerified(true);
              }}
              setIsVerified={setIsVerified}
            />
          </div>

          {/* 아이디 필드 (사업자 번호로 고정) */}
          <div className="space-y-2">
            <div className="space-y-2 mb-1">
              <p className="text-sm font-bold">아이디 (사업자 등록번호)</p>
              <div className="relative w-full">
                <input
                  type="text"
                  value={b_no}
                  readOnly
                  className="w-full h-14 px-5 rounded-full border border-[#B3B3B3] bg-gray-100 text-sm sm:text-base text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* 비밀번호 입력 */}
          <div className="">
            <InputField
              label="비밀번호"
              type="password"
              value={password}
              onChange={setPassword}
            />
            <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 px-1">
              <p className="text-xs sm:text-sm text-gray-500">비밀번호 조건:</p>
              <div className={`flex items-center gap-2 text-xs sm:text-sm ${passwordValidations.length ? "text-green-600" : "text-gray-400"}`}>
                <span>{passwordValidations.length ? "✓" : "○"}</span>
                <span>8자 이상</span>
              </div>
              <div className={`flex items-center gap-2 text-xs sm:text-sm ${passwordValidations.uppercase ? "text-green-600" : "text-gray-400"}`}>
                <span>{passwordValidations.uppercase ? "✓" : "○"}</span>
                <span>영문 대문자 포함</span>
              </div>
              <div className={`flex items-center gap-2 text-xs sm:text-sm ${passwordValidations.lowercase ? "text-green-600" : "text-gray-400"}`}>
                <span>{passwordValidations.lowercase ? "✓" : "○"}</span>
                <span>영문 소문자 포함</span>
              </div>
              <div className={`flex items-center gap-2 text-xs sm:text-sm ${passwordValidations.special ? "text-green-600" : "text-gray-400"}`}>
                <span>{passwordValidations.special ? "✓" : "○"}</span>
                <span>특수문자 포함</span>
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
              <p className="text-red-500 text-xs sm:text-sm mt-2 px-1">
                {passwordMismatchError}
              </p>
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
              <p className="text-red-500 text-xs sm:text-sm mt-2 px-1">{emailError}</p>
            )}
          </div>

          {/* 상호명 */}
          <div className="mb-3 sm:mb-4">
            <InputField
              label="상호명"
              type="text"
              value={storeName}
              onChange={setStoreName}
            />
          </div>

          {/* 주소 입력 그룹 */}
          <div className="mb-4 sm:mb-5">
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <p className="text-sm sm:text-base font-bold">가게 주소</p>
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="도로명 주소 입력"
                    value={roadFullAddr}
                    onChange={(e) => setRoadFullAddr(e.target.value)}
                    readOnly
                    className="w-full h-14 sm:h-14 px-5 rounded-full border border-[#B3B3B3] bg-gray-100 text-sm sm:text-base text-gray-500"
                  />
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    <AddressSearchButton
                      onAddressSelect={({ roadFullAddr, roadAddrPart1: roadAddrPart1, addrDetail, zipNo }) => {
                        console.log("📦 주소 전달 받음");
                        setRoadFullAddr(roadFullAddr);
                        setRoadAddrPart1(roadAddrPart1);
                        setAddrDetail(addrDetail);
                        setZipNo(zipNo);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm sm:text-base font-bold">주소</p>
                <input
                  type="text"
                  value={roadAddrPart1}
                  onChange={(e) => setRoadAddrPart1(e.target.value)}
                  readOnly
                  className="w-full h-14 sm:h-14 px-5 rounded-full border border-[#B3B3B3] bg-gray-100 text-sm sm:text-base text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm sm:text-base font-bold">상세 주소</p>
                <input
                  type="text"
                  value={addrDetail}
                  onChange={(e) => setAddrDetail(e.target.value)}
                  readOnly
                  className="w-full h-14 sm:h-14 px-5 rounded-full border border-[#B3B3B3] bg-gray-100 text-sm sm:text-base text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm sm:text-base font-bold">우편 번호</p>
                <input
                  type="text"
                  value={zipNo}
                  onChange={(e) => setZipNo(e.target.value)}
                  readOnly
                  className="w-full h-14 sm:h-14 px-5 rounded-full border border-[#B3B3B3] bg-gray-100 text-sm sm:text-base text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* 보험 가입 여부 선택 */}
          <ToggleButtonGroup<boolean>
            label="보험 가입 여부"
            options={[
              { value: true, label: "가입" },
              { value: false, label: "미가입" }
            ]}
            value={insured}
            onChange={setInsured}
            className="mb-4 sm:mb-5"
          />

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
            className={`w-full h-11 sm:h-12 rounded-full
            ${userName &&
            isVerified &&
            isPasswordValid(passwordValidations) &&
            password === passwordConfirm &&
            agreeTerms &&
            agreePrivacy &&
            insured
              ? "bg-[#2948FF] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } text-sm sm:text-base font-medium`}
          >
            회원가입 완료
          </button>
        </div>
      </form>
    </main>
  );
} 