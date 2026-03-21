"use client";

import PlaceSearch from "./PlaceSearch";
import RadiusInput from "./RadiusInput";
import { LatLng } from "@/types";

type Props = {
  searchText: string;
  radiusInput: string;
  radiusError: string;
  isRadiusDirty: boolean;
  onSearchChange: (value: string) => void;
  onPlaceSelect: (latLng: LatLng, name: string) => void;
  onRadiusChange: (value: string) => void;
  onClear: () => void;
};

export default function ControlPanel({
  searchText,
  radiusInput,
  radiusError,
  isRadiusDirty,
  onSearchChange,
  onPlaceSelect,
  onRadiusChange,
  onClear,
}: Props) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white">
      <PlaceSearch
        value={searchText}
        onChange={onSearchChange}
        onSelect={onPlaceSelect}
      />
      <RadiusInput
        value={radiusInput}
        error={radiusError}
        isDirty={isRadiusDirty}
        onChange={onRadiusChange}
      />
      <button
        onClick={onClear}
        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded border border-gray-300 transition-colors"
      >
        クリア
      </button>
    </div>
  );
}
