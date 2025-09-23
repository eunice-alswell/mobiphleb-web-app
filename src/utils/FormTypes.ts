
export type CorporateInquiryFormData = {
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    company_address?: string;
    employees_count: string;
    service_frequency: string;
    service_types?: string[];
    additional_notes?: string;
    status?: string;
};

export type Gender = 'Male' | 'Female' | 'Other';

export type IndividualBookingFormData = {
  name: string;
  age: string;
  gender: Gender | null;
  phone: string;
  location: string;
  appointmentDate: string;
  appointmentTime: string;
  LabFacility: string;
  patientNo?: string;
  LabType?: string;
  prescriptionFile?: File | null;
  additionalInfo?: string;
  consent: boolean;
}