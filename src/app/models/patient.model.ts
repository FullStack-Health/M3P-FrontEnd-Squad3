export class Patient {
    static birthDate(birthDate: any) {
      throw new Error('Method not implemented.');
    }
    fullName: string = '';
    gender: string = '';
    birthDate: string = '';
    cpf: string = '';
    rg: string = '';
    // issOrg: string = '';
    maritalStatus: string = '';
    phone: string = '';
    email: string = '';
    placeOfBirth: string = '';
    emergencyContact: string = '';
    // emergContNumber: string = '';
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
  }
