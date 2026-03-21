"use client";

import { LatLng } from "@/types";

type Props = {
  centerPoint: LatLng | null;
  validRadiusKm: number | null;
};

export default function InfoPanel({ centerPoint, validRadiusKm }: Props) {
  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">現在の設定</p>
      <div className="flex flex-col gap-1 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="text-gray-500">緯度</span>
          <span className="font-mono">
            {centerPoint ? centerPoint.lat.toFixed(6) : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">経度</span>
          <span className="font-mono">
            {centerPoint ? centerPoint.lng.toFixed(6) : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">半径</span>
          <span className="font-mono">
            {validRadiusKm !== null ? `${validRadiusKm} km` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
