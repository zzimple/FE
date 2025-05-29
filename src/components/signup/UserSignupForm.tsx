// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import axios from "axios";
// import api from "@/lib/api";

// import SignupHeader from "@/components/signup/SignupHeader";
// import InputField from "@/components/signup/form/InputField";
// import PhoneVerificationField from "@/components/signup/form/PhoneVerificationField";
// import DualButtonSelector from "@/components/signup/form/DualButtonSelector";
// import TermsAgreement from "@/components/signup/form/TermsAgreement";

// interface Props {
//   userType: "customer" | "owner";
// }

// export default function UserSignupForm({ userType }: Props) {
//   const router = useRouter();

//   const [userName, setUserName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [certCode, setCertCode] = useState("");
//   const [loginId, setLoginId] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordConfirm, setPasswordConfirm] = useState("");
//   const [email, setEmail] = useState("");
//   const [insurance, setInsurance] = useState<"yes" | "no" | "">("");
//   const [memberType, setMemberType] = useState<"guest" | "staff" | null>(null);
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [agreePrivacy, setAgreePrivacy] = useState(false);
//   const [agreePromo, setAgreePromo] = useState(false);

//   interface SignupPayload {
//   userName: string;
//   phone: string;
//   loginId: string;
//   password: string;
//   email?: string;
//   insurance?: boolean;
//   memberType?: "guest" | "staff";
//   }
  
//   const handleTermsChange = (
//     field: "terms" | "privacy" | "promo",
//     value: boolean
//   ) => {
//     if (field === "terms") setAgreeTerms(value);
//     if (field === "privacy") setAgreePrivacy(value);
//     if (field === "promo") setAgreePromo(value);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!agreeTerms || !agreePrivacy)
//       return alert("필수 약관에 동의해주세요.");
//     if (password !== passwordConfirm)
//       return alert("비밀번호가 일치하지 않습니다.");

//     const payload: SignupPayload = {
//       userName,
//       phone: phoneNumber,
//       loginId,
//       password,
//       email,
//     };

//     if (userType === "owner") {
//       if (!insurance) return alert("보험가입 여부를 선택해주세요.");
//       payload.insurance = insurance === "yes";
//     }

//     if (userType === "customer") {
//       if (!memberType) return alert("회원 유형을 선택해주세요.");
//       payload.memberType = memberType;
//     }

//     try {
//       await api.post("/auth/signup", payload);
//       router.push("/signup/signup-complete");
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         alert(err.response?.data?.message || "회원가입에 실패했습니다.");
//       } else {
//         alert("예상치 못한 오류가 발생했습니다.");
//       }
//     }
//   };

//   return (
//     <main className="min-h-screen flex flex-col items-center px-4 py-10">
//       <SignupHeader title="회원가입" currentStep={1} />
//       <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-6">
//         <InputField
//           label="이름"
//           placeholder="이름 입력"
//           value={userName}
//           onChange={setUserName}
//         />
//         <PhoneVerificationField
//           phone={phoneNumber}
//           setPhone={setPhoneNumber}
//           code={certCode}
//           setCertCode={setCertCode}
//           onSendCode={() => alert("인증번호 전송")}
//           onVerifyCode={() => alert("인증번호 확인")}
//         />
//         <InputField
//           label="아이디"
//           placeholder="아이디 입력"
//           value={loginId}
//           onChange={setLoginId}
//         />
//         <InputField
//           label="비밀번호"
//           type="password"
//           placeholder="8자리 이상 영문자, 숫자, 특수문자 포함"
//           value={password}
//           onChange={setPassword}
//         />
//         <InputField
//           label="비밀번호 확인"
//           type="password"
//           placeholder="비밀번호 확인"
//           value={passwordConfirm}
//           onChange={setPasswordConfirm}
//         />
//         <InputField
//           label="이메일(선택)"
//           type="email"
//           placeholder="이메일 입력"
//           value={email}
//           onChange={setEmail}
//         />

//         {userType === "owner" && (
//           <DualButtonSelector
//             label="보험 가입 여부"
//             optionA="yes"
//             optionB="no"
//             selected={insurance}
//             onSelect={(v) => setInsurance(v as "yes" | "no")}
//           />
//         )}

//         {userType === "customer" && (
//           <DualButtonSelector
//             label="회원 유형 선택"
//             optionA="guest"
//             optionB="staff"
//             selected={memberType}
//             onSelect={(v) => setMemberType(v as "guest" | "staff")}
//           />
//         )}

//         <TermsAgreement
//           agreeTerms={agreeTerms}
//           agreePrivacy={agreePrivacy}
//           agreePromo={agreePromo}
//           onChange={handleTermsChange}
//         />

//         <button
//           type="submit"
//           className="w-full h-14 rounded-full bg-[#2948FF] text-white text-sm"
//         >
//           회원가입 완료
//         </button>
//       </form>
//     </main>
//   );
// }
