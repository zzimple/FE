// 모달 레이아웃 ( 배경 + 가운데 정렬 등)
import { ReactNode, useEffect } from "react";

interface ModalWrapperProps {
  children: ReactNode;
}

const ModalWrapper = ({ children }: ModalWrapperProps) => {
  // 모달 열렸을 때 배경 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl overflow-y-auto max-h-[90vh]">
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;