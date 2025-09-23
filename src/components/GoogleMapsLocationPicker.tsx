import { useEffect, useRef, useState, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "./Button";
import { MapPin } from "lucide-react";

interface GoogleMapsLocationPickerProps {
  onLocationSelect: (
    address: string,
    coordinates?: { lat: number; lng: number }
  ) => void;
  initialValue?: string;
  required?: boolean;
}

// Default coordinates → Greater Accra (stable top-level constant)
const DEFAULT_COORDS = { lat: 5.614818, lng: -0.205874 };

export default function GoogleMapsLocationPicker({
  onLocationSelect,
  initialValue = "",
  required = false,
}: GoogleMapsLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [selectedAddress, setSelectedAddress] = useState(initialValue);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Stable ref for the callback to avoid needing to include it in deps
  const onLocationSelectRef = useRef(onLocationSelect);
  // keep ref updated when prop changes
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // no local default coords; use DEFAULT_COORDS directly


  // Place marker + center map
  const updateMarker = useCallback((coords: { lat: number; lng: number }) => {
    if (mapRef.current) {
      mapRef.current.setCenter(coords);
      mapRef.current.setZoom(15);

      if (!markerRef.current) return;
      markerRef.current.position = coords;
    }
  }, []);

  // Reverse geocode coords → address
  const reverseGeocode = useCallback(
    (coords: { lat: number; lng: number }) => {
      if (!geocoderRef.current) return;

      geocoderRef.current.geocode({ location: coords }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const address = results[0].formatted_address;
          setSelectedAddress(address);
          if (inputRef.current) inputRef.current.value = address;
          // use the ref to call the latest callback
          onLocationSelectRef.current?.(address, coords);
        }
      });
    },
    []
  );

  // ✅ Initialize Google Maps + Autocomplete
  useEffect(() => {
    if (!isMapVisible || !mapContainerRef.current) return;

    const initMap = async () => {
      setIsLoading(true);
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["places"],
        });
        await loader.load();

        const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

        geocoderRef.current = new google.maps.Geocoder();

        // ✅ Initialize Map
        const container = mapContainerRef.current!;
        mapRef.current = new Map(container, {
          center: DEFAULT_COORDS,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        // ✅ Add draggable marker
        markerRef.current = new AdvancedMarkerElement({
          map: mapRef.current,
          position: DEFAULT_COORDS,
          gmpDraggable: true,
        });

        // ✅ Setup Autocomplete
        if (inputRef.current) {
          autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
            fields: ["formatted_address", "geometry"],
            types: ["geocode"],
          });

          autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current?.getPlace();
            if (!place?.geometry?.location) return;

            const coords = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };

            updateMarker(coords);
            const address = place.formatted_address || "";
            setSelectedAddress(address);
            onLocationSelectRef.current?.(address, coords);
          });
        }

        // ✅ Use current location if available
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const coords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              };
              updateMarker(coords);
              reverseGeocode(coords);
            },
            () => console.log("User denied geolocation")
          );
        }

        // ✅ Map click → update marker
        mapRef.current.addListener("click", (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const coords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
            updateMarker(coords);
            reverseGeocode(coords);
          }
        });

        // ✅ Marker drag → reverse geocode
        markerRef.current.addListener("dragend", () => {
          const pos = markerRef.current?.position as google.maps.LatLng;
          if (pos) {
            const coords = { lat: pos.lat(), lng: pos.lng() };
            reverseGeocode(coords);
          }
        });
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initMap();
  }, [isMapVisible, updateMarker, reverseGeocode]);

  // ✅ Button → use current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        updateMarker(coords);
        reverseGeocode(coords);
        setIsLoading(false);
      },
      () => {
        alert("Unable to fetch location.");
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Autocomplete Search */}
      <div>
        <Label htmlFor="address-search" className="label">
          Complete Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="address-search"
          ref={inputRef}
          defaultValue={initialValue}
          placeholder="Enter your address or search location"
          required={required}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => setIsMapVisible(!isMapVisible)}
          variantStyle="outlineStyle"
          leftIcon={<MapPin className="w-4 h-4" />}
          label={isMapVisible ? "Hide Map" : "Pick on Map"}
        />
        <Button
          type="button"
          onClick={handleUseCurrentLocation}
          variantStyle="outlineStyle"
          leftIcon={<MapPin className="w-4 h-4" />}
          label="Use Current Location"
        />
      </div>

      {/* Map */}
      {isMapVisible && (
        <div className="border rounded-lg overflow-hidden relative">
          <div ref={mapContainerRef} className="w-full h-64" />
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected address */}
      {selectedAddress && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Selected Location:</strong> {selectedAddress}
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Search, click the map, or drag the marker to pick your location.
      </p>
    </div>
  );
}
