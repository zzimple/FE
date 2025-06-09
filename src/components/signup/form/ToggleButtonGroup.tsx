interface ToggleOption<T> {
  value: T;
  label: string;
}

interface ToggleButtonGroupProps<T> {
  label: string;
  options: ToggleOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  className?: string;
}

export default function ToggleButtonGroup<T>({
  label,
  options,
  value,
  onChange,
  className = ""
}: ToggleButtonGroupProps<T>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-sm font-bold">{label}</p>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.value)}
            className={`w-full h-14 rounded-full border text-sm ${
              value === option.value
                ? "bg-blue-200"
                : ""
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
} 