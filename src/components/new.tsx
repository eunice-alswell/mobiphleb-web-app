// // import { useEffect, useRef, useState, useCallback } from "react";
// // import { Loader } from "@googlemaps/js-api-loader";
// // import { Input } from "../components/ui/input";
// // import { Label } from "../components/ui/label";
// // import Button from "./Button";
// // import { MapPin } from "lucide-react";

// // interface GoogleMapsLocationPickerProps {
// //   onLocationSelect: (
// //     address: string,
// //     coordinates?: { lat: number; lng: number }
// //   ) => void;
// //   initialValue?: string;
// //   required?: boolean;
// //   mapId?: string;
// // }

// // // Default coords → Greater Accra
// // const DEFAULT_COORDS = { lat: 5.614818, lng: -0.205874 };

// // export default function GoogleMapsLocationPicker({
// //   onLocationSelect,
// //   initialValue = "",
// //   required = false,
// //   mapId,
// // }: GoogleMapsLocationPickerProps) {
// //   const mapContainerRef = useRef<HTMLDivElement>(null);
// //   const inputRef = useRef<HTMLInputElement>(null);

// //   const mapRef = useRef<google.maps.Map | null>(null);
// //   const markerRef = useRef<google.maps.Marker | null>(null);
// //   const geocoderRef = useRef<google.maps.Geocoder | null>(null);
// //   const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

// //   const [selectedAddress, setSelectedAddress] = useState(initialValue);
// //   const [isMapVisible, setIsMapVisible] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);

// //   // stable callback ref
// //   const onLocationSelectRef = useRef(onLocationSelect);
// //   useEffect(() => {
// //     onLocationSelectRef.current = onLocationSelect;
// //   }, [onLocationSelect]);

// //   // ✅ Place marker + center map
// //   const updateMarker = useCallback((coords: { lat: number; lng: number }) => {
// //     if (!mapRef.current || !markerRef.current) return;

// //     mapRef.current.setCenter(coords);
// //     mapRef.current.setZoom(15);
// //     markerRef.current.setPosition(coords);
// //   }, []);

// //   // ✅ Reverse geocode coords → address
// //   const reverseGeocode = useCallback(
// //     (coords: { lat: number; lng: number }) => {
// //       if (!geocoderRef.current) return;

// //       geocoderRef.current.geocode({ location: coords }, (results, status) => {
// //         if (status === "OK" && results?.[0]) {
// //           const address = results[0].formatted_address;
// //           setSelectedAddress(address);
// //           if (inputRef.current) inputRef.current.value = address;
// //           onLocationSelectRef.current?.(address, coords);
// //         }
// //       });
// //     },
// //     []
// //   );

// //   // ✅ Initialize Google Maps + Autocomplete
// //   useEffect(() => {
// //     if (!isMapVisible || !mapContainerRef.current) return;

// //     const initMap = async () => {
// //       setIsLoading(true);
// //       try {
// //         const loader = new Loader({
// //           apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
// //           version: "weekly",
// //           libraries: ["places"],
// //         });

// //         await loader.importLibrary("maps");
// //         await loader.importLibrary("places");

// //         geocoderRef.current = new google.maps.Geocoder();

// //         // Initialize map
// //         const container = mapContainerRef.current!;
// //         mapRef.current = new google.maps.Map(container, {
// //           center: DEFAULT_COORDS,
// //           zoom: 13,
// //           mapTypeControl: false,
// //           streetViewControl: false,
// //           fullscreenControl: false,
// //           ...(mapId ? { mapId } : {}),
// //         });

// //         // ✅ Classic marker (draggable)
// //         markerRef.current = new google.maps.Marker({
// //           map: mapRef.current,
// //           position: DEFAULT_COORDS,
// //           draggable: true,
// //         });

// //         // ✅ Autocomplete
// //         if (inputRef.current) {
// //           autocompleteRef.current = new google.maps.places.Autocomplete(
// //             inputRef.current,
// //             {
// //               fields: ["formatted_address", "geometry"],
// //               types: ["geocode"],
// //               componentRestrictions: { country: "GH" },
// //             }
// //           );

// //           autocompleteRef.current.addListener("place_changed", () => {
// //             const place = autocompleteRef.current?.getPlace();
// //             if (!place?.geometry?.location) return;

// //             const coords = {
// //               lat: place.geometry.location.lat(),
// //               lng: place.geometry.location.lng(),
// //             };
// //             updateMarker(coords);
// //             const address = place.formatted_address || "";
// //             setSelectedAddress(address);
// //             onLocationSelectRef.current?.(address, coords);
// //           });
// //         }

// //         // ✅ Use current location if available
// //         if (navigator.geolocation) {
// //           navigator.geolocation.getCurrentPosition(
// //             (pos) => {
// //               const coords = {
// //                 lat: pos.coords.latitude,
// //                 lng: pos.coords.longitude,
// //               };
// //               updateMarker(coords);
// //               reverseGeocode(coords);
// //             },
// //             () => console.log("User denied geolocation")
// //           );
// //         }

// //         // ✅ Map click → update marker
// //         mapRef.current.addListener("click", (event: google.maps.MapMouseEvent) => {
// //           if (event.latLng) {
// //             const coords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
// //             updateMarker(coords);
// //             reverseGeocode(coords);
// //           }
// //         });

// //         // ✅ Marker drag → reverse geocode
// //         markerRef.current.addListener("dragend", () => {
// //           const pos = markerRef.current?.getPosition();
// //           if (pos) {
// //             const coords = { lat: pos.lat(), lng: pos.lng() };
// //             reverseGeocode(coords);
// //           }
// //         });
// //       } catch (error) {
// //         console.error("Error initializing Google Maps:", error);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     initMap();
// //   }, [isMapVisible, updateMarker, reverseGeocode, mapId]);

// //   // ✅ Button → use current location
// //   const handleUseCurrentLocation = () => {
// //     if (!navigator.geolocation) return;
// //     setIsLoading(true);

// //     navigator.geolocation.getCurrentPosition(
// //       (pos) => {
// //         const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
// //         updateMarker(coords);
// //         reverseGeocode(coords);
// //         setIsLoading(false);
// //       },
// //       () => {
// //         alert("Unable to fetch location.");
// //         setIsLoading(false);
// //       }
// //     );
// //   };

// //   return (
// //     <div className="space-y-4">
// //       {/* Autocomplete Search */}
// //       <div>
// //         <Label htmlFor="address-search" className="label">
// //           Complete Address <span className="text-red-500">*</span>
// //         </Label>
// //         <Input
// //           id="address-search"
// //           ref={inputRef}
// //           defaultValue={initialValue}
// //           placeholder="Enter your address or search location"
// //           required={required}
// //           className="input-field"
// //         />
// //       </div>

// //       {/* Toggle Map Button */}
// //       <Button
// //         type="button"
// //         onClick={() => setIsMapVisible(!isMapVisible)}
// //         variantStyle="outlineStyle"
// //         leftIcon={<MapPin className="w-4 h-4" />}
// //         label={isMapVisible ? "Hide Map" : "Pick on Map"}
// //         customStyle="mb-2 w-full lg:w-auto"
// //       />

// //       {/* Map */}
// //       {isMapVisible && (
// //         <div className="flex flex-col space-y-2">
// //           <Button
// //             type="button"
// //             onClick={handleUseCurrentLocation}
// //             variantStyle="outlineStyle"
// //             leftIcon={<MapPin className="w-4 h-4" />}
// //             label="Use Current Location"
// //           />
// //           {/* Selected address */}
// //           {selectedAddress && (
// //             <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
// //               <p className="text-xs text-green-800">
// //                 <strong>Selected Location:</strong> {selectedAddress}
// //               </p>
// //             </div>
// //           )}
// //           <div className="border rounded-lg overflow-hidden relative">
// //             <div ref={mapContainerRef} className="w-full h-64" />
// //             {isLoading && (
// //               <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
// //                 <div className="text-center">
// //                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
// //                   <p className="text-sm text-gray-600">Loading...</p>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}


// //       <p className="text-xs text-gray-500">
// //         Search, click the map, or drag the marker to pick your location.
// //       </p>
// //     </div>
// //   );
// // }


// import { useEffect, useRef, useState, useCallback } from "react";
// import { Loader } from "@googlemaps/js-api-loader";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import Button from "./Button";
// import { MapPin, SearchIcon, Navigation } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "./ui/dialog";

// interface GoogleMapsLocationPickerProps {
//   onLocationSelect: (
//     address: string,
//     coordinates?: { lat: number; lng: number }
//   ) => void;
//   initialValue?: string;
//   required?: boolean;
//   mapId?: string;
// }

// // Default coords → Greater Accra
// const DEFAULT_COORDS = { lat: 5.614818, lng: -0.205874 };

// export default function GoogleMapsLocationPicker({
//   onLocationSelect,
//   initialValue = "",
//   required = false,
//   mapId,
// }: GoogleMapsLocationPickerProps) {
//   const mapContainerRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const mapRef = useRef<google.maps.Map | null>(null);
//   const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
//   const geocoderRef = useRef<google.maps.Geocoder | null>(null);
//   const autocompleteElementRef = useRef<HTMLDivElement>(null);

//   const [selectedAddress, setSelectedAddress] = useState(initialValue);
//   const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>();
//   const [isMapVisible, setIsMapVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [pendingLocation, setPendingLocation] = useState<{
//     address: string;
//     coords: { lat: number; lng: number };
//   } | null>(null);

//   // stable callback ref
//   const onLocationSelectRef = useRef(onLocationSelect);
//   useEffect(() => {
//     onLocationSelectRef.current = onLocationSelect;
//   }, [onLocationSelect]);

//   // ✅ Place marker + center map
//   const updateMarker = useCallback((coords: { lat: number; lng: number }) => {
//     if (!mapRef.current || !markerRef.current) return;

//     mapRef.current.setCenter(coords);
//     mapRef.current.setZoom(15);
//     markerRef.current.position = coords;
//   }, []);

//   // ✅ Reverse geocode coords → address
//   const reverseGeocode = useCallback(
//     (coords: { lat: number; lng: number }) => {
//       if (!geocoderRef.current) return;

//       geocoderRef.current.geocode({ location: coords }, (results, status) => {
//         if (status === "OK" && results?.[0]) {
//           const address = results[0].formatted_address;
//           setSelectedAddress(address);
//           setCoordinates(coords);
          
//           // Log location details
//           console.log("📍 Location Selected:", {
//             address,
//             coordinates: coords,
//             timestamp: new Date().toISOString()
//           });
          
//           onLocationSelectRef.current?.(address, coords);
//         }
//       });
//     },
//     []
//   );

//   // Handle manual input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSelectedAddress(value);
//   };

//   // Forward geocode: address → coords (for manual search)
//   const forwardGeocode = useCallback(
//     (address: string) => {
//       if (!geocoderRef.current || !address.trim()) return;

//       setIsLoading(true);
//       geocoderRef.current.geocode({ address }, (results, status) => {
//         setIsLoading(false);
//         if (status === "OK" && results?.[0]) {
//           const location = results[0].geometry.location;
//           const coords = {
//             lat: location.lat(),
//             lng: location.lng(),
//           };
//           const formattedAddress = results[0].formatted_address;
          
//           setSelectedAddress(formattedAddress);
//           setCoordinates(coords);
//           updateMarker(coords);
          
//           console.log("🔍 Manual Search Result:", {
//             address: formattedAddress,
//             coordinates: coords,
//             timestamp: new Date().toISOString()
//           });
          
//           onLocationSelectRef.current?.(formattedAddress, coords);
//         } else {
//           alert(`Location not found: ${status}. Please try a different search.`);
//         }
//       });
//     },
//     [updateMarker]
//   );

//   // Handle manual search button click
//   const handleManualSearch = () => {
//     if (selectedAddress.trim()) {
//       // Open map if not visible
//       if (!isMapVisible) {
//         setIsMapVisible(true);
//       }
//       forwardGeocode(selectedAddress);
//     }
//   };

//   // Handle Enter key in input
//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleManualSearch();
//     }
//   };

//   // ✅ Initialize Google Maps + Autocomplete
//   useEffect(() => {
//     if (!isMapVisible || !mapContainerRef.current) return;

//     const initMap = async () => {
//       setIsLoading(true);
//       try {
//         const loader = new Loader({
//           apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//           version: "weekly",
//           libraries: ["places", "marker"],
//         });

//         await loader.importLibrary("maps");
//         await loader.importLibrary("places");
//         await loader.importLibrary("marker");

//         geocoderRef.current = new google.maps.Geocoder();

//         // Initialize map
//         const container = mapContainerRef.current!;
//         mapRef.current = new google.maps.Map(container, {
//           center: DEFAULT_COORDS,
//           zoom: 13,
//           mapTypeControl: false,
//           streetViewControl: false,
//           fullscreenControl: false,
//           ...(mapId ? { mapId: mapId } : {}),
//         });

//         // ✅ AdvancedMarkerElement (new recommended approach)
//         markerRef.current = new google.maps.marker.AdvancedMarkerElement({
//           map: mapRef.current,
//           position: DEFAULT_COORDS,
//           gmpDraggable: true,
//         });

//         // ✅ PlaceAutocompleteElement (new recommended approach)
//         if (autocompleteElementRef.current) {
//           const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement({
//             componentRestrictions: { country: "GH" },
//           });
          
//           placeAutocomplete.id = "place-autocomplete";
//           autocompleteElementRef.current.appendChild(placeAutocomplete);

//           placeAutocomplete.addEventListener("gmp-placeselect", async (event: Event) => {
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             const place = (event as any).place;
            
//             // Fetch place details
//             await place.fetchFields({
//               fields: ["displayName", "formattedAddress", "location"],
//             });

//             if (!place.location) return;

//             const coords = {
//               lat: place.location.lat(),
//               lng: place.location.lng(),
//             };
            
//             const address = place.formattedAddress || "";
//             setSelectedAddress(address);
//             setCoordinates(coords);
//             updateMarker(coords);
            
//             // Log autocomplete selection
//             console.log("🔍 Autocomplete Search Result:", {
//               address,
//               coordinates: coords,
//               placeName: place.displayName,
//               timestamp: new Date().toISOString()
//             });
            
//             onLocationSelectRef.current?.(address, coords);
//           });
//         }

//         // ✅ Use current location if available
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(
//             (pos) => {
//               const coords = {
//                 lat: pos.coords.latitude,
//                 lng: pos.coords.longitude,
//               };
//               updateMarker(coords);
//               reverseGeocode(coords);
//             },
//             () => console.log("User denied geolocation")
//           );
//         }

//         // ✅ Map click → show confirmation dialog
//         mapRef.current.addListener("click", (event: google.maps.MapMouseEvent) => {
//           if (event.latLng) {
//             const coords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
//             updateMarker(coords);
            
//             // Reverse geocode and show dialog
//             if (geocoderRef.current) {
//               geocoderRef.current.geocode({ location: coords }, (results, status) => {
//                 if (status === "OK" && results?.[0]) {
//                   const address = results[0].formatted_address;
//                   setPendingLocation({ address, coords });
//                   setShowConfirmDialog(true);
//                 }
//               });
//             }
//           }
//         });

//         // ✅ Marker drag → reverse geocode
//         markerRef.current.addListener("dragend", (event: google.maps.MapMouseEvent) => {
//           if (event.latLng) {
//             const coords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
//             reverseGeocode(coords);
//           }
//         });
//       } catch (error) {
//         console.error("Error initializing Google Maps:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initMap();
//   }, [isMapVisible, updateMarker, reverseGeocode, mapId]);

//   // Confirm location selection from dialog
//   const confirmLocationSelection = () => {
//     if (pendingLocation) {
//       setSelectedAddress(pendingLocation.address);
//       setCoordinates(pendingLocation.coords);
      
//       console.log("📍 Location Confirmed:", {
//         address: pendingLocation.address,
//         coordinates: pendingLocation.coords,
//         timestamp: new Date().toISOString()
//       });
      
//       onLocationSelectRef.current?.(pendingLocation.address, pendingLocation.coords);
//     }
//     setShowConfirmDialog(false);
//     setPendingLocation(null);
//   };

//   // Cancel location selection
//   const cancelLocationSelection = () => {
//     setShowConfirmDialog(false);
//     setPendingLocation(null);
//     // Restore previous marker position if coordinates exist
//     if (coordinates) {
//       updateMarker(coordinates);
//     }
//   };

//   //Button → use current location
//   const handleUseCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser.");
//       return;
//     }
    
//     // Open map if not visible
//     if (!isMapVisible) {
//       setIsMapVisible(true);
//     }
    
//     setIsLoading(true);

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        
//         // Wait a bit if map just opened
//         setTimeout(() => {
//           updateMarker(coords);
//           reverseGeocode(coords);
//           setIsLoading(false);
//         }, isMapVisible ? 0 : 500);
//       },
//       (error) => {
//         console.error("Geolocation error:", error);
//         alert(`Unable to fetch location: ${error.message}`);
//         setIsLoading(false);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0
//       }
//     );
//   };

//   return (
//     <div className="space-y-4">
//       {/* Autocomplete Search */}
//       <div>
//         <Label htmlFor="address-search" className="label">
//           Complete Address <span className="text-red-500">*</span>
//         </Label>
//         <div className="flex gap-2">
//           <div className="relative flex-1">
//             {/* PlaceAutocompleteElement Container */}
//             {isMapVisible ? (
//               // <div></div>
//               <div ref={autocompleteElementRef} className="w-full" />
//             ) : (
//               <div className="relative">
//                 <Input
//                   id="address-search"
//                   ref={inputRef}
//                   value={selectedAddress}
//                   onChange={handleInputChange}
//                   onKeyDown={handleKeyPress}
//                   placeholder="Enter your address or search location"
//                   required={required}
//                   className="input-field pr-10"
//                 />
//                 <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               </div>
//             )}
//           </div>
//           <Button
//             type="button"
//             onClick={handleManualSearch}
//             variantStyle="outlineStyle"
//             leftIcon={<SearchIcon className="w-4 h-4" />}
//             label="Search"
//             disable={!selectedAddress.trim()}
//           />
//         </div>
//         <p className="text-xs text-gray-500 mt-1">
//           {isMapVisible 
//             ? "Select from dropdown or click Search to find location on map"
//             : "Type and press Enter or click Search to find location on map"}
//         </p>
//       </div>

//       {/* Toggle Map Button */}
//       <Button
//         type="button"
//         onClick={() => setIsMapVisible(!isMapVisible)}
//         variantStyle="outlineStyle"
//         leftIcon={<MapPin className="w-4 h-4" />}
//         label={isMapVisible ? "Hide Map" : "Pick on Map"}
//         customStyle="mb-2 w-full lg:w-auto"
//       />

//       {/* Use Current Location Button - Always visible */}
//       <Button
//         type="button"
//         onClick={handleUseCurrentLocation}
//         variantStyle="outlineStyle"
//         leftIcon={<Navigation className="w-4 h-4" />}
//         label="Use My Current Location"
//         customStyle="w-full lg:w-auto"
//       />

//       {/* Map */}
//       {isMapVisible && (
//         <div className="flex flex-col space-y-2">
//           {/* Selected address */}
//           {selectedAddress && (
//             <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
//               <p className="text-xs text-green-800">
//                 <strong>Selected Location:</strong> {selectedAddress}
//               </p>
//               {coordinates && (
//                 <p className="text-xs text-green-700 mt-1">
//                   <strong>Coordinates:</strong> {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
//                 </p>
//               )}
//             </div>
//           )}
//           <div className="border rounded-lg overflow-hidden relative">
//             <div ref={mapContainerRef} className="w-full h-64" />
//             {isLoading && (
//               <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
//                 <div className="text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
//                   <p className="text-sm text-gray-600">Loading...</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <p className="text-xs text-gray-500">
//         {isMapVisible 
//           ? "Click the map or drag the marker to pick your location." 
//           : "Search for an address or use your current location to get started."}
//       </p>

//       {/* Confirmation Dialog */}
//       <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Location</DialogTitle>
//             <DialogDescription>
//               Is this the location you want to select?
//             </DialogDescription>
//           </DialogHeader>
//           {pendingLocation && (
//             <div className="py-4">
//               <p className="text-sm font-medium mb-2">Selected Location:</p>
//               <p className="text-sm text-gray-700 mb-3">
//                 {pendingLocation.address}
//               </p>
//               <p className="text-xs text-gray-500">
//                 Coordinates: {pendingLocation.coords.lat.toFixed(6)}, {pendingLocation.coords.lng.toFixed(6)}
//               </p>
//             </div>
//           )}
//           <DialogFooter>
//             <Button
//               type="button"
//               onClick={cancelLocationSelection}
//               variantStyle="outlineStyle"
//               label="Cancel"
//             />
//             <Button
//               type="button"
//               onClick={confirmLocationSelection}
//               variantStyle="secondaryStyle"
//               label="Confirm Location"
//             />
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }



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
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(initialValue);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>();
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

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

  // Initialize Google Maps
  useEffect(() => {
    if (!isDialogOpen || !mapContainerRef.current) return;

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

        // Initialize map
        mapRef.current = new google.maps.Map(mapContainerRef.current!, {
          center: DEFAULT_COORDS,
          zoom: 10,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          ...(mapId ? { mapId } : {}),
        });

        // AdvancedMarkerElement (draggable)
        markerRef.current = new google.maps.marker.AdvancedMarkerElement({
          map: mapRef.current,
          position: DEFAULT_COORDS,
          gmpDraggable: true,
        });

        // PlaceAutocompleteElement
        if (autocompleteContainerRef.current) {
          const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement({
            componentRestrictions: { country: "GH" },
          });
          
          placeAutocomplete.id = "place-autocomplete-input";
          autocompleteContainerRef.current.appendChild(placeAutocomplete);

          placeAutocomplete.addEventListener("gmp-placeselect", async (event: Event) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const place = (event as any).place;
            
            await place.fetchFields({
              fields: ["displayName", "formattedAddress", "location"],
            });

            if (!place.location) return;

            const coords = {
              lat: place.location.lat(),
              lng: place.location.lng(),
            };
            
            const address = place.formattedAddress || "";
            setSearchInput(address);
            setSelectedAddress(address);
            setCoordinates(coords);
            updateMarker(coords);
            
            console.log("🔍 Autocomplete Result:", { address, coordinates: coords });
          });
        }

        // Try to get user's current location
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
            <div className="flex items-center justify-between w-full gap-2">
              <Button 
                onClick={handleUseCurrentLocation} 
                className="w-[85%] text-primaryColor border border-primaryColor bg-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-violet-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-primaryColor font-medium rounded-md text-sm text-center transition-colors duration-300 ease-in-out"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Use My Current Location
              </Button>
              <Button 
                // onClick={() => React.Element(
                //   <div ref={autocompleteElementRef} className="w-full" />
                // )}
                className="text-primaryColor border border-primaryColor bg-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-violet-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-primaryColor font-medium rounded-4xl text-sm text-center transition-colors duration-300 ease-in-out"
              >
                <SearchIcon className="w-4 h-4 " />
              </Button>
            </div>

            {/* Map Container */}
            <div className="border rounded-lg overflow-hidden relative">
              <div ref={mapContainerRef} className="w-full h-96" />
              {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
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

  

  // import { useEffect, useRef } from "react";
// import { Loader } from "@googlemaps/js-api-loader";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onSelect: (data: {
//     address: string;
//     lat: number;
//     lng: number;
//   }) => void;
// };

// const DEFAULT_CENTER = { lat: 5.6037, lng: -0.1870 }; // Accra

// export default function GoogleMapsLocationPicker({ open, onClose, onSelect }: Props) {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const autoRef = useRef<HTMLDivElement>(null);

//   const mapInstance = useRef<google.maps.Map | null>(null);
//   const markerInstance =
//     useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
//   const mapId = import.meta.env.VITE_GOOGLE_MAP_ID || null;

//   useEffect(() => {
//     if (!open) return;
//     if (!mapRef.current || !autoRef.current) return;
//     if (mapInstance.current) return; // 🔥 prevents re-init bugs

//     const loader = new Loader({
//       apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//       version: "weekly",
//       libraries: ["places", "marker"],
//     });

//     loader.load().then(() => {
//       // MAP
//       const map = new google.maps.Map(mapRef.current!, {
//         center: DEFAULT_CENTER,
//         zoom: 12,
//         disableDefaultUI: true,
//         ...(mapId ? { mapId } : {}),
//       });

//     // loader.importLibrary("maps");
//     // loader.importLibrary("places");
//     // loader.importLibrary("marker");

//     // // Initialize map
//     // const map = new google.maps.Map(mapRef.current!, {
//     //   center: DEFAULT_CENTER,
//     //   zoom: 12,
//     //   mapTypeControl: false,
//     //   streetViewControl: false,
//     //   fullscreenControl: false,
//     //   ...(mapId ? { mapId } : {}),
//     // });

//       mapInstance.current = map;

//       // MARKER
//       const marker = new google.maps.marker.AdvancedMarkerElement({
//         map,
//         position: DEFAULT_CENTER,
//         gmpDraggable: true,
//       });

//       markerInstance.current = marker;

//       // GEOCODER
//       const geocoder = new google.maps.Geocoder();

//       // AUTOCOMPLETE (NEW API)
//       const autocomplete =
//         new google.maps.places.PlaceAutocompleteElement({
//           componentRestrictions: { country: "GH" },
//         });

//       autoRef.current!.appendChild(autocomplete);
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       autocomplete.addEventListener("gmp-placeselect", async (e: any) => {
//         const place = e.place;

//         await place.fetchFields({
//           fields: ["formattedAddress", "location"],
//         });

//         if (!place.location) return;

//         const lat = place.location.lat();
//         const lng = place.location.lng();

//         map.setCenter({ lat, lng });
//         map.setZoom(15);
//         marker.position = { lat, lng };

//         onSelect({
//           address: place.formattedAddress,
//           lat,
//           lng,
//         });
//       });

//       // MAP CLICK
//       map.addListener("click", (e: google.maps.MapMouseEvent) => {
//         if (!e.latLng) return;

//         const lat = e.latLng.lat();
//         const lng = e.latLng.lng();

//         marker.position = { lat, lng };

//         geocoder.geocode(
//           { location: { lat, lng } },
//           (results, status) => {
//             if (status === "OK" && results?.[0]) {
//               onSelect({
//                 address: results[0].formatted_address,
//                 lat,
//                 lng,
//               });
//             }
//           }
//         );
//       });
//     });
//   });

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center text-black">
//       <div className="bg-white w-full max-w-3xl rounded-lg overflow-hidden">
//         {/* Header */}
//         <div className="p-4 border-b flex justify-between items-center">
//           <h3 className="font-semibold text-lg">Select Location</h3>
//           <button onClick={onClose}>✕</button>
//         </div>

//         {/* Map Container */}
//         <div className="relative h-[420px]">
//           {/* Autocomplete */}
//           <div className="absolute top-3 left-3 right-3 z-10 bg-white rounded shadow p-2">
//             <div ref={autoRef} />
//           </div>

//           {/* Map */}
//           <div ref={mapRef} className="w-full h-full" />
//         </div>

//         {/* Footer */}
//         <div className="p-4 text-right">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }