/**
 * API Services
 * Functions for communicating with MobiPhleb backend endpoints
 */

import apiClient from './api';
import type { 
  GuestAppointmentData, 
  CorporateRequestData,
  AppointmentResponse,
  CorporateRequestResponse,
  InitializePaymentData,
  InitializePaymentResponse,
  VerifyPaymentData,
  VerifyPaymentResponse
} from '../types/api';

/**
 * Create a guest appointment (no authentication required)
 * POST /appointments/guest
 * 
 * @param appointmentData - Guest appointment data including files
 * @returns Promise with appointment response
 */
export const createGuestAppointment = async (
  appointmentData: GuestAppointmentData
): Promise<AppointmentResponse> => {
  // Create FormData for file upload support
  const formData = new FormData();
  
  // Append all appointment data to FormData
  formData.append('relationshipToUser', appointmentData.relationshipToUser);
  
  // Patient information (required if not booking for self)
  if (appointmentData.relationshipToUser !== 'SELF') {
    if (appointmentData.patientName) {
      formData.append('patientName', appointmentData.patientName);
    }
    if (appointmentData.patientEmail) {
      formData.append('patientEmail', appointmentData.patientEmail);
    }
    if (appointmentData.patientPhone) {
      formData.append('patientPhone', appointmentData.patientPhone);
    }
  }
  
  // Optional patient details
  if (appointmentData.patientAge !== undefined) {
    formData.append('patientAge', appointmentData.patientAge.toString());
  }
  if (appointmentData.patientGender) {
    formData.append('patientGender', appointmentData.patientGender);
  }
  
  // Appointment details
  formData.append('appointmentDate', appointmentData.appointmentDate);
  formData.append('appointmentTime', appointmentData.appointmentTime);
  formData.append('location', appointmentData.location);
  
  // Optional fields
  if (appointmentData.facilityId) {
    formData.append('facilityId', appointmentData.facilityId);
  }
  if (appointmentData.serviceId) {
    formData.append('serviceId', appointmentData.serviceId);
  }
  if (appointmentData.patientNumber) {
    formData.append('patientNumber', appointmentData.patientNumber);
  }
  if (appointmentData.notes) {
    formData.append('notes', appointmentData.notes);
  }
  
  // Append file if provided
  if (appointmentData.labRequestFile) {
    formData.append('labRequestFile', appointmentData.labRequestFile);
  }
  
  const response = await apiClient.post<AppointmentResponse>(
    '/appointments/guest',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};

/**
 * Create a corporate service request
 * POST /corporate-requests
 * 
 * @param requestData - Corporate request information
 * @returns Promise with corporate request response
 */
export const createCorporateRequest = async (
  requestData: CorporateRequestData
): Promise<CorporateRequestResponse> => {
  const response = await apiClient.post<CorporateRequestResponse>(
    '/corporate-requests',
    requestData
  );
  
  return response.data;
};

/**
 * Get all partnered facilities
 * GET /partnered-facilities/active
 * 
 * @returns Promise with list of partner facilities
 */
export const getActivePartneredFacilities = async () => {
  const response = await apiClient.get('partnered-facilities/active');
  return response.data;
};

/**
 * Get active partner services only
 * GET /partner-services/active
 * 
 * @returns Promise with list of active partner services
 */
export const getActivePartnerServices = async () => {
  const response = await apiClient.get('/partner-services/active');
  return response.data;
};

/**
 * Initialize payment for an appointment
 * POST /payments/initialize/:appointmentId
 * Requires authentication token
 * 
 * @param appointmentId - Appointment ID to pay for
 * @param paymentData - Payment initialization data
 * @returns Promise with payment authorization URL and details
 */
export const initializePayment = async (
  appointmentId: string,
  paymentData: Omit<InitializePaymentData, 'appointmentId'>
): Promise<InitializePaymentResponse> => {
  const response = await apiClient.post<InitializePaymentResponse>(
    `/payments/initialize/guest/${appointmentId}`,
    {
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      email: paymentData.email,
      amount: paymentData.amount,
      currency: paymentData.currency,
      paymentMode: paymentData.paymentMode,
      status: 'PENDING'
    }
  );
  
  return response.data;
};

/**
 * Verify payment status
 * POST /payments/verify
 * 
 * @param verifyData - Payment verification data (reference)
 * @returns Promise with payment verification result
 */
export const verifyPayment = async (
  verifyData: VerifyPaymentData
): Promise<VerifyPaymentResponse> => {
  const response = await apiClient.post<VerifyPaymentResponse>(
    '/payments/verify',
    verifyData
  );
  
  return response.data;
};
