/**
 * Individual Booking Page
 * Guest appointment booking form integrated with backend API
 * Supports guest users without authentication
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem, 
  SelectTrigger, 
  SelectValue } from "../components/ui/select";
import GoogleMapsLocationPicker from "../components/GoogleMapsLocationPicker";
import { DropdownCombobox } from "../components/DropdownCombobox";
import { 
  CalendarDays, 
  Clock, 
  MapPin,
  User
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { DatePickerInput } from "../components/DatePicker";
import TimePicker from "../components/TimePicker";
import { 
  getActivePartneredFacilities,
  getServicesByFacility
} from "../lib/apiServices";
import type { RelationshipType, Gender, PartnerFacility, FacilityService } from "../types/api";

/**
 * Form data structure for the booking form
 */
interface BookingFormData {
  // Patient relationship
  relationshipToUser: RelationshipType;
  
  // Patient information (required if not SELF)
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: string;
  patientGender: Gender | null;
  
  // Appointment details
  appointmentDate: string;
  appointmentTime: string;
  address: string;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  
  // Lab information
  facilityId: string;
  facilityServiceIds: string[]; // Array of facility service IDs
  selectedServices: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  patientNumber: string;
  distanceKm?: number;
  basePrice?: number;
  distanceCharge?: number;
  totalPrice?: number;
  
  // Additional
  notes: string;
  prescriptionFile: File | null;
  consent: boolean;

}

export default function IndividualBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form state - initialize from sessionStorage if available
  const [formData, setFormData] = useState<BookingFormData>(() => {
    const savedData = sessionStorage.getItem('individualBookingFormData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Error parsing saved form data:', e);
      }
    }
    return {
      relationshipToUser: "OTHER",
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      patientAge: "",
      patientGender: null,
      appointmentDate: "",
      appointmentTime: "",
      address: "",
      userLocation: undefined,
      facilityId: "",
      facilityServiceIds: [],
      selectedServices: [],
      patientNumber: "",
      distanceKm: undefined,
      basePrice: 250.00,
      distanceCharge: undefined,
      totalPrice: undefined,
      notes: "",
      prescriptionFile: null,
      consent: false
    };
  });

  const [hasPatientNo, setHasPatientNo] = useState(false);
  const [dateError, setDateError] = useState<string>('');
  const [timeError, setTimeError] = useState<string>('');

  // Save form data to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('individualBookingFormData', JSON.stringify(formData));
  }, [formData]);

  // Clear sessionStorage when component unmounts (form submitted or navigated away permanently)
  useEffect((): (() => void) | undefined => {
    return () => {
      // Only clear if we're not going to the select-location page
      if (!location.pathname.includes('select-location')) {
        // Use a small timeout to check if we're navigating to select-location
        const timeoutId = setTimeout(() => {
          const currentPath = window.location.pathname;
          if (!currentPath.includes('select-location')) {
            sessionStorage.removeItem('individualBookingFormData');
          }
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    };
  }, [location.pathname]);

  // Fetch active partner facilites and their services for facility selection
  const {data:facilitiesData, isLoading:facilitiesLoading} = useQuery({
    queryKey: ['facilities'],
    queryFn: getActivePartneredFacilities,
  });

  // Fetch services for the selected facility
  const {data:facilityServicesData, isLoading:facilityServicesLoading} = useQuery({
    queryKey: ['facility-services', formData.facilityId],
    queryFn: () => getServicesByFacility(formData.facilityId),
    enabled: !!formData.facilityId, // Only fetch when a facility is selected
  });

  const facilities = facilitiesData?.data || [];
  
  // Get facility-services instead of just filtering services
  const facilityServices = useMemo(() => {
    if (!formData.facilityId || !facilityServicesData?.data) {
      return [];
    }
    return facilityServicesData.data;
  }, [formData.facilityId, facilityServicesData]);

  /**
   * Validate date - must be today or future
   */
  const validateDate = (dateString: string) => {
    if (!dateString) {
      setDateError('');
      return false;
    }
    
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    if (selectedDate < today) {
      setDateError('Please select today or a future date');
      return false;
    }
    
    setDateError('');
    return true;
  };

  /**
   * Validate time - must be in the future if date is today
   */
  const validateTime = (timeString: string, dateString: string) => {
    if (!timeString || !dateString) {
      setTimeError('');
      return false;
    }
    
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Only validate time if date is today
    if (selectedDate.getTime() === today.getTime()) {
      const now = new Date();
      const [time, period] = timeString.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) hour24 += 12;
      if (period === 'AM' && hours === 12) hour24 = 0;
      
      const selectedDateTime = new Date();
      selectedDateTime.setHours(hour24, minutes, 0, 0);
      
      if (selectedDateTime < now) {
        setTimeError('Please select a future time');
        return false;
      }
    }
    
    setTimeError('');
    return true;
  };

  /**
   * Handle input field changes
   */
  const handleInputChange = <K extends keyof BookingFormData>(
    field: K,
    value: BookingFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Validate date when it changes
    if (field === 'appointmentDate') {
      validateDate(value as string);
      // Re-validate time if date changes
      if (formData.appointmentTime) {
        validateTime(formData.appointmentTime, value as string);
      }
    }
    
    // Validate time when it changes
    if (field === 'appointmentTime') {
      validateTime(value as string, formData.appointmentDate);
    }
  };

  /**
   * Handle facility selection change
   * Clears service selection when facility changes
   */
  const handleFacilityChange = (facilityId: string) => {
    setFormData((prev) => ({
      ...prev,
      facilityId: facilityId,
      facilityServiceIds: [], // Clear facility service IDs
      selectedServices: [], // Clear selected services
    }));
  };

  /**
   * Handle service selection change
   * Toggles service in selectedServices array and updates facilityServiceIds
   */
  const handleServiceChange = (facilityServiceId: string) => {
    const selectedFS = facilityServices.find(fs => fs.id === facilityServiceId);
    if (!selectedFS) return;

    setFormData((prev) => {
      const isAlreadySelected = prev.selectedServices.some(s => s.id === facilityServiceId);
      
      if (isAlreadySelected) {
        // Remove service
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter(s => s.id !== facilityServiceId),
          facilityServiceIds: prev.facilityServiceIds.filter(id => id !== facilityServiceId),
        };
      } else {
        // Add service
        return {
          ...prev,
          selectedServices: [
            ...prev.selectedServices,
            {
              id: facilityServiceId,
              name: selectedFS.service.name,
              price: selectedFS.price,
            }
          ],
          facilityServiceIds: [...prev.facilityServiceIds, facilityServiceId],
        };
      }
    });
  };

  /**
   * Validate if all required fields are filled
   * Returns true if form is valid
   */
  const isFormValid = (): boolean => {
    // Check basic required fields
    if (!formData.appointmentDate || 
        !formData.appointmentTime || 
        !formData.address ||
        !formData.patientName || 
        !formData.patientEmail || 
        !formData.patientPhone || 
        formData.selectedServices.length === 0 || 
        !formData.consent ||
        dateError !== '' ||
        timeError !== '') {
      return false;
    }
    return true;
  }
  //   // If booking for someone else, check patient information
  //   if (formData.relationshipToUser !== 'SELF') {
  //     if (!formData.patientName || 
  //         !formData.patientEmail || 
  //         !formData.patientPhone) {
  //       return false;
  //     }
  //   }

  //   return true;
  // };

  /**
   * Handle form submission
   * Navigate to payment page with form data (don't create appointment yet)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Don't create appointment yet - just go to payment selection
    // Appointment will be created after payment method selection
    console.log('Navigating to payment page with form data');

    // Navigate to payment page with form data
    navigate('/payment', {
      state: {
        formData: formData,
        email: formData.patientEmail
      }
    });
  };

  // // Hardcoded facilities - should be fetched from API in production
  // const facilities = [
  //   { id: "1", name: "Quest Diagnostics" },
  //   { id: "2", name: "LabCorp" },
  //   { id: "3", name: "Accra Central Lab" },
  //   { id: "4", name: "MobiPhleb Partner Lab" }
  // ];

  // // Service types
  // const serviceTypes = [
  //   { value: "routine_blood_work", label: "Routine Blood Work" },
  //   { value: "comprehensive_panel", label: "Comprehensive Panel" },
  //   { value: "diabetes_monitoring", label: "Diabetes Monitoring" },
  //   { value: "cholesterol_check", label: "Cholesterol Check" },
  //   { value: "other", label: "Other (specify in notes)" }
  // ];

  // Relationship options
  const relationshipOptions: { value: RelationshipType; label: string }[] = [
    { value: 'SELF', label: 'Myself' },
    { value: 'CHILD', label: 'My Child' },
    { value: 'PARENT', label: 'My Parent' },
    { value: 'SPOUSE', label: 'My Spouse' },
    { value: 'SIBLING', label: 'My Sibling' },
    { value: 'RELATIVE', label: 'Other Relative' },
    { value: 'FRIEND', label: 'Friend' },
    { value: 'OTHER', label: 'Other' },
  ];

  /**
   * Main booking form
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Page header */}
          <div className="text-center mb-8">
            <h1 className="text-xl lg:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Book Your Appointment
            </h1>
            <p className="sub-heading">
              Schedule convenient blood testing at your home or office
            </p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="h-16 flex items-center bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-2">
                <CalendarDays className="w-8 h-8" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Who is this appointment for? */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-10 h-10 p-2 bg-[#ddd6fe] rounded-full flex items-center justify-center">
                      <User className="icon" />
                    </div>
                    Who is this appointment for?
                  </h3>
                  
                  <div>
                    <Label className="label">
                      I am booking for <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.relationshipToUser} 
                      onValueChange={(value: RelationshipType) => 
                        handleInputChange('relationshipToUser', value)
                      }
                      required
                    >
                      <SelectTrigger className="mt-1 w-full input-field">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-gray-900 border-none">
                        {relationshipOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Patient Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patientName" className="label">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="patientName"
                        value={formData.patientName}
                        onChange={(e) => handleInputChange('patientName', e.target.value)}
                        required
                        className="mt-1 input-field"
                        placeholder="Patient's full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="patientEmail" className="label">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="patientEmail"
                        type="email"
                        value={formData.patientEmail}
                        onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                        required
                        className="mt-1 input-field"
                        placeholder="patient@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patientPhone" className="label">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="patientPhone"
                        type="tel"
                        value={formData.patientPhone}
                        onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                        required
                        className="mt-1 input-field"
                        placeholder="+233 24 123 4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="patientAge" className="label">
                        Age
                      </Label>
                      <Input
                        id="patientAge"
                        type="number"
                        value={formData.patientAge}
                        onChange={(e) => handleInputChange('patientAge', e.target.value)}
                        className="mt-1 input-field"
                        min="0"
                        max="150"
                        placeholder="Age"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="label">Gender</Label>
                    <Select 
                      value={formData.patientGender || ""} 
                      onValueChange={(value: Gender) => handleInputChange('patientGender', value)}
                    >
                      <SelectTrigger className="mt-1 w-full input-field">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-gray-900 border-none">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Service Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-10 h-10 p-2 bg-[#ddd6fe] rounded-full flex items-center justify-center">
                      <MapPin className="icon" />
                    </div>
                    Service Location
                  </h3>
                  
                  <GoogleMapsLocationPicker
                    onLocationSelect={(address, coordinates) => {
                      handleInputChange('address', address);
                      if (coordinates) {
                        handleInputChange('userLocation', {
                          latitude: coordinates.lat,
                          longitude: coordinates.lng
                        });
                      }
                    }}
                    initialValue={formData.address}
                    required={true}
                  />
                </div>

                {/* Appointment Timing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-10 h-10 p-2 bg-[#ddd6fe] rounded-full flex items-center justify-center">
                      <Clock className="icon" />
                    </div>
                    Preferred Schedule
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="label">
                        Preferred Date <span className="text-red-500">*</span>
                      </Label>
                      <DatePickerInput 
                        value =  {formData.appointmentDate}
                        onChange={(date) => handleInputChange('appointmentDate', date ? date : "")}
                      />
                      {dateError && (
                        <p className="text-red-500 text-sm mt-1">{dateError}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 pt-2">
                        Preferred Time <span className="text-red-500">*</span>
                      </Label>
                      <TimePicker
                        label="Preferred Time"
                        name="appointmentTime"
                        defaultValue={formData.appointmentTime}
                        onChange={(value) => handleInputChange('appointmentTime', value)}
                        required
                        className="mt-1 w-full input-field"
                      />
                      {timeError && (
                        <p className="text-red-500 text-sm mt-1">{timeError}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lab Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Lab Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="label">
                        Lab Facility <span className="text-red-500">*</span>
                      </Label>
                      <DropdownCombobox
                        items={facilities.map((facility: PartnerFacility) => ({
                          id: facility.id,
                          name: facility.facilityName,
                        }))}
                        value={formData.facilityId}
                        onValueChange={(value) => handleFacilityChange(value)}
                        placeholder={
                          facilitiesLoading
                            ? "Loading facilities..."
                            : "Select a lab facility"
                        }
                        searchPlaceholder="Search facilities..."
                        emptyText="No facilities available"
                        className="mt-1 w-full input-field"
                        disabled={facilitiesLoading}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="label">
                        Service Type(s) <span className="text-red-500">*</span>
                      </Label>
                      {!formData.facilityId ? (
                        <div className="mt-1 p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
                          Please select a facility first
                        </div>
                      ) : facilityServicesLoading ? (
                        <div className="mt-1 p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
                          Loading services...
                        </div>
                      ) : facilityServices.length === 0 ? (
                        <div className="mt-1 p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
                          No services available for this facility
                        </div>
                      ) : (
                        <div className="mt-2 space-y-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-3">
                          {facilityServices.map((fs: FacilityService) => {
                            const isSelected = formData.selectedServices.some(s => s.id === fs.id);
                            return (
                              <label
                                key={fs.id}
                                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-primaryColor bg-violet-50'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleServiceChange(fs.id)}
                                    className="w-4 h-4 text-primaryColor border-gray-300 rounded focus:ring-primaryColor"
                                  />
                                  <span className="text-sm font-medium text-gray-900">
                                    {fs.service.name}
                                  </span>
                                </div>
                                <span className="text-sm font-semibold text-primaryColor">
                                  GHS {fs.price.toFixed(2)}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                      {formData.selectedServices.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-2">
                            Selected Services ({formData.selectedServices.length}):
                          </p>
                          <ul className="text-sm text-blue-800 space-y-1">
                            {formData.selectedServices.map((service) => (
                              <li key={service.id} className="flex justify-between">
                                <span>{service.name}</span>
                                <span className="font-medium">GHS {service.price.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-2 pt-2 border-t border-blue-300 flex justify-between">
                            <span className="font-semibold text-blue-900">Subtotal:</span>
                            <span className="font-semibold text-blue-900">
                              GHS {formData.selectedServices.reduce((sum, s) => sum + s.price, 0).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-blue-700 mt-2">
                            Note: The facility will contact you on how to pay for the selected services and inform you of additional charges if any.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Patient Number Section */}
                  <div className="patient-number-section">
                    <Label className="label">Are you a patient at the selected facility?</Label>
                    <div className="flex items-center gap-4 mb-3">
                      <Label className="inline-flex items-center text-gray-700">
                        <input
                          type="radio"
                          name="hasPatientNo"
                          className="mr-2"
                          checked={hasPatientNo}
                          onChange={() => setHasPatientNo(true)}
                        />
                        <span>Yes</span>
                      </Label>
                      <Label className="inline-flex items-center text-gray-700">
                        <input
                          type="radio"
                          name="hasPatientNo"
                          className="mr-2"
                          checked={!hasPatientNo}
                          onChange={() => {
                            setHasPatientNo(false);
                            handleInputChange('patientNumber', '');
                          }}
                        />
                        <span>No</span>
                      </Label>
                    </div>

                    {hasPatientNo && (
                      <div className="patient-field">
                        <Label htmlFor="patientNumber" className="label">Patient Number</Label>
                        <Input
                          id="patientNumber"
                          value={formData.patientNumber || ""}
                          onChange={(e) => handleInputChange('patientNumber', e.target.value)}
                          placeholder="Patient ID or reference number"
                          className="mt-1 input-field"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Prescription Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Lab Request</h3>
                  <div>
                    <Label htmlFor="prescriptionFile" className="label">Upload Lab Request</Label>
                    <Input
                      id="prescriptionFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleInputChange('prescriptionFile', e.target.files?.[0] || null)}
                      className="mt-1 input-field"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload your doctor's lab request (PDF, JPG, PNG formats accepted)
                    </p>
                  </div>
                </div>

                {/* Special Requirements */}
                <div>
                  <Label htmlFor="notes" className="label">Additional Information or Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ""}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any special instructions, medical conditions, or requirements we should know about"
                    className="mt-1 input-field"
                    rows={3}
                  />
                </div>

                {/* Consent */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.consent}
                    onChange={(e) => handleInputChange('consent', e.target.checked)}
                    className="mt-1 h-4 input-field text-primaryColour border-gray-300 rounded focus:ring-primaryColour"
                    required
                  />
                  <Label htmlFor="consent" className="text-sm text-gray-700">
                    <p>
                      By checking this box, I consent to the collection and processing of my personal 
                      and health information for the purpose of providing phlebotomy services. I understand 
                      that my information will be handled in accordance with
                      <a 
                        href="/Terms"
                        className="text-primaryColor hover:underline ml-1"
                      >
                        Terms of Service and Privacy Policy.
                      </a>
                    </p>
                    <span className="text-sm text-red-500"> *</span>
                  </Label>
                </div>
                                
                {/* Submit Button */}
                <div className="">
                  <Button 
                    disabled={!isFormValid()} 
                    type="submit" 
                    className="w-full py-3 text-white bg-gradient-to-r from-purple-500 to-violet-500 hover:bg-none hover:border-2 hover:border-primaryColor hover:text-primaryColor focus:ring-4 focus:outline-none focus:ring-primaryColor font-medium rounded-4xl text-sm text-center transition-colors duration-300 ease-in-out"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
