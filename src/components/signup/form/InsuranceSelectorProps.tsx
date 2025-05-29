interface InsuranceSelectorProps {
  insurance: string;
  setInsurance: (value: "yes" | "no") => void;
}

export default function InsuranceSelector({ insurance, setInsurance }: InsuranceSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-bold">보험 가입 여부</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setInsurance("yes")}
          className={`w-full h-14 rounded-full border text-sm ${insurance === "yes" ? "bg-blue-200" : ""}`}
        >
          가입
        </button>
        <button
          type="button"
          onClick={() => setInsurance("no")}
          className={`w-full h-14 rounded-full border text-sm ${insurance === "no" ? "bg-blue-200" : ""}`}
        >
          미가입
        </button>
      </div>
    </div>
  );
}
