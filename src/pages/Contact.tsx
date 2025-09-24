import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Button } from "@/components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "../components/Button";

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

type ContactFormField = keyof ContactFormData;

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: ContactFormField, value: string) => {
    setFormData((prev: ContactFormData) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    window.setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: [
        "+1 (555) 123-4567",
        "24/7 Emergency Line"
      ]
    },
    {
      icon: Mail,
      title: "Email", 
      details: [
        "info@mobiphleb.com",
        "support@mobiphleb.com"
      ]
    },
    {
      icon: MapPin,
      title: "Service Areas",
      details: [
        "Greater Metro Area",
        "Expanding Coverage"
      ]
    },
    {
      icon: Clock,
      title: "Hours",
      details: [
        "Mon-Fri: 7:00 AM - 7:00 PM",
        "Weekend: 8:00 AM - 5:00 PM"
      ]
    }
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Message Sent Successfully!
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Thank you for contacting Mobiphleb. We've received your message and will 
                  respond within 24 hours. For urgent matters, please call our phone line.
                </p>
                {/* action buttons removed */}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="sub-heading">
            Have questions about our services? Need to schedule an appointment? 
            We're here to help and answer all your inquiries.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
                    <MessageSquare className="w-6 h-6 text-primaryColor" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info) => (
                    <div key={info.title} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-violet-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-5 h-5 text-primaryColor" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="shadow-sm border-0 bg-violet-50">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-violet-900 mb-2">Emergency Services</h4>
                  <p className="text-violet-800 text-sm">
                    For urgent blood testing needs outside regular hours, 
                    please call our emergency line for immediate assistance.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader className="h-16 flex items-center bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-t-lg">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Send className="w-6 h-6" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                        <Label htmlFor="phone" className="label">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-1 input-field"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="label">Email Address <span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="mt-1 input-field"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="label">Subject <span className="text-red-500">*</span></Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="What can we help you with?"
                        required
                        className="mt-1 input-field"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="label">Message <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Please provide details about your inquiry or requirements"
                        required
                        className="mt-1 input-field"
                        rows={5}
                      />
                    </div>
                    <Button
                      type="submit"
                      disable={isSubmitting}
                      label={isSubmitting ? "Sending Message..." : "Send Message"}
                      size="large"
                      customStyle="w-full py-3 text-lg"
                    />
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
