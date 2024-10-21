import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareMenuStatusService {

  constructor() { }

  private menuTrueFalse = new BehaviorSubject<boolean>(false);
  menuTrueFalse$ = this.menuTrueFalse.asObservable();

  setMenuTrueFalse(value: boolean) {
    this.menuTrueFalse.next(value);
  }
}
