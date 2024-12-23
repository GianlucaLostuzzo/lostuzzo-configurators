export interface NumericSelectorProps {
  id?: string;
  label: string;
  value: number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function NumericSelector(props: NumericSelectorProps) {
  const { id = "", label, value, onChange } = props;

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="block text-lg font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        type="number"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
      />
    </div>
  );
}
