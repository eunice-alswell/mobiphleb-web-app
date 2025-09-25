import { useState } from "react";
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
  // Phone,
  User, 
  // Mail, 
  CheckCircle 
} from "lucide-react";
import { motion } from "framer-motion";
import type { IndividualBookingFormData, Gender } from "@/utils/FormTypes";
import Button from "../components/Button";
import { DatePickerInput } from "../components/DatePicker";
import TimePicker from "../components/TimePicker";
// import { Link } from "react-router-dom"; 

export default function IndividualBooking() {
  const [formData, setFormData] = useState<IndividualBookingFormData>({
    name: "",
    age: "",
    gender: null,
    phone: "",
    location: "",
    appointmentDate: "",
    appointmentTime: "",
    LabFacility: "",
    patientNo: "",
    LabType: "",
    prescriptionFile: null,
    additionalInfo: "",
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [hasPatientNo, setHasPatientNo] = useState(false);

  const handleInputChange = (
      field: keyof IndividualBookingFormData, 
      value: string | boolean | File | null | Gender
    ) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      })
    );
      setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // const res = await fetch('https://api.mobiphleb.com/appointments', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${process.env.API_TOKEN}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      console.log("Form Data Submitted: ", formData);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookAnotherAppointment = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      age: "",
      gender: null,
      phone: "",
      location: "",
      appointmentDate: "",
      appointmentTime: "",
      LabFacility: "",
      patientNo: "",
      LabType: "",
      prescriptionFile: null,
      additionalInfo: "",
      consent: false
    });
  };

  // const timeSlots = [
  //   "8:00 AM - 9:00 AM",
  //   "9:00 AM - 10:00 AM", 
  //   "10:00 AM - 11:00 AM",
  //   "11:00 AM - 12:00 PM",
  //   "1:00 PM - 2:00 PM",
  //   "2:00 PM - 3:00 PM",
  //   "3:00 PM - 4:00 PM",
  //   "4:00 PM - 5:00 PM"
  // ];

  // Example facilities list — replace with API-driven list when onboarding facilities
  const [facilities] = useState<string[]>([
    "Quest Diagnostics",
    "LabCorp",
    "Accra Central Lab",
    "MobiPhleb Partner Lab"
  ]);

  const serviceTypes = [
    { value: "routine_blood_work", label: "Routine Blood Work" },
    { value: "comprehensive_panel", label: "Comprehensive Panel" },
    { value: "diabetes_monitoring", label: "Diabetes Monitoring" },
    { value: "cholesterol_check", label: "Cholesterol Check" },
    { value: "other", label: "Other (specify in notes)" }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="text-center shadow-lg border-0">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Request Submitted!</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Thank you for choosing Mobiphleb. We've received your appointment request and will contact you within 24 hours to confirm your booking and schedule details.
                </p>
                <div className="bg-violet-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-primaryColor">
                    <strong>Next Steps:</strong> Our team will call you to confirm your preferred time slot and provide any pre-test instructions if needed.
                  </p>
                </div>
                <Button label="Book Another Appointment" onClick={handleBookAnotherAppointment} variantStyle="outlineStyle" />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-10 h-10 p-2 bg-[#ddd6fe] rounded-full flex items-center justify-center">
                      <User className="icon" />
                    </div>
                    Personal Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="label">Full Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age" className="label">Age <span className="text-red-500">*</span></Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        required
                        className="mt-1 input-field"
                        min="0"
                        max="120"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gender" className="label">Gender</Label>
                      <Select 
                        value={formData.gender || ""} 
                        onValueChange={(value) => handleInputChange('gender', value as Gender)}
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
                    <div>
                      <Label htmlFor="phone" className="label">Phone Number <span className="text-red-500">*</span></Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="mt-1 input-field"
                      />
                    </div>
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
                      handleInputChange('location', address);
                      // You can also store coordinates if needed
                      console.log('Selected coordinates:', coordinates);
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
                      <Label htmlFor="appointmentDate" className="label">Preferred Date <span className="text-red-500">*</span></Label>
                      <DatePickerInput />
                    </div>
                    
                    <div className="">
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
                      <Label htmlFor="LabFacility" className="label">Lab Facility <span className="text-red-500">*</span></Label>
                      <Select value={formData.LabFacility} onValueChange={(value) => handleInputChange('LabFacility', value)}>
                        <SelectTrigger className="mt-1 input-field w-full">
                          <SelectValue placeholder="Select a lab facility" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-gray-900 border-none">
                          {facilities.map((f) => (
                            <SelectItem key={f} value={f}>{f}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="LabType" className="label">Lab Type</Label>
                      <Select value={formData.LabType || ""} onValueChange={(value) => handleInputChange('LabType', value)}>
                        <SelectTrigger className="mt-1 input-field w-full">
                          <SelectValue placeholder="Select lab type" />
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
                  {/* Show patient number input only if user selects "Yes" */}
                  <div className="patient-number-section">
                    <Label className="label">Are you a patient at the selected facility?</Label>
                    <div className="flex items-center gap-4 mb-3">
                      <Label className="inline-flex items-center text-gray-700">
                        <input
                          id="hasPatientNoYes"
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
                          id="hasPatientNoNo"
                          type="radio"
                          name="hasPatientNo"
                          className="mr-2"
                          checked={!hasPatientNo}
                          onChange={() => {
                            setHasPatientNo(false);
                            handleInputChange('patientNo', '');
                          }}
                        />
                        <span>No</span>
                      </Label>
                    </div>

                    {hasPatientNo && (
                      <div className="patient-field">
                        <Label htmlFor="patientNo" className="label">Patient Number</Label>
                        <Input
                          id="patientNo"
                          value={formData.patientNo || ""}
                          onChange={(e) => handleInputChange('patientNo', e.target.value)}
                          placeholder="Patient ID or reference number (if available)"
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
                  <Label htmlFor="additionalInfo" className="label">Additional Information or Notes</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo || ""}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
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
                      By checking this box, I consent to the collection and processing of my personal and health information for the purpose of providing phlebotomy services. I understand that my information will be handled in accordance with
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
                                
                <Button 
                  disable={isSubmitting} 
                  type="submit" 
                  label={isSubmitting ? "Submitting..." : "Submit Appointment Request"} 
                  customStyle="w-full py-3 text-lg"
                />
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}