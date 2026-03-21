"use client";

import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { PlaceCandidate } from "@/types";

const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;

type UsePlaceSearchResult = {
  candidates: PlaceCandidate[];
  isLoading: boolean;
  searchError: string;
  getPlaceLocation: (placeId: string) => Promise<google.maps.LatLngLiteral | null>;
};

export function usePlaceSearch(query: string): UsePlaceSearchResult {
  const placesLib = useMapsLibrary("places");
  const [candidates, setCandidates] = useState<PlaceCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // セッショントークンを生成（検索セッション単位で再利用するとコスト最適化になる）
  useEffect(() => {
    if (!placesLib) return;
    sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
  }, [placesLib]);

  useEffect(() => {
    if (query.length < MIN_CHARS) {
      setCandidates([]);
      setSearchError("");
      return;
    }

    const timer = setTimeout(async () => {
      if (!placesLib) return;

      setIsLoading(true);
      setSearchError("");

      try {
        const { suggestions } =
          await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: query,
            sessionToken: sessionTokenRef.current ?? undefined,
          });

        setCandidates(
          suggestions
            .filter((s) => s.placePrediction !== null)
            .map((s) => ({
              placeId: s.placePrediction!.placeId,
              name: s.placePrediction!.text.toString(),
            }))
        );
      } catch {
        setCandidates([]);
        setSearchError("検索できませんでした。しばらく経ってから再試行してください");
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, placesLib]);

  const getPlaceLocation = async (placeId: string): Promise<google.maps.LatLngLiteral | null> => {
    try {
      const place = new google.maps.places.Place({ id: placeId });
      await place.fetchFields({ fields: ["location"] });

      // セッション終了後に新しいトークンを発行
      if (placesLib) {
        sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
      }

      if (place.location) {
        return { lat: place.location.lat(), lng: place.location.lng() };
      }
      return null;
    } catch {
      return null;
    }
  };

  return { candidates, isLoading, searchError, getPlaceLocation };
}
