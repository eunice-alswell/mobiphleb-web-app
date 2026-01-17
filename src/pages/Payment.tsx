/**
 * Payment Page
 * Allows guest users to select payment method before booking
 * Supports CARD, CASH, and MOBILE_MONEY payment modes
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
// import Button as BTN from "@/components/Button";
import { 
  CreditCard, 
  Banknote, 
  Smartphone,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { initializePayment, createGuestAppointment } from "../lib/apiServices";
import type { PaymentMode } from "../types/api";

/**
 * Payment method option interface
 */
interface PaymentMethodOption {
  id: PaymentMode;
  name: string;
  description: string;
  icon: typeof CreditCard;
  available: boolean;
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get form data from navigation state (sent from booking form)
  const formData = location.state?.formData;
  // const patientEmail = appointmentData?.patientEmail || appointmentData?.email || '';

  const [selectedPaymentMode, setSelectedPaymentMode] = useState<PaymentMode | null>("CASH");

  /**
   * Payment method options
   */
  const paymentMethods: PaymentMethodOption[] = [
    {
      id: 'CASH',
      name: 'Cash Payment',
      description: 'Pay cash upon service delivery',
      icon: Banknote,
      available: true
    },
    {
      id: 'CARD',
      name: 'Card Payment',
      description: 'Pay securely with debit/credit card via Paystack',
      icon: CreditCard,
      available: false
    },
    {
      id: 'MOBILE_MONEY',
      name: 'Mobile Money',
      description: 'Pay via MTN Mobile Money or AirtelTigo Money',
      icon: Smartphone,
      available: false
    }
  ];

  /**
   * Calculate pricing from form data
   */
  const selectedServices = formData?.selectedServices || [];
  // const servicesTotal = selectedServices.reduce((sum: number, service: { price: number }) => sum + service.price, 0);
  const basePrice = formData?.basePrice || 250.00; // Default base price if not provided
  const distanceCharge = formData?.distanceCharge || 0; // Default distance charge if not provided
  const totalAmount = basePrice + distanceCharge;// + servicesTotal;
  const conversionRate = 100; // Paystack expects amount in the smallest currency unit
  const amountInPesewas = Math.round(totalAmount * conversionRate);

  const mutation = useMutation({
    mutationFn: async (paymentMode: PaymentMode) => {
      if (paymentMode === 'CASH') {
        // For cash payment, create appointment now
        const apiData = {
          relationshipToUser: formData.relationshipToUser,
          patientName: formData.patientName,
          patientEmail: formData.patientEmail,
          patientPhone: formData.patientPhone,
          patientAge: formData.patientAge ? parseInt(formData.patientAge) : undefined,
          patientGender: formData.patientGender || undefined,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          address: formData.address,
          userLocation: formData.userLocation,
          facilityServiceIds: formData.facilityServiceIds || [],
          patientNumber: formData.patientNumber || undefined,
          notes: formData.notes || undefined,
          labRequestFile: formData.prescriptionFile || undefined,
          // Include calculated pricing
          basePrice: basePrice,
          distanceCharge: distanceCharge,
          totalPrice: totalAmount,
        };
        
        const appointmentResponse = await createGuestAppointment(apiData);
        
        // Clear saved form data after successful creation
        sessionStorage.removeItem('individualBookingFormData');
        
        return { 
          paymentMode: 'CASH', 
          proceedDirectly: true,
          appointmentData: appointmentResponse.data 
        };
      }
      
      // For online payments (CARD/MOBILE_MONEY), create appointment first, then initialize payment
      const apiData = {
        relationshipToUser: formData.relationshipToUser,
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        patientAge: formData.patientAge ? parseInt(formData.patientAge) : undefined,
        patientGender: formData.patientGender || undefined,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        address: formData.address,
        userLocation: formData.userLocation,
        facilityServiceIds: formData.facilityServiceIds || [],
        patientNumber: formData.patientNumber || undefined,
        notes: formData.notes || undefined,
        labRequestFile: formData.prescriptionFile || undefined,
        // Include calculated pricing
        basePrice: basePrice,
        distanceCharge: distanceCharge,
        totalPrice: totalAmount,
      };
      
      const appointmentResponse = await createGuestAppointment(apiData);
      const createdAppointmentId = appointmentResponse.data?.id;
      
      if (!createdAppointmentId) {
        throw new Error('Failed to create appointment');
      }
      
      const response = await initializePayment(createdAppointmentId, {
        email: formData?.patientEmail || formData?.email || '',
        amount: amountInPesewas, // Total amount in pesewas
        currency: 'GHS',
        paymentMode: paymentMode
      });

      // Clear saved form data after successful creation
      sessionStorage.removeItem('individualBookingFormData');

      return { ...response, proceedDirectly: false };
    },
    onSuccess: (data) => {
      if (data.proceedDirectly) {
        // Cash payment - proceed to success page
        navigate('/booking-success', {
          state: { 
            appointmentData: data.appointmentData,
            paymentMode: 'CASH',
            message: 'Your appointment has been booked. Please prepare cash payment for the phlebotomist.'
          }
        });
      } else if ('authorization_url' in data) {
        // Online payment - redirect to payment gateway
        window.location.href = data.authorization_url;
      }
    },
    onError: (error: Error) => {
      console.error('Payment initialization failed:', error);
    },
  });

  /**
   * Handle payment method selection and submission
   */
  const handleProceed = () => {
    if (!selectedPaymentMode) {
      return;
    }

    mutation.mutate(selectedPaymentMode);
  };

  /**
   * Go back to booking form
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  // Redirect if no form data
  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex items-center justify-center py-16">
        <div className="max-w-md mx-auto px-4">
          <Card className="text-center shadow-lg border-0">
            <CardContent className="p-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                No Appointment Found
              </h2>
              <p className="text-gray-600 mb-6">
                Please complete the booking form first.
              </p>
              <Button onClick={() => navigate('/individual-booking')}>
                Go to Booking
              </Button>
              {/* <Button 
                label="Go to Booking" 
                onClick={() => navigate('/individual-booking')} 
              /> */}
            </CardContent>
          </Card>
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
          {/* Back button */}
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-primaryColor hover:text-purple-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Booking Form</span>
          </button>

          {/* Page header */}
          <div className="text-center mb-8">
            <h1 className="text-xl lg:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Select Payment Method
            </h1>
            <p className="sub-heading">
              Choose how you'd like to pay for your appointment
            </p>
          </div>

          {/* Amount display */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-gray-700 font-semibold mb-3">PAYMENT SUMMARY</h2>
            <hr className="my-2 border-gray-300" />
            
            {/* Selected Services */}
            {/* {selectedServices.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-600 mb-2">Selected Services:</p>
                {selectedServices.map((service: { id: string; name: string; price: number }, index: number) => (
                  <div key={index} className="flex justify-between items-center text-sm text-gray-700 mb-1 pl-2">
                    <span>• {service.name}</span>
                    <span className="font-medium">GHS {service.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-sm text-gray-700 mt-2 pt-2 border-t border-gray-300">
                  <span className="font-medium">Services Subtotal:</span>
                  <span className="font-semibold">GHS {servicesTotal.toFixed(2)}</span>
                </div>
              </div>
            )} */}
            <div className="flex justify-between items-center text-sm text-left text-gray-700 mb-1 pl-2">
              <span className="">Base charge:</span>
              <span className="font-medium">GHS {basePrice.toFixed(2)}</span>
            </div>
            {/* Distance Charge */}
            <div className="flex justify-between items-center text-sm text-gray-700 mb-2">
              <span className="">Distance Charge:</span>
              <span className="font-medium">GHS {distanceCharge.toFixed(2)}</span>
            </div>
            
            <hr className="my-3 border-gray-300" />
            
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total Amount:</span>
              <span className="text-lg font-bold text-primaryColor">GHS {totalAmount.toFixed(2)}</span>
            </div>
            
            <p className="text-xs text-gray-500 mt-3">
              {selectedServices.length === 0 && 'No services selected. '}
              All prices are in Ghana Cedis (GHS). Please note that the distance charge may vary based on your location.
            </p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="h-16 flex items-center bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Payment Options
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {/* Error alert - only show for online payment failures */}
              {mutation.isError && selectedPaymentMode !== 'CASH' && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {mutation.error?.message || "Payment initialization failed. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              {/* Security notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900">
                    <strong>Secure Payment:</strong> All online payments are processed securely through Paystack. 
                    Your payment information is encrypted and never stored on our servers.
                  </p>
                </div>
              </div>

              {/* Payment methods */}
              <div className="space-y-4 mb-8">
                <Label className="text-base font-semibold text-gray-900">
                  Select Payment Method <span className="text-red-500">*</span>
                </Label>

                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedPaymentMode === method.id;

                    return (
                      <motion.div
                        key={method.id}
                        whileHover={{ scale: method.available ? 1.02 : 1 }}
                        whileTap={{ scale: method.available ? 0.98 : 1 }}
                      >
                        <button
                          type="button"
                          onClick={() => method.available && setSelectedPaymentMode(method.id)}
                          disabled={!method.available}
                          className={`
                            w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
                            ${isSelected 
                              ? 'border-primaryColor bg-violet-50' 
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                            }
                            ${!method.available && 'opacity-50 cursor-not-allowed'}
                          `}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`
                              w-12 h-12 rounded-full flex items-center justify-center
                              ${isSelected ? 'bg-primaryColor text-white' : 'bg-gray-100 text-gray-600'}
                            `}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-gray-900">{method.name}</h3>
                                {isSelected && (
                                  <CheckCircle className="w-5 h-5 text-primaryColor" />
                                )}
                                {!method.available && (
                                  <span className="text-xs text-gray-500">(Coming Soon)</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Payment details for cash */}
              {selectedPaymentMode === 'CASH' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
                >
                  <h4 className="font-semibold text-green-900 mb-2">Cash Payment Instructions</h4>
                  <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                    <li>Payment will be collected by the phlebotomist upon service delivery</li>
                    <li>Please have the exact amount ready</li>
                    <li>A receipt will be provided after payment</li>
                  </ul>
                </motion.div>
              )}

              

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* <Button
                  label="Back"
                  variantStyle="outlineStyle"
                  onClick={handleGoBack}
                  customStyle="flex-1"
                /> */}
                <Button 
                  onClick={handleGoBack}
                  className="text-primaryColor border border-primaryColor bg-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-violet-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-primaryColor font-medium rounded-4xl text-sm px-5 py-2 text-center transition-colors duration-300 ease-in-out"
                >
                    Back
                </Button>
                <Button 
                    onClick={handleProceed}
                    disabled={!selectedPaymentMode || mutation.isPending} 
                    type="button" 
                    className=" flex-1 w-full py-3 text-white bg-gradient-to-r from-purple-500 to-violet-500 hover:bg-none hover:border-2 hover:border-primaryColor hover:text-primaryColor focus:ring-4 focus:outline-none focus:ring-primaryColor font-medium rounded-4xl text-sm text-center transition-colors duration-300 ease-in-out"
                  >
                    {
                      mutation.isPending 
                        ? "Processing..." 
                        : selectedPaymentMode === 'CASH' 
                          ? "Confirm Booking" 
                          : "Proceed to Payment"
                    }
                  </Button>
                {/* <Button
                  label={
                    mutation.isPending 
                      ? "Processing..." 
                      : selectedPaymentMode === 'CASH' 
                        ? "Confirm Booking" 
                        : "Proceed to Payment"
                  }
                  onClick={handleProceed}
                  disable={!selectedPaymentMode || mutation.isPending}
                  customStyle="flex-1"
                /> */}
              </div>

              {/* Terms notice */}
              <p className="text-xs text-gray-500 text-center mt-6">
                By proceeding, you agree to our{' '}
                <a href="/terms" className="text-primaryColor hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primaryColor hover:underline">
                  Privacy Policy
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
