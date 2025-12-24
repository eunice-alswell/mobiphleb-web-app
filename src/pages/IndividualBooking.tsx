/**
 * Individual Booking Page
 * Guest appointment booking form integrated with backend API
 * Supports guest users without authentication
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import GoogleMapsLocationPicker from "../components/GoogleMapsLocationPicker";
import { 
  CalendarDays, 
  Clock, 
  MapPin,
  User, 
  AlertCircle 
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { DatePickerInput } from "../components/DatePicker";
import TimePicker from "../components/TimePicker";
import { createGuestAppointment } from "../lib/apiServices";
import type { RelationshipType, Gender } from "../types/api";

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
  location: string;
  
  // Lab information
  facilityId: string;
  serviceType: string;
  patientNumber: string;
  
  // Additional
  notes: string;
  prescriptionFile: File | null;
  consent: boolean;
}

export default function IndividualBooking() {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<BookingFormData>({
    relationshipToUser: "SELF",
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientAge: "",
    patientGender: null,
    appointmentDate: "",
    appointmentTime: "",
    location: "",
    facilityId: "",
    serviceType: "",
    patientNumber: "",
    notes: "",
    prescriptionFile: null,
    consent: false
  });

  const [hasPatientNo, setHasPatientNo] = useState(false);

  /**
   * On success, redirects to payment page
   */
  const mutation = useMutation({
    mutationFn: createGuestAppointment,
    onSuccess: (data) => {
      console.log('Appointment created successfully:', data);
      
      // Redirect to payment page with appointment data
      navigate('/payment', {
        state: {
          appointmentId: data.data?.id,
          appointmentData: formData,
          email: formData.relationshipToUser === 'SELF' 
            ? formData.patientEmail 
            : formData.patientEmail
        }
      });
    },
    onError: (error: Error) => {
      console.error('Error creating appointment:', error);
    },
  });

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
  };

  /**
   * Validate if all required fields are filled
   * Returns true if form is valid
   */
  const isFormValid = (): boolean => {
    // Check basic required fields
    if (!formData.appointmentDate || 
        !formData.appointmentTime || 
        !formData.location || 
        !formData.facilityId || 
        !formData.consent) {
      return false;
    }

    // If booking for someone else, check patient information
    if (formData.relationshipToUser !== 'SELF') {
      if (!formData.patientName || 
          !formData.patientEmail || 
          !formData.patientPhone) {
        return false;
      }
    }

    return true;
  };

  /**
   * Handle form submission
   * Transforms form data to match backend API expectations
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Transform form data to API format
    const apiData = {
      relationshipToUser: formData.relationshipToUser,
      patientName: formData.patientName,
      patientEmail: formData.relationshipToUser,
      patientPhone: formData.relationshipToUser,
      patientAge: formData.patientAge ? parseInt(formData.patientAge) : undefined,
      patientGender: formData.patientGender || undefined,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      location: formData.location,
      facilityId: formData.facilityId || undefined,
      serviceId: formData.serviceType || undefined,
      patientNumber: formData.patientNumber || undefined,
      notes: formData.notes || undefined,
      labRequestFile: formData.prescriptionFile || undefined,
    };

    // Submit to API
    mutation.mutate(apiData);
  };

  // Hardcoded facilities - should be fetched from API in production
  const facilities = [
    { id: "1", name: "Quest Diagnostics" },
    { id: "2", name: "LabCorp" },
    { id: "3", name: "Accra Central Lab" },
    { id: "4", name: "MobiPhleb Partner Lab" }
  ];

  // Service types
  const serviceTypes = [
    { value: "routine_blood_work", label: "Routine Blood Work" },
    { value: "comprehensive_panel", label: "Comprehensive Panel" },
    { value: "diabetes_monitoring", label: "Diabetes Monitoring" },
    { value: "cholesterol_check", label: "Cholesterol Check" },
    { value: "other", label: "Other (specify in notes)" }
  ];

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
              {/* Error alert */}
              {mutation.isError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {mutation.error instanceof Error
                      ? mutation.error.message
                      : mutation.error
                      ? String(mutation.error)
                      : "Something went wrong. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

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
                    <Label htmlFor="relationshipToUser" className="label">
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
                    <Label htmlFor="patientGender" className="label">Gender</Label>
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

                {/* Self booking basic info */}
                {/* {formData.relationshipToUser === 'SELF' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Your Information (Optional)
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="patientAge" className="label">Age</Label>
                        <Input
                          id="patientAge"
                          type="number"
                          value={formData.patientAge}
                          onChange={(e) => handleInputChange('patientAge', e.target.value)}
                          className="mt-1 input-field"
                          min="0"
                          max="150"
                          placeholder="Your age"
                        />
                      </div>
                      <div>
                        <Label htmlFor="patientGender" className="label">Gender</Label>
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
                  </div>
                )} */}

                {/* Service Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-10 h-10 p-2 bg-[#ddd6fe] rounded-full flex items-center justify-center">
                      <MapPin className="icon" />
                    </div>
                    Service Location
                  </h3>
                  
                  <GoogleMapsLocationPicker
                    onLocationSelect={(address) => {
                      handleInputChange('location', address);
                    }}
                    initialValue={formData.location}
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
                      <Label htmlFor="appointmentDate" className="label">
                        Preferred Date <span className="text-red-500">*</span>
                      </Label>
                      <DatePickerInput 
                        value =  {formData.appointmentDate}
                        onChange={(date) => handleInputChange('appointmentDate', date ? date : "")}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 pt-2">
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
                    </div>
                  </div>
                </div>

                {/* Lab Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Lab Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="facilityId" className="label">
                        Lab Facility <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.facilityId} 
                        onValueChange={(value) => handleInputChange('facilityId', value)}
                        required
                      >
                        <SelectTrigger className="mt-1 input-field w-full">
                          <SelectValue placeholder="Select a lab facility" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-gray-900 border-none">
                          {facilities.map((f) => (
                            <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="serviceType" className="label">Service Type</Label>
                      <Select 
                        value={formData.serviceType || ""} 
                        onValueChange={(value) => handleInputChange('serviceType', value)}
                      >
                        <SelectTrigger className="mt-1 input-field w-full">
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-gray-900 border-none">
                          {serviceTypes.map((service) => (
                            <SelectItem key={service.value} value={service.value}>
                              {service.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  <h3 className="text-lg font-semibold text-gray-900">Prescription</h3>
                  <div>
                    <Label htmlFor="prescriptionFile" className="label">Upload Prescription</Label>
                    <Input
                      id="prescriptionFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleInputChange('prescriptionFile', e.target.files?.[0] || null)}
                      className="mt-1 input-field"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload your doctor's prescription (PDF, JPG, PNG formats accepted)
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
                  {/* <Button 
                    disable={mutation.isPending || !isFormValid()} 
                    type="submit" 
                    label={mutation.isPending ? "Processing..." : "Continue to Payment"} 
                    customStyle="w-full py-3 text-lg"
                  /> */}
                  <Button 
                    disabled={mutation.isPending || !isFormValid()} 
                    type="submit" 
                    className="w-full py-3 text-white bg-gradient-to-r from-purple-500 to-violet-500 hover:bg-none hover:border-2 hover:border-primaryColor hover:text-primaryColor focus:ring-4 focus:outline-none focus:ring-primaryColor font-medium rounded-4xl text-sm text-center transition-colors duration-300 ease-in-out"
                  >
                    {mutation.isPending ? "Processing..." : "Continue to Payment"}
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
