import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {

  transform(birthDate: string): number {
    if (!birthDate) {
      console.error('Birthdate is undefined or null');
      return 0;
    }

    let birthDateAsDate: Date | undefined;

    const [day, month, year] = birthDate.split('/').map(Number);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      birthDateAsDate = new Date(year, month - 1, day);
    } else {
      console.error('Invalid date components:', { day, month, year });
      return 0;
    }

    if (isNaN(birthDateAsDate.getTime())) {
      console.error('Invalid date:', birthDate);
      return 0;
    }

    const ageDifMs = Date.now() - birthDateAsDate.getTime();
    const ageDate = new Date(ageDifMs);

    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}
