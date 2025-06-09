interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  children,
}: InputFieldProps) {
  return (
    <div className="space-y-2 mb-1">
      <p className="text-sm font-bold">{label}</p>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 px-5 rounded-full border border-[#B3B3B3] text-sm focus:outline-none focus:border-[#B3B3B3] focus:ring-1 focus:ring-[#B3B3B3]"
      />
      {children}
    </div>
  );
}
