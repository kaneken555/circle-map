"use client";

import { useRef, useState } from "react";
import { usePlaceSearch } from "@/hooks/usePlaceSearch";
import { LatLng } from "@/types";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSelect: (latLng: LatLng, name: string) => void;
};

export default function PlaceSearch({ value, onChange, onSelect }: Props) {
  const { candidates, isLoading, searchError, getPlaceLocation } = usePlaceSearch(value);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = async (placeId: string, name: string) => {
    setIsOpen(false);
    const location = await getPlaceLocation(placeId);
    if (location) {
      onChange(name);
      onSelect(location, name);
    }
  };

  const handleChange = (v: string) => {
    onChange(v);
    setIsOpen(true);
  };

  const showList = isOpen && value.length >= 2 && (candidates.length > 0 || isLoading);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">地点検索</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder="例: 東京駅、大阪城"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showList && (
          <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
            {isLoading && (
              <li className="px-3 py-2 text-sm text-gray-400">検索中...</li>
            )}
            {!isLoading &&
              candidates.map((c) => (
                <li
                  key={c.placeId}
                  onMouseDown={() => handleSelect(c.placeId, c.name)}
                  className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                >
                  {c.name}
                </li>
              ))}
          </ul>
        )}
      </div>
      {value.length >= 2 && !isLoading && !showList && candidates.length === 0 && !searchError && (
        <p className="text-xs text-gray-400">検索結果が見つかりませんでした</p>
      )}
      {searchError && (
        <p className="text-xs text-red-600">{searchError}</p>
      )}
    </div>
  );
}
