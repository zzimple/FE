interface TermsAgreementProps {
  agreeTerms: boolean;
  setAgreeTerms: (value: boolean) => void;
  agreePrivacy: boolean;
  setAgreePrivacy: (value: boolean) => void;
  agreePromo: boolean;
  setAgreePromo: (value: boolean) => void;
}

export default function TermsAgreement({ agreeTerms, setAgreeTerms, agreePrivacy, setAgreePrivacy, agreePromo, setAgreePromo }: TermsAgreementProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm">
        <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
        <span>[필수] 이용약관 동의</span>
      </label>
      <label className="flex items-center space-x-2 text-sm">
        <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} />
        <span>[필수] 개인정보 수집 및 이용동의</span>
      </label>
      <label className="flex items-center space-x-2 text-sm">
        <input type="checkbox" checked={agreePromo} onChange={(e) => setAgreePromo(e.target.checked)} />
        <span>[선택] 이벤트 및 할인쿠폰 등 혜택/정보 수신</span>
      </label>
    </div>
  );
}