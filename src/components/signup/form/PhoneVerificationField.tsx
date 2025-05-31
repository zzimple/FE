import api from "@/lib/axios";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

interface PhoneVerificationProps {
  phone: string;
  setPhone: (value: string) => void;
  code: string;
  setCode: (value: string) => void;
  onSMSSent?: () => void;
  setIsVerified?: (verified: boolean) => void;
}

export default function PhoneVerificationField({
  phone,
  setPhone,
  code,
  setCode,
  onSMSSent,
}: PhoneVerificationProps) {
  // 에러 메시지 상태 추가
  const [phoneError, setPhoneError] = useState(""); // 전화번호 입력 오류
  const [codeError, setCodeError] = useState(""); // 인증번호 입력 오류류
  const [smsSentMessage, setSmsSentMessage] = useState(""); // 인증번호 전송 메시지 상태
  const [verificationMessage, setVerificationMessage] = useState(""); // 인증번호 전송 메시지 상태
  const [isSending, setIsSending] = useState(false); // 인증번호 전송 중 상태

  const [timeLeft, setTimeLeft] = useState(0); // 남은 시간 (초)
  const timerId = useRef<NodeJS.Timeout | null>(null);

  const [isVerified, setIsVerified] = useState(false);

  // 전화번호 유효성 검사 함수
  const isValidPhone = (phone: string) => /^010-\d{3,4}-\d{4}$/.test(phone);

  // 자동 하이픈 포매팅 함수
  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, ""); // 숫자만 추출
    if (digitsOnly.length <= 3) return digitsOnly;
    if (digitsOnly.length <= 7)
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(
      3,
      7
    )}-${digitsOnly.slice(7, 11)}`;
  };

  // 타이머 로직
  useEffect(() => {
    if (timeLeft <= 0 && timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
      setSmsSentMessage("⏰ 인증 시간이 만료되었습니다.");
    }
  }, [timeLeft]);

  const handleSendSMS = async () => {
    if (!phone) {
      setPhoneError("전화번호를 입력해주세요.");
      return;
    }

    if (!isValidPhone(phone)) {
      setPhoneError("전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678");
      return;
    }

    setPhoneError("");
    setSmsSentMessage("");
    setIsSending(true);

    // 이전 타이머 제거 후 새 타이머 설정
    if (timerId.current) clearInterval(timerId.current);
    setTimeLeft(180); // 3분
    timerId.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && timerId.current) {
          clearInterval(timerId.current);
          timerId.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      await api.post("/sms/signup-code", { phone });
      setSmsSentMessage("인증번호가 전송되었습니다.");
      onSMSSent?.();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        // 서버가 응답했지만 인증번호 요청 실패
        if (status === 429) {
          setSmsSentMessage(
            "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요."
          );
        } else if (status === 500) {
          setSmsSentMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
        } else {
          setSmsSentMessage(message || "SMS 전송에 실패했습니다.");
        }
      } else {
        // 네트워크 오류 등 비정상 상황
        setSmsSentMessage(
          "알 수 없는 오류가 발생했습니다. 인터넷 연결을 확인해주세요."
        );
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    try {
      await api.post("/sms/signup-code/verify", { phone, code });
      setVerificationMessage("인증이 완료되었습니다.");
      setCodeError("");
      setIsVerified?.(true);
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = null;
      }
      setTimeLeft(0);
    } catch (err) {
      setVerificationMessage("");

      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        console.log("status:", status);
        console.log("message:", message);

        // 인증번호 만료
        if (status === 410) {
          setCodeError("인증번호가 만료되었습니다. 다시 요청해주세요.");
        }
        // 인증번호 틀림
        if (status === 400) {
          setCodeError("인증번호가 올바르지 않습니다.");
        }
        // 서버 에러
        else if (status === 500) {
          setCodeError("서버 오류가 발생했습니다. 다시 시도해주세요.");
        }
        // 기타
        else {
          setCodeError(message || "인증에 실패했습니다.");
        }
      } else {
        setCodeError("예상치 못한 오류가 발생했습니다.");
      }
    }
  };

  // 남은 시간 포맷
  const formatTime = (seconds: number) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <>
      <div className="space-y-2">
        <div className="space-y-2 mb-1">
          <p className="text-sm font-bold">휴대전화 번호</p>
          <div className="relative w-full">
            <input
              type="tel"
              placeholder="-없이 입력"
              value={phone}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value); // 자동 하이픈 포맷
                setPhone(formatted);
                setSmsSentMessage("");

                if (!isValidPhone(formatted)) {
                  setPhoneError(
                    "전화번호를 정확히 입력해주세요. 예: 010-1234-5678"
                  );
                } else {
                  setPhoneError("");
                }
              }}
              className={`w-full h-14 px-5 rounded-full border text-sm ${
                phoneError ? "border-red-500" : "border-[#B3B3B3]"
              }`}
            />
            <button
              type="button"
              onClick={handleSendSMS}
              className="absolute top-1/2 right-4 -translate-y-1/2 h-[32px] px-4 rounded-full bg-[#DBEBFF] text-sm font-bold"
            >
              인증
            </button>
          </div>
        </div>
        {/* 메시지 영역 (전송 성공 or 에러) */}
        {smsSentMessage ? (
          <p className="text-red-500 text-xs pl-2">
            {smsSentMessage} {timeLeft > 0 && ` (${formatTime(timeLeft)})`}
          </p>
        ) : (
          phoneError && (
            <p className="text-red-500 text-xs pl-2">{phoneError}</p>
          )
        )}
      </div>

      <div className="space-y-2 mb-1">
        <p className="text-sm font-bold">인증번호</p>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="인증번호 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-14 px-5 rounded-full border border-[#B3B3B3] text-sm"
          />
          <button
            type="button"
            onClick={handleVerifyCode}
            className="absolute top-1/2 right-4 -translate-y-1/2 h-[32px] px-4 rounded-full bg-[#DBEBFF] text-sm font-bold"
          >
            확인
          </button>
        </div>
      </div>

      {/* 인증 메시지 표시 */}
      {verificationMessage && (
        <p className="text-green-600 text-xs pl-2">{verificationMessage}</p>
      )}
      {codeError && <p className="text-red-500 text-xs pl-2">{codeError}</p>}
    </>
  );
}
