"use client";

import { useMemo } from "react";
import { Map, MapMouseEvent, AdvancedMarker, Marker } from "@vis.gl/react-google-maps";
import { INITIAL_CENTER, INITIAL_ZOOM_MOBILE, INITIAL_ZOOM_PC, PC_BREAKPOINT } from "@/constants/map";
import { LatLng } from "@/types";
import MapCircle from "./MapCircle";

export const MAP_ID = "circle-map-main";

const googleMapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

type Props = {
  centerPoint: LatLng | null;
  validRadiusKm: number | null;
  onMapClick: (latLng: LatLng) => void;
};

export default function MapView({ centerPoint, validRadiusKm, onMapClick }: Props) {
  const initialZoom = useMemo(() => {
    if (typeof window === "undefined") return INITIAL_ZOOM_MOBILE;
    return window.innerWidth >= PC_BREAKPOINT ? INITIAL_ZOOM_PC : INITIAL_ZOOM_MOBILE;
  }, []);

  const handleClick = (e: MapMouseEvent) => {
    if (!e.detail.latLng) return;
    onMapClick({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
  };

  return (
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
  );
}
