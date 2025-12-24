/**
 * API Type Definitions
 * TypeScript interfaces for API requests and responses
 */

/**
 * Relationship types for appointment booking
 */
export type RelationshipType = 
  | 'SELF' 
  | 'CHILD' 
  | 'PARENT' 
  | 'SPOUSE' 
  | 'SIBLING' 
  | 'RELATIVE' 
  | 'FRIEND' 
  | 'OTHER';

/**
 * Gender options
 */
export type Gender = 'Male' | 'Female' | 'Other';

/**
 * Payment mode options
 */
export type PaymentMode = 'CARD' | 'CASH' | 'MOBILE_MONEY';

/**
 * Payment status
 */
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

/**
 * Guest appointment data structure matching backend API
 */
export interface GuestAppointmentData {
  // Patient relationship
  relationshipToUser: RelationshipType;
  
  // Patient information (required if not SELF)
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  patientAge?: number;
  patientGender?: Gender;
  
  // Appointment details
  appointmentDate: string; // ISO 8601 date string
  appointmentTime: string; // e.g., "09:00 AM"
  location: string;
  
  // Optional service details
  facilityId?: string;
  serviceId?: string;
  patientNumber?: string;
  notes?: string;
  
  // File upload
  labRequestFile?: File;
}

/**
 * Appointment response from backend
 */
export interface AppointmentResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    appointmentDate: string;
    appointmentTime: string;
    location: string;
    status: string;
    createdAt: string;
  };
}

/**
 * Corporate request data structure
 */
export interface CorporateRequestData {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  company_address?: string;
  employees_count: string;
  service_frequency: string;
  service_types?: string[];
  additional_notes?: string;
}

/**
 * Corporate request response from backend
 */
export interface CorporateRequestResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    company_name: string;
    status: string;
    createdAt: string;
  };
}

/**
 * Partner service structure
 */
export interface PartnerService {
  id: string;
  name: string;
  description?: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * API Error response structure
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

/**
 * Payment initialization data
 */
export interface InitializePaymentData {
  appointmentId: string;
  email: string;
  amount: number;
  currency: string;
  paymentMode: PaymentMode;
}

/**
 * Payment initialization response
 */
export interface InitializePaymentResponse {
  access_code: string;
  authorization_url: string;
  reference: string;
  payment: {
    id: string;
    transactionId: string;
    amount: number;
    currency: string;
    paymentMode: PaymentMode;
    status: PaymentStatus;
  };
}

/**
 * Payment verification data
 */
export interface VerifyPaymentData {
  reference: string;
}

/**
 * Payment verification response
 */
export interface VerifyPaymentResponse {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  payment: {
    id: string;
    status: PaymentStatus;
  };
}
