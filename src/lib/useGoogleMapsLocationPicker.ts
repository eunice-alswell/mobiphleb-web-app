import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const DEFAULT_COORDS = { lat: 5.6037, lng: -0.187 };

export function useGoogleMapsLocationPicker(isOpen: boolean) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const autocompleteRef =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef =
    useRef<google.maps.places.PlacesService | null>(null);

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);

  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

  // -------------------------------
  // Helpers: Marker and Geocoding
  // -------------------------------
  const updateMarker = (c: { lat: number; lng: number }) => {
    if (!mapRef.current || !markerRef.current) return;
    mapRef.current.setCenter(c);
    mapRef.current.setZoom(15);
    markerRef.current.position = c;
  };

  const reverseGeocode = (c: { lat: number; lng: number }) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode({ location: c }, (res, status) => {
      if (status === "OK" && res?.[0]) {
        setAddress(res[0].formatted_address);
        setCoords(c);
      }
    });
  };

  const forwardGeocode = (query: string) => {
    if (!geocoderRef.current || !query.trim()) return;

    setLoading(true);
    geocoderRef.current.geocode({ address: query }, (res, status) => {
      setLoading(false);
      if (status === "OK" && res?.[0]) {
        const loc = res[0].geometry.location;
        const c = { lat: loc.lat(), lng: loc.lng() };
        setAddress(res[0].formatted_address);
        setCoords(c);
        updateMarker(c);
      }
    });
  };

  const fetchSuggestions = (input: string) => {
    if (!autocompleteRef.current || !input.trim()) {
      setSuggestions([]);
      return;
    }

    autocompleteRef.current.getPlacePredictions(
      { input, componentRestrictions: { country: "gh" } },
      (preds, status) => {
        if (status === "OK" && preds) setSuggestions(preds);
        else setSuggestions([]);
      }
    );
  };

  const selectSuggestion = (placeId: string, description: string) => {
    if (!placesServiceRef.current) return;

    placesServiceRef.current.getDetails({ placeId }, (place, status) => {
      if (status === "OK" && place?.geometry?.location) {
        const c = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setAddress(place.formatted_address || description);
        setCoords(c);
        updateMarker(c);
        setSuggestions([]);
      }
    });
  };

  // -------------------------------
  // Init map (MODAL SAFE)
  // -------------------------------
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current || mapRef.current) return;

    const init = async () => {
      setLoading(true);
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ["places", "marker"],
        version: "weekly",
      });

      await loader.importLibrary("maps");
      await loader.importLibrary("places");
      await loader.importLibrary("marker");

      geocoderRef.current = new google.maps.Geocoder();
      autocompleteRef.current =
        new google.maps.places.AutocompleteService();

      mapRef.current = new google.maps.Map(mapContainerRef.current!, {
        center: DEFAULT_COORDS,
        zoom: 10,
        mapTypeControl: false,
        streetViewControl: false,
        ...(mapId ? { mapId } : {}),
      });

      placesServiceRef.current = new google.maps.places.PlacesService(
        mapRef.current
      );

      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: DEFAULT_COORDS,
        gmpDraggable: true,
      });
      
    mapRef.current.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const c = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      updateMarker(c);
      reverseGeocode(c);
    });

    markerRef.current.addListener("dragend", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      reverseGeocode({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    });

      setTimeout(() => {
        google.maps.event.trigger(mapRef.current!, "resize");
        mapRef.current!.setCenter(DEFAULT_COORDS);
      }, 300);

      setLoading(false);
    };

    init();
  }, [isOpen, mapId]);

  return {
    mapContainerRef,
    loading,
    address,
    coords,
    suggestions,
    fetchSuggestions,
    selectSuggestion,
    forwardGeocode,
    setAddress,
  };
}
