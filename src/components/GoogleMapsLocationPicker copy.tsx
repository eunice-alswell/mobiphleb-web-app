import { useEffect, useRef, useState, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "./ui/button";
import { MapPin, SearchIcon, Navigation } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface GoogleMapsLocationPickerProps {
  onLocationSelect: (
    address: string,
    coordinates?: { lat: number; lng: number }
  ) => void;
  initialValue?: string;
  required?: boolean;
}

// Default coords → Accra, Ghana
const DEFAULT_COORDS = { lat: 5.6037, lng: -0.1870 };

export default function GoogleMapsLocationPicker({
  onLocationSelect,
  initialValue = "",
  required = false,
}: GoogleMapsLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(initialValue);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>();
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID || undefined;

  // Update marker position
  const updateMarker = useCallback((coords: { lat: number; lng: number }) => {
    if (!mapRef.current || !markerRef.current) return;
    mapRef.current.setCenter(coords);
    mapRef.current.setZoom(15);
    markerRef.current.position = coords;
  }, []);

  // Reverse geocode: coords → address
  const reverseGeocode = useCallback(
    (coords: { lat: number; lng: number }) => {
      if (!geocoderRef.current) return;

      geocoderRef.current.geocode({ location: coords }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const address = results[0].formatted_address;
          setSelectedAddress(address);
          setCoordinates(coords);
          
          console.log("📍 Location Selected:", {
            address,
            coordinates: coords,
            timestamp: new Date().toISOString()
          });
        }
      });
    },
    []
  );

  // Forward geocode: address → coords
  const forwardGeocode = useCallback(
    (address: string) => {
      if (!geocoderRef.current || !address.trim()) return;

      setIsLoading(true);
      geocoderRef.current.geocode({ address }, (results, status) => {
        setIsLoading(false);
        if (status === "OK" && results?.[0]) {
          const location = results[0].geometry.location;
          const coords = {
            lat: location.lat(),
            lng: location.lng(),
          };
          const formattedAddress = results[0].formatted_address;
          
          setSelectedAddress(formattedAddress);
          setCoordinates(coords);
          updateMarker(coords);
          
          console.log("🔍 Search Result:", {
            address: formattedAddress,
            coordinates: coords
          });
        } else {
          alert(`Location not found. Please try a different search.`);
        }
      });
    },
    [updateMarker]
  );

  // Handle input changes and fetch suggestions
  const handleInputChange = (value: string) => {
    setSearchInput(value);
    
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: "gh" },
        },
        (predictions, status) => {
          if (status === "OK" && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
          }
        }
      );
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (placeId: string, description: string) => {
    if (!placesServiceRef.current) return;

    setSearchInput(description);
    setShowSuggestions(false);
    setSuggestions([]);

    placesServiceRef.current.getDetails(
      { placeId },
      (place, status) => {
        if (status === "OK" && place?.geometry?.location) {
          const coords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          
          const address = place.formatted_address || description;
          setSelectedAddress(address);
          setCoordinates(coords);
          
          if (mapRef.current && markerRef.current) {
            mapRef.current.setCenter(coords);
            mapRef.current.setZoom(15);
            markerRef.current.position = coords;
          }
          
          console.log("🔍 Suggestion Selected:", { address, coordinates: coords });
        }
      }
    );
  };

  // Initialize Google Maps
  useEffect(() => {
    if (!isDialogOpen || !mapContainerRef.current) return;
    
    // Skip if map already initialized
    if (mapRef.current) {
      // Just re-center the map on existing coordinates if available
      if (coordinates) {
        mapRef.current.setCenter(coordinates);
        mapRef.current.setZoom(15);
        if (markerRef.current) {
          markerRef.current.position = coordinates;
        }
      }
      return;
    }

    const initMap = async () => {
      setIsLoading(true);
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["places", "marker"],
        });

        await loader.importLibrary("maps");
        await loader.importLibrary("places");
        await loader.importLibrary("marker");

        geocoderRef.current = new google.maps.Geocoder();

        // Initialize AutocompleteService for suggestions
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();

        // Initialize map
        mapRef.current = new google.maps.Map(mapContainerRef.current!, {
          center: coordinates || DEFAULT_COORDS,
          zoom: coordinates ? 15 : 10,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          ...(mapId ? { mapId } : {}),
        });

        // Initialize PlacesService for place details
        placesServiceRef.current = new google.maps.places.PlacesService(mapRef.current);

        // AdvancedMarkerElement (draggable)
        markerRef.current = new google.maps.marker.AdvancedMarkerElement({
          map: mapRef.current,
          position: coordinates || DEFAULT_COORDS,
          gmpDraggable: true,
        });

        // Only get current location if no coordinates are set
        if (!coordinates && navigator.geolocation) {
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

        // Map click → directly set location
        mapRef.current.addListener("click", (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const coords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
            updateMarker(coords);
            reverseGeocode(coords);
          }
        });

        // Marker drag
        markerRef.current.addListener("dragend", (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const coords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
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
  }, [isDialogOpen, updateMarker, reverseGeocode, mapId]);

  // Use current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        updateMarker(coords);
        reverseGeocode(coords);
        setIsLoading(false);
      },
      (error) => {
        alert(`Unable to fetch location: ${error.message}`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Manual search
  const handleSearch = () => {
    if (searchInput.trim()) {
      forwardGeocode(searchInput);
    }
  };

  // Confirm and close dialog
  const handleConfirmAddress = () => {
    if (selectedAddress && coordinates) {
      onLocationSelect(selectedAddress, coordinates);
      setIsDialogOpen(false);
    } else {
      alert("Please select a location first.");
    }
  };

  return (
    <div>
      <div>
        <Label htmlFor="address-display" className="label">
          Complete Address <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center justify-between space-x-2 mt-1 input-field pr-2 cursor-pointer"
             onClick={() => setIsDialogOpen(true)}>
          <Input
            id="address-display"
            type="text"
            value={selectedAddress}
            placeholder="Click to select your location"
            readOnly
            required={required}
            className="cursor-pointer border-none focus-visible:ring-0"
          />
          <MapPin className="text-primaryColor w-5 h-5 flex-shrink-0"/>
        </div>
        {coordinates && (
          <p className="text-xs text-gray-500 mt-1">
            Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </p>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="text-black">
            <DialogTitle>Select Location</DialogTitle>
            <DialogDescription>
              Search for an address, click the map, or use your current location.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">  
            {/* Current Location Button */}
            {/* <div className="flex items-center justify-between w-full gap-2"> */}
              <Button 
                onClick={handleUseCurrentLocation} 
                className="w-full text-primaryColor border border-primaryColor bg-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-violet-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-primaryColor font-medium rounded-md text-sm text-center transition-colors duration-300 ease-in-out"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Use My Current Location
              </Button>
              {/* <Button 
                // onClick={() => React.Element(
                //   <div ref={autocompleteElementRef} className="w-full" />
                // )}
                className="text-primaryColor border border-primaryColor bg-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-violet-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-primaryColor font-medium rounded-4xl text-sm text-center transition-colors duration-300 ease-in-out"
              >
                <SearchIcon className="w-4 h-4 " />
              </Button> */}
            {/* </div> */}

            {/* Map Container with Overlay Search */}
            <div className="border rounded-lg overflow-hidden relative h-[420px]">
              {/* Custom Search Input with Suggestions */}
              <div className="absolute top-3 left-3 right-3 z-10">
                <div className="bg-white rounded-lg shadow-lg">
                  <div className="flex items-center">
                    <Input
                      placeholder="Search for a location..."
                      value={searchInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchInput.trim()) {
                          handleSearch();
                          setShowSuggestions(false);
                        }
                      }}
                      className="input-field w-full"
                    />
                    <Button
                      onClick={() => {
                        if (searchInput.trim()) {
                          handleSearch();
                          setShowSuggestions(false);
                        }
                      }}
                      variant="ghost"
                      size="icon"
                      className="text-primaryColor border border-primaryColor bg-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-violet-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-primaryColor font-medium rounded-sm text-sm text-center transition-colors duration-300 ease-in-out"
                    >
                      <SearchIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.place_id}
                          onClick={() => handleSelectSuggestion(suggestion.place_id, suggestion.description)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors border-b last:border-b-0"
                        >
                          <p className="text-sm font-medium">{suggestion.structured_formatting.main_text}</p>
                          <p className="text-xs text-gray-600">{suggestion.structured_formatting.secondary_text}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Map */}
              <div ref={mapContainerRef} className="w-full h-full" />
              
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryColor mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Address Display */}
            {selectedAddress && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">Selected Location:</p>
                <p className="text-sm text-green-700 mt-1">{selectedAddress}</p>
                {coordinates && (
                  <p className="text-xs text-green-600 mt-1">
                    {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              onClick={() => setIsDialogOpen(false)}
              className="text-primaryColor border border-primaryColor bg-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-violet-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-primaryColor font-medium rounded-4xl text-sm px-5 py-2 text-center transition-colors duration-300 ease-in-out"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmAddress} 
              disabled={!selectedAddress || isLoading}
              className= "text-white bg-gradient-to-r from-purple-500 to-violet-500 hover:bg-none hover:border-2 hover:border-primaryColor hover:text-primaryColor focus:ring-4 focus:outline-none focus:ring-primaryColor font-medium rounded-4xl text-sm text-center transition-colors duration-300 ease-in-out"
            >
              Confirm Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}