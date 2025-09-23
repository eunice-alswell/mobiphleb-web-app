import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Button from "../components/Button";
import { 
  Building2, 
  Users, 
  Shield, 
  TrendingUp, 
  CheckCircle,
  // Heart,
  // Activity,
  // UserCheck,
  // Calendar,
  // Phone,
  // Mail
} from "lucide-react";
import { motion } from "framer-motion";
import type { CorporateInquiryFormData } from "@/utils/FormTypes";

// interface FormData {
//   company_name: string;
//   contact_person: string;
//   email: string;
//   phone: string;
//   company_address: string;
//   employees_count: string;
//   service_frequency: string;
//   service_types: string[];
//   additional_notes: string;
// }

type CorporateFormField = keyof CorporateInquiryFormData;

export default function CorporateServicesPage() {
  const [formData, setFormData] = useState<CorporateInquiryFormData>({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    company_address: "",
    employees_count: "",
    service_frequency: "",
    service_types: [],
    additional_notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: CorporateFormField, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const handleServiceTypeChange = (serviceType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      service_types: checked 
        ? [...(prev.service_types ?? []), serviceType]
        : (prev.service_types ?? []).filter(type => type !== serviceType)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
  
    try {
      // const res = await fetch("/api/corporate-inquiry", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      // if (!res.ok) {
      //   const text = await res.text().catch(() => null);
      //   throw new Error(text || "Failed to submit corporate inquiry");
      // }
      console.log("Form submitted", formData);
      // Simulate successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnotherInquiry = () => {
    setSubmitted(false);
    setFormData({
      company_name: "",
      contact_person: "",
      email: "",
      phone: "",
      company_address: "",
      employees_count: "",
      service_frequency: "",
      service_types: [],
      additional_notes: ""
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16">
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
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Next Steps:</strong> We'll schedule a consultation call to understand 
                    your specific needs and create a tailored wellness program for your organization.
                  </p>
                </div>
                <Button label="Submit Another Inquiry" variantStyle="outlineStyle" onClick={handleSubmitAnotherInquiry} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Building2 className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Corporate Wellness Solutions
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Enhance employee health and productivity with on-site phlebotomy services. 
              Professional, convenient, and tailored to your organization's needs.
            </p>
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
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <benefit.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
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
      <section className="py-16">
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
              <p className="text-lg text-gray-600">
                Tell us about your organization and we'll create a customized wellness solution
              </p>
            </div>

            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building2 className="w-6 h-6" />
                  Corporate Inquiry Form
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company_name">Company Name *</Label>
                        <Input
                          id="company_name"
                          value={formData.company_name}
                          onChange={(e) => handleInputChange('company_name', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_person">Contact Person *</Label>
                        <Input
                          id="contact_person"
                          value={formData.contact_person}
                          onChange={(e) => handleInputChange('contact_person', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Business Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Business Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company_address">Company Address</Label>
                      <Textarea
                        id="company_address"
                        value={formData.company_address}
                        onChange={(e) => handleInputChange('company_address', e.target.value)}
                        placeholder="Complete business address where services would be provided"
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Service Requirements */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Service Requirements</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="employees_count">Number of Employees *</Label>
                        <Select 
                          value={formData.employees_count} 
                          onValueChange={
                            (value: string) => handleInputChange('employees_count', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-100">51-100 employees</SelectItem>
                            <SelectItem value="101-500">101-500 employees</SelectItem>
                            <SelectItem value="500+">500+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="service_frequency">Service Frequency *</Label>
                        <Select 
                          value={formData.service_frequency} 
                          onValueChange={(value: string) => handleInputChange('service_frequency', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
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
                      <Label className="text-base font-medium">Services of Interest</Label>
                      <div className="mt-3 space-y-3">
                        {serviceOptions.map((service) => (
                          <div key={service.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                            <Checkbox
                              id={service.id}
                              checked={formData.service_types?.includes(service.id) ?? false}
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
                    <Label htmlFor="additional_notes">Additional Requirements</Label>
                    <Textarea
                      id="additional_notes"
                      value={formData.additional_notes}
                      onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                      placeholder="Any specific requirements, questions, or additional information about your needs"
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <Button
                    type="submit"
                    label={isSubmitting ? "Submitting..." : "Request Corporate Consultation"}
                    size="large"
                    customStyle="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                    disable={isSubmitting}
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