import { Pipe, PipeTransform } from '@angular/core';
import { ScreenService } from '../services/screen.service';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  constructor(private screenService: ScreenService) {}

  transform(value: string, limits: { extraSmall: number; small: number; medium: number; large: number; extraLarge: number; extraWide: number }): string {
    const screenSize = this.screenService.getScreenSize();
    const limit = limits[screenSize];

    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}