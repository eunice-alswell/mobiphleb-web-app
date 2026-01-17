# Website Update Summary

## Overview
Updated the MobiPhleb website to work with the new backend API structure that includes location-based features, distance calculation, and improved service assignment.

## Key Changes Made

### 1. **API Type Updates** (`src/types/api.ts`)

#### Updated `GuestAppointmentData` Interface:
- **Removed**: `location: string` field
- **Added**: 
  - `address: string` - Full address as text
  - `userLocation?: { latitude: number; longitude: number }` - GPS coordinates
  - `facilityServiceId?: string` - Combined facility-service ID (replaces separate facilityId and serviceId)

### 2. **API Service Updates** (`src/lib/apiServices.ts`)

#### Updated `createGuestAppointment` Function:
- Now sends `address` instead of `location`
- Sends GPS coordinates as `userLocation[latitude]` and `userLocation[longitude]`
- Sends `facilityServiceId` instead of separate `facilityId` and `serviceId`

### 3. **Booking Form Updates** (`src/pages/IndividualBooking.tsx`)

#### Form Data Structure:
- **Added**:
  - `address: string`
  - `userLocation?: { latitude: number, longitude: number }`
  - `serviceId: string` (internal tracking)
  - `facilityServiceId: string` (sent to backend)
- **Removed**: `location: string`
- **Renamed**: `serviceType` → `serviceId` and added `facilityServiceId`

#### New Features:
1. **Location with Coordinates**:
   - GoogleMapsLocationPicker now returns both address and coordinates
   - Coordinates are automatically captured when user selects a location
   - Both stored separately in form state

2. **Facility-Service Selection**:
   - Services now show pricing information from facility-service relationship
   - User selects a combined facility-service (not separate facility + service)
   - Displays: `"Service Name - GHS XX.XX"`
   - Shows note about distance charges

3. **New Handler Functions**:
   - `handleServiceChange()` - Sets both serviceId and facilityServiceId
   - Updated `handleFacilityChange()` - Clears both serviceId and facilityServiceId

#### Form Validation:
- Updated to require `address` instead of `location`
- Updated to require `facilityServiceId` instead of `facilityId`

## Backend Integration

### What the Backend Now Receives:
```typescript
{
  relationshipToUser: "SELF",
  patientName: "John Doe",
  patientEmail: "john@example.com",
  patientPhone: "+233241234567",
  patientAge: 30,
  patientGender: "Male",
  appointmentDate: "2026-01-15",
  appointmentTime: "09:00 AM",
  address: "123 Main St, Accra, Ghana",  // ✅ NEW
  userLocation: {                         // ✅ NEW
    latitude: 5.6037,
    longitude: -0.1870
  },
  facilityServiceId: "fs-uuid-123",      // ✅ NEW (replaces facilityId + serviceId)
  patientNumber: "PAT12345",
  notes: "Please call before arrival",
  labRequestFile: File
}
```

### What the Backend Does:
1. **Distance Calculation**: Uses userLocation coordinates to calculate distance to nearest available phlebotomist
2. **Dynamic Pricing**: 
   - Base price from facility-service
   - Distance charges: ≤10km = +0 GHS, 10-15km = +20 GHS, >15km = +50 GHS
3. **Auto-Assignment**: Automatically assigns nearest available phlebotomist
4. **Real-time Tracking**: WebSocket support for live location updates

## User Experience Improvements

### Before:
- User entered location as free text
- No coordinate capture
- Separate facility and service selection
- No pricing visibility

### After:
- User selects location via interactive map
- GPS coordinates automatically captured
- Combined facility-service selection with pricing
- Clear pricing shown (base price + note about distance charges)
- More accurate location data for phlebotomist assignment

## Testing Checklist

- [x] Types updated and compiling without errors
- [x] API service sends correct data structure
- [x] Form captures address and coordinates
- [x] Facility-service selection works correctly
- [x] Pricing displayed for each service
- [x] Form validation updated
- [x] Submission sends correct format to backend

## Future Enhancements

1. **Distance Preview**: Show estimated distance charge before submission
2. **Available Phlebotomists**: Display count of available phlebotomists nearby
3. **Price Calculator**: Real-time price calculation based on selected location
4. **Location History**: Save frequently used addresses for quick selection
5. **Map Visualization**: Show phlebotomist locations on map (requires WebSocket integration)

## Files Modified

1. `src/types/api.ts` - Updated GuestAppointmentData interface
2. `src/lib/apiServices.ts` - Updated createGuestAppointment function
3. `src/pages/IndividualBooking.tsx` - Complete form restructure
4. `src/components/GoogleMapsLocationPicker.tsx` - Already returns coordinates (no changes needed)

## Notes

- GoogleMapsLocationPicker component already supported returning coordinates via its callback, so no changes were needed there
- The backend calculates distance and pricing server-side, ensuring accuracy and preventing tampering
- FacilityService includes pricing, facility info, and service info in one object for easy display
