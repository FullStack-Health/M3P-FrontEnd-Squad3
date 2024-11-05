import { AppointmentRecord } from "./appointment-record.model";
import { ExamRecord } from "./exam-record.model";

export class PatientRecord {
    id: Number | undefined;
    fullName: string = '';
    gender: string = '';
    birthDate: string = '';
    cpf: string = '';
    rg: string = '';
    issOrg: string = '';
    maritalStatus: string = '';
    phone: string = '';
    email: string = '';
    placeOfBirth: string = '';
    emergencyContact: string = '';
    listOfAllergies?: string;
    listCare?: string;
    healthInsurance: string = '';
    healthInsuranceNumber?: string;
    healthInsuranceVal?: string;
    zipcode: string = '';
    street?: string;
    addressNumber?: string;
    complement?: string;
    referencePoint?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    appointments: AppointmentRecord[] = [];
    exams: ExamRecord[] = [];
  }