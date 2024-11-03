import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransformService {

  constructor() { }

  formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else {
        return phone;
    }
  }

  formatDate(dateAny: any): any {
    const date = new Date(dateAny);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = (date.getUTCDate()).toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  formatCep(cep: any): any {
    const cepPattern = /^\d{5}-\d{3}$/;
    if (cepPattern.test(cep)) {
        return cep; 
    }
    return `${cep.substring(0, 5)}-${cep.substring(5, 8)}`;
}


  formatCpf(cpf: string): string {
    const numericCpf = cpf.replace(/\D/g, '');
    return numericCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
}