"use client";

import { useState, useCallback } from "react";
import { APIProvider, useMap } from "@vis.gl/react-google-maps";
import Header from "@/components/Header";
import ControlPanel from "@/components/ControlPanel";
import MapView, { MAP_ID } from "@/components/MapView";
import InfoPanel from "@/components/InfoPanel";
import { validateRadius } from "@/hooks/useRadiusValidation";
import { INITIAL_CENTER, INITIAL_ZOOM_MOBILE, INITIAL_ZOOM_PC, PC_BREAKPOINT } from "@/constants/map";
import { LatLng } from "@/types";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

function AppContent() {
  const map = useMap(MAP_ID);

  const [centerPoint, setCenterPoint] = useState<LatLng | null>(null);
  const [radiusInput, setRadiusInput] = useState("");
  const [validRadiusKm, setValidRadiusKm] = useState<number | null>(null);
  const [radiusError, setRadiusError] = useState("");
  const [isRadiusDirty, setIsRadiusDirty] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleMapClick = useCallback((latLng: LatLng) => {
    setCenterPoint(latLng);
  }, []);

  const handlePlaceSelect = useCallback((latLng: LatLng, name: string) => {
    setCenterPoint(latLng);
    setSearchText(name);
    map?.panTo(latLng);
  }, [map]);

  const handleRadiusChange = useCallback((value: string) => {
    setRadiusInput(value);
    setIsRadiusDirty(true);
    const { error, validValue } = validateRadius(value);
    setRadiusError(error);
    setValidRadiusKm(validValue);
  }, []);

  const handleClear = useCallback(() => {
    setCenterPoint(null);
    setRadiusInput("");
    setValidRadiusKm(null);
    setRadiusError("");
    setIsRadiusDirty(false);
    setSearchText("");
    const zoom = window.innerWidth >= PC_BREAKPOINT ? INITIAL_ZOOM_PC : INITIAL_ZOOM_MOBILE;
    map?.panTo(INITIAL_CENTER);
    map?.setZoom(zoom);
  }, [map]);

  return (
    <div className="flex flex-col h-full">
      <Header />
      {/*
        レイアウト:
        - スマホ: 地図(上/order-1) → サイドバー(下/order-2)
        - PC: サイドバー(左/order-1) → 地図(右/order-2)
      */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* 地図: スマホでは上、PCでは右 */}
        <div className="order-1 md:order-2 h-[50vh] md:h-auto md:flex-1">
          <MapView
            centerPoint={centerPoint}
            validRadiusKm={validRadiusKm}
            onMapClick={handleMapClick}
            onCurrentLocation={handleMapClick}
          />
        </div>

        {/* サイドバー: スマホでは下（スクロール）、PCでは左固定 */}
        <aside className="order-2 md:order-1 w-full md:w-80 md:shrink-0 flex flex-col overflow-y-auto border-r border-gray-200">
          <ControlPanel
            searchText={searchText}
            radiusInput={radiusInput}
            radiusError={radiusError}
            isRadiusDirty={isRadiusDirty}
            onSearchChange={setSearchText}
            onPlaceSelect={handlePlaceSelect}
            onRadiusChange={handleRadiusChange}
            onClear={handleClear}
          />
          <InfoPanel centerPoint={centerPoint} validRadiusKm={validRadiusKm} />
        </aside>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <APIProvider apiKey={apiKey}>
      <AppContent />
    </APIProvider>
  );
}
