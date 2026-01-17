import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin } from "lucide-react";

import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface GoogleMapsLocationDialogProps {
  onLocationSelect: (
    address: string,
    coordinates: { lat: number; lng: number }
  ) => void;
  initialValue?: string;
  required?: boolean;
}

export default function GoogleMapsLocationPicker({
  onLocationSelect,
  initialValue = "",
  required = false,
}: GoogleMapsLocationDialogProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = useState(initialValue);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  // Listen for location data returned from SelectLocation page
  useEffect(() => {
    if (location.state?.selectedLocation) {
      const { address: newAddress, coordinates } = location.state.selectedLocation;
      setAddress(newAddress);
      setCoords(coordinates);
      onLocationSelect(newAddress, coordinates);

      // Clear the state to avoid re-triggering
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const handleSelectLocation = () => {
    navigate("/select-location", {
      state: {
        callbackPath: location.pathname,
      },
    });
  };

  return (
    <div className="">
      {/* Trigger / Display */}
      <Label className="label">
        Complete Address {required && <span className="text-red-500">*</span>}
      </Label>

      <div
        onClick={handleSelectLocation}
        className="mt-1 flex items-center justify-between input-field pr-2 cursor-pointer"
      >
        <Input
          readOnly
          value={address}
          placeholder="Click to select your location"
          required={required}
          className="border-none focus-visible:ring-0 cursor-pointer"
        />
        <MapPin className="w-5 h-5 text-primaryColor" />
      </div>

      {coords && (
        <p className="text-xs text-gray-500 mt-1">
          {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
