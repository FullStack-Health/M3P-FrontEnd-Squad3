import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransformService {

  constructor() { }

  formatPhone(phone: any): any {
    return '(' + phone.substring(0, 2) + ')' + phone.substring(2, 3) + phone.substring(3, 7) + '-' + phone.substring(7, 11);
  }

}