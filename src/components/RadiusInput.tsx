"use client";

type Props = {
  value: string;
  error: string;
  isDirty: boolean;
  onChange: (value: string) => void;
};

export default function RadiusInput({ value, error, isDirty, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">半径</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="例: 3.2"
          className="w-32 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-600">km</span>
      </div>
      {isDirty && error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
