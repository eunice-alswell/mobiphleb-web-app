/**
 * Corporate Services Page
 * Corporate wellness inquiry form integrated with backend API
 * Allows organizations to request corporate health services
 */

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import Button from "../components/Button";
import { 
  Building2, 
  Users, 
  Shield, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  ArrowBigDown
} from "lucide-react";
import { motion } from "framer-motion";
import { createCorporateRequest } from "../lib/apiServices";

/**
 * Form data structure for corporate inquiry
 */
interface CorporateFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  numberOfEmployees: string;
  serviceFrequency: string;
  servicesOfInterest: string[];
  additionalRequirements: string;
}

export default function CorporateServicesPage() {
  // Form state
  const [formData, setFormData] = useState<CorporateFormData>({
    companyName: "",
    contactPerson: "",
    email: "",
    phoneNumber: "",
    address: "",
    numberOfEmployees: "",
    serviceFrequency: "",
    servicesOfInterest: [],
    additionalRequirements: ""
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  /**
   * React Query mutation for creating corporate request
   * Handles API communication and state management
   */
  const mutation = useMutation({
    mutationFn: createCorporateRequest,
    onSuccess: (data) => {
      console.log('Corporate request created successfully:', data);
      setShowSuccessMessage(true);
      
      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        handleSubmitAnotherInquiry();
      }, 10000);
    },
    onError: (error: Error) => {
      console.error('Error creating corporate request:', error);
    },
  });

  /**
   * Handle input field changes
   */
  const handleInputChange = (field: keyof CorporateFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle service type checkbox changes
   */
  const handleServiceTypeChange = (serviceType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      servicesOfInterest: checked 
        ? [...prev.servicesOfInterest, serviceType]
        : prev.servicesOfInterest.filter((type: string) => type !== serviceType)
    }));
  };

  /**
   * Handle form submission
   * Transforms form data to match backend API expectations (snake_case)
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Transform form data to API format with snake_case
    const apiData = {
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address || undefined,
      numberOfEmployees: formData.numberOfEmployees,
      serviceFrequency: formData.serviceFrequency,
      servicesOfInterest: formData.servicesOfInterest,
      additionalRequirements: formData.additionalRequirements || undefined,
    };

    // Submit to API
    mutation.mutate(apiData);
  };

  /**
   * Reset form for another inquiry
   */
  const handleSubmitAnotherInquiry = () => {
    mutation.reset();
    setFormData({
      companyName: "",
      contactPerson: "",
      email: "",
      phoneNumber: "",
      address: "",
      numberOfEmployees: "",
      serviceFrequency: "",
      servicesOfInterest: [],
      additionalRequirements: ""
    });
  };

  const corporateBenefits = [
    {
      icon: TrendingUp,
      title: "Boost Productivity",
      description: "Reduce employee sick days and improve overall workplace wellness"
    },
    {
      icon: Shield,
      title: "Convenient & Safe",
      description: "On-site testing eliminates travel time and maintains workplace safety"
    },
    {
      icon: Users,
      title: "Employee Satisfaction", 
      description: "Show you care about employee health with convenient wellness programs"
    }
  ];

  const serviceOptions = [
    { 
      id: "executive_health_screening",
      label: "Executive Health Screening",
      description: "Comprehensive health panels for leadership teams"
    },
    {
      id: "employee_wellness_program", 
      label: "Employee Wellness Program",
      description: "Regular health screenings for all staff members"
    },
    {
      id: "annual_health_checkup",
      label: "Annual Health Checkups", 
      description: "Yearly comprehensive testing programs"
    },
    {
      id: "pre_employment_screening",
      label: "Pre-Employment Screening",
      description: "Health testing for new hires"
    },
    {
      id: "custom_package",
      label: "Custom Package",
      description: "Tailored solutions based on your specific needs"
    }
  ];

  /**
   * Success state - show after successful submission
   */
  if (mutation.isSuccess && showSuccessMessage) {
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Corporate Inquiry Submitted!
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Thank you for your interest in Mobiphleb's corporate services. Our business 
                  development team will contact you within 48 hours to discuss your requirements 
                  and provide a customized proposal.
                </p>
                <div className="bg-violet-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-primaryColor">
                    <strong>Next Steps:</strong> We'll schedule a consultation call to understand 
                    your specific needs and create a tailored wellness program for your organization.
                  </p>
                </div>
                <div className="mt-6 flex justify-center">
                  <Button label="Submit Another Inquiry" variantStyle="outlineStyle" onClick={handleSubmitAnotherInquiry} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  /**
   * Main corporate inquiry form
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Building2 className="w-16 h-16 mx-auto mb-6 text-red-700" />
            <h1 className="text-2xl lg:text-3xl md:text-5xl font-bold mb-6">
              Corporate Wellness Solutions
            </h1>
            <p className="text-base lg:text-lg md:text-lg text-grey-50 mb-8 max-w-3xl mx-auto leading-relaxed">
              Enhance employee health and productivity with on-site phlebotomy services. 
              Professional, convenient, and tailored to your organization's needs.
            </p>
            <a href="#contact-form" className="inline-block mt-4 px-6 py-3 bg-white text-violet-700 font-semibold rounded-lg shadow-md hover:bg-violet-100 transition">
              Get Started
              <ArrowBigDown className="w-4 h-4 inline-block ml-2" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Corporate Services?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {corporateBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                  <CardContent className="p-8">
                    <div className="icon-div">
                      <benefit.icon className="icon" />
                    </div>
                    <h3 className="card-title">
                      {benefit.title}
                    </h3>
                    <p className="card-p">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16" id="contact-form">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get Started with Corporate Services
              </h2>
              <p className="sub-heading">
                Tell us about your organization and we'll create a customized wellness solution
              </p>
            </div>

            <Card className="shadow-lg border-0">
              <CardHeader className="h-16 flex items-center bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building2 className="w-6 h-6" />
                  Corporate Inquiry Form
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Error alert */}
                {mutation.isError && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {mutation.error?.message || "Something went wrong. Please try again."}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName" className="label">Company Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          required
                          className="mt-1 input-field"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPerson" className="label">Contact Person <span className="text-red-500">*</span></Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                          required
                          className="mt-1 input-field"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="label">Business Email <span className="text-red-500">*</span></Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          className="mt-1 input-field"
                          placeholder="company@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phoneNumber" className="label">Business Phone <span className="text-red-500">*</span></Label>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          required
                          className="mt-1 input-field"
                          placeholder="+233 30 123 4567"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="label">Company Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Complete business address where services would be provided"
                        className="mt-1 input-field"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Service Requirements */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Service Requirements</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="numberOfEmployees" className="label">Number of Employees <span className="text-red-500">*</span></Label>
                        <Select 
                          value={formData.numberOfEmployees} 
                          onValueChange={
                            (value: string) => handleInputChange('numberOfEmployees', value)}
                          required
                        >
                          <SelectTrigger className="mt-1 input-field w-full">
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-gray-900 border-none">
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-100">51-100 employees</SelectItem>
                            <SelectItem value="101-500">101-500 employees</SelectItem>
                            <SelectItem value="500+">500+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="serviceFrequency" className="label">Service Frequency <span className="text-red-500">*</span></Label>
                        <Select 
                          value={formData.serviceFrequency} 
                          onValueChange={(value: string) => handleInputChange('serviceFrequency', value)}
                          required
                        >
                          <SelectTrigger className="mt-1 input-field w-full">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-gray-900 border-none">
                            <SelectItem value="one-time">One-time service</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                            <SelectItem value="custom">Custom schedule</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="label">Services of Interest</Label>
                      <div className="mt-3 space-y-3">
                        {serviceOptions.map((service) => (
                          <div key={service.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 input-field">
                            <Checkbox
                              id={service.id}
                              checked={formData.servicesOfInterest.includes(service.id)}
                              onCheckedChange={(checked: boolean) => handleServiceTypeChange(service.id, checked)}
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <Label htmlFor={service.id} className="text-sm font-medium cursor-pointer">
                                {service.label}
                              </Label>
                              <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="additionalRequirements" className="label">Additional Requirements</Label>
                    <Textarea
                      id="additionalRequirements"
                      value={formData.additionalRequirements}
                      onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                      placeholder="Any specific requirements, questions, or additional information about your needs"
                      className="mt-1 input-field"
                      rows={4}
                    />
                  </div>
                  <Button
                    type="submit"
                    label={mutation.isPending ? "Submitting..." : "Request Corporate Consultation"}
                    size="large"
                    customStyle="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                    disable={mutation.isPending}
                  />
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}