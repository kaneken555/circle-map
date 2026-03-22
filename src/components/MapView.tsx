"use client";

import { useMemo, useState } from "react";
import { Map, MapMouseEvent, AdvancedMarker, Marker, useMap } from "@vis.gl/react-google-maps";
import { INITIAL_CENTER, INITIAL_ZOOM_MOBILE, INITIAL_ZOOM_PC, PC_BREAKPOINT } from "@/constants/map";
import { LatLng } from "@/types";
import MapCircle from "./MapCircle";

export const MAP_ID = "circle-map-main";

const googleMapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

type Props = {
  centerPoint: LatLng | null;
  validRadiusKm: number | null;
  onMapClick: (latLng: LatLng) => void;
  onCurrentLocation: (latLng: LatLng) => void;
};

export default function MapView({ centerPoint, validRadiusKm, onMapClick, onCurrentLocation }: Props) {
  const map = useMap(MAP_ID);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");

  const initialZoom = useMemo(() => {
    if (typeof window === "undefined") return INITIAL_ZOOM_MOBILE;
    return window.innerWidth >= PC_BREAKPOINT ? INITIAL_ZOOM_PC : INITIAL_ZOOM_MOBILE;
  }, []);

  const handleClick = (e: MapMouseEvent) => {
    if (!e.detail.latLng) return;
    onMapClick({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocateError("位置情報がサポートされていません");
      return;
    }
    setLocating(true);
    setLocateError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latLng = { lat: position.coords.latitude, lng: position.coords.longitude };
        onCurrentLocation(latLng);
        map?.panTo(latLng);
        map?.setZoom(12);
        setLocating(false);
      },
      () => {
        setLocateError("位置情報を取得できませんでした");
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="relative w-full h-full">
      <Map
        id={MAP_ID}
        mapId={googleMapId}
        defaultCenter={INITIAL_CENTER}
        defaultZoom={initialZoom}
        gestureHandling="greedy"
        onClick={handleClick}
        style={{ width: "100%", height: "100%" }}
      >
        {centerPoint && (
          googleMapId
            ? <AdvancedMarker position={centerPoint} />
            : <Marker position={centerPoint} />
        )}
        {centerPoint && validRadiusKm !== null && (
          <MapCircle center={centerPoint} radiusKm={validRadiusKm} />
        )}
      </Map>

      <div className="absolute bottom-6 right-3 flex flex-col items-end gap-1">
        {locateError && (
          <p className="text-xs text-white bg-red-500 rounded px-2 py-1 max-w-44 text-right">
            {locateError}
          </p>
        )}
        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={locating}
          className="w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
          aria-label="現在地を取得"
        >
          {locating ? (
            <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="currentColor" stroke="none" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
