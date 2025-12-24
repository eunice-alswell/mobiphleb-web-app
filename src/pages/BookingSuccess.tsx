/**
 * Booking Success Page
 * Displayed after successful payment or cash booking confirmation
 */

import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import Button from "../components/Button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from navigation state
  const { appointmentData, paymentMode, message } = location.state || {};

  // If no state data, show error
  if (!appointmentData && !message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex items-center justify-center py-16">
        <div className="max-w-md mx-auto px-4">
          <Card className="text-center shadow-lg border-0">
            <CardContent className="p-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                No Booking Found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find your booking information. Please try booking again.
              </p>
              <Button 
                label="Go to Booking" 
                onClick={() => navigate('/individual-booking')} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                {paymentMode === 'CASH' 
                  ? 'Appointment Booked Successfully!' 
                  : 'Payment Successful!'}
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {message || 'Thank you for choosing Mobiphleb. Your appointment has been confirmed and our team will contact you shortly with further details.'}
              </p>
              
              {paymentMode === 'CASH' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-900">
                    <strong>Cash Payment Reminder:</strong> Please have the exact amount ready when the phlebotomist arrives. 
                    Payment is due upon service delivery.
                  </p>
                </div>
              )}
              
              <div className="bg-violet-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-primaryColor">
                  <strong>Next Steps:</strong> Our team will call you within 24 hours to confirm your 
                  appointment details and provide any pre-test instructions if needed.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  label="Book Another Appointment" 
                  onClick={() => navigate('/individual-booking')} 
                  customStyle="w-full"
                />
                <Button 
                  label="Return Home" 
                  onClick={() => navigate('/')} 
                  variantStyle="outlineStyle" 
                  customStyle="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
