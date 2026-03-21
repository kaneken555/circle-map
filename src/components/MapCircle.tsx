"use client";

import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { LatLng } from "@/types";
import { MAP_ID } from "./MapView";

type Props = {
  center: LatLng;
  radiusKm: number;
};

export default function MapCircle({ center, radiusKm }: Props) {
  const map = useMap(MAP_ID);
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!circleRef.current) {
      circleRef.current = new google.maps.Circle({
        map,
        strokeColor: "#1a73e8",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#1a73e8",
        fillOpacity: 0.1,
      });
    }

    circleRef.current.setCenter(center);
    circleRef.current.setRadius(radiusKm * 1000);

    return () => {
      circleRef.current?.setMap(null);
      circleRef.current = null;
    };
  }, [map, center, radiusKm]);

  return null;
}
