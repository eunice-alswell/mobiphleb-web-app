import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SearchIcon, MoveLeft } from "lucide-react";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useGoogleMapsLocationPicker } from "../lib/useGoogleMapsLocationPicker";

export default function SelectLocation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  // Get callback path from state (default to going back)
  const callbackPath = location.state?.callbackPath;

  const {
    mapContainerRef,
    loading,
    address,
    coords,
    suggestions,
    fetchSuggestions,
    selectSuggestion,
    forwardGeocode,
  } = useGoogleMapsLocationPicker(true);

  // Confirm location
  const handleConfirm = () => {
    if (!address || !coords) {
      alert("Please select a location.");
      return;
    }

    // Navigate back with the selected location data
    if (callbackPath) {
      // If there's a callback path, navigate to it with state
      navigate(callbackPath, {
        state: {
          selectedLocation: {
            address,
            coordinates: coords,
          },
        },
      });
    } else {
      // If no callback path, just go back (can't pass state when going back)
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="">
          {/* Header */}
          <div className="px-4 py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center p-2 gap-2 border border-gray-300 hover:bg-gray-100 rounded-full transition-colors"
            > 
              <MoveLeft className="w-5 h-5 text-gray-700" />
              <p className="text-gray-700">Back</p>
            </button>
            <div className="text-center mb-8">
              <h2 className="text-4xl lg:text-5xl md:text-lg font-bold text-gray-900 mb-4">
                Select Location
              </h2>
              <p className="sub-heading">
                Search, click on the map, or drag the marker
              </p>
            </div>
            

            {/* Search Bar */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search for a location..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") forwardGeocode(search);
                  }}
                  className="input-field"
                />

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => forwardGeocode(search)}
                  className="border border-accent"
                >
                  <SearchIcon className="w-4 h-4 text-primaryColor" />
                </Button>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((s) => (
                    <button
                      key={s.place_id}
                      onClick={() => selectSuggestion(s.place_id, s.description)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <p className="text-sm font-medium">
                        {s.structured_formatting.main_text}
                      </p>
                      <p className="text-xs text-gray-500">
                        {s.structured_formatting.secondary_text}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map - Full Height */}
          <div className="relative w-full h-[500px] mb-6">
            <div ref={mapContainerRef} className="w-full h-[500px]" />

            {loading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryColor" />
              </div>
            )}
          </div>

          {/* Bottom Bar - Selected Location & Actions */}
          {address && coords && (
            <div className="flex-shrink-0 bg-white border-t shadow-lg">
              <div className="p-4">
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm font-medium text-green-800">
                    Selected Location
                  </p>
                  <p className="text-sm text-green-700">{address}</p>
                  <p className="text-xs text-green-600">
                    {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1 text-primaryColor"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={!address || !coords || loading}
                    className="flex-1 bg-primaryColor text-white hover:bg-primaryColor/90"
                  >
                    Confirm Location
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
