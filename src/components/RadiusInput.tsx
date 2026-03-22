"use client";

const MIN_RADIUS = 0.1;
const MAX_RADIUS = 200;
const STEP = 0.1;

type Props = {
  value: string;
  error: string;
  isDirty: boolean;
  onChange: (value: string) => void;
};

export default function RadiusInput({ value, error, isDirty, onChange }: Props) {
  const handleStep = (direction: 1 | -1) => {
    const current = parseFloat(value);
    const base = isNaN(current) ? 0 : current;
    const next = Math.round((base + direction * STEP) * 10) / 10;
    const clamped = Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, next));
    onChange(String(clamped));
  };

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
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => handleStep(1)}
            className="px-2 py-0.5 text-xs border border-gray-300 rounded-t bg-gray-50 hover:bg-gray-100 leading-none"
            aria-label="半径を増やす"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={() => handleStep(-1)}
            className="px-2 py-0.5 text-xs border-x border-b border-gray-300 rounded-b bg-gray-50 hover:bg-gray-100 leading-none"
            aria-label="半径を減らす"
          >
            ▼
          </button>
        </div>
        <span className="text-sm text-gray-600">km</span>
      </div>
      {isDirty && error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
