import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  private screenWidth = new BehaviorSubject<number>(window.innerWidth);
  screenWidth$ = this.screenWidth.asObservable();

  constructor() {
    window.addEventListener('resize', () => {
      this.screenWidth.next(window.innerWidth);
    });
  }

  getScreenWidth(): number {
    return this.screenWidth.value;
  }

  getScreenSize(): 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge' | 'extraWide' {
    const width = this.getScreenWidth();
    if (width <= 380) return 'extraSmall';
    if (width <= 480) return 'small';
    if (width <= 767) return 'medium';
    if (width <= 1023) return 'large';
    if (width <= 1600) return 'extraLarge';
    return 'extraWide';
  }
}
