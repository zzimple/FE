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
        className={`w-full h-14 px-5 rounded-full border text-sm transition focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400
          ${value ? "border-blue-600" : "border-gray-300"}`}
      />
      {children}
    </div>
  );
}
