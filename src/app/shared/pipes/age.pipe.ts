import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {

  transform(birthdate: string): number {
    if (!birthdate) {
      console.error('Birthdate is undefined or null');
      return 0;
    }

    let birthdateAsDate: Date | undefined;

    const [day, month, year] = birthdate.split('/').map(Number);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      birthdateAsDate = new Date(year, month - 1, day);
    } else {
      console.error('Invalid date components:', { day, month, year });
      return 0;
    }

    if (isNaN(birthdateAsDate.getTime())) {
      console.error('Invalid date:', birthdate);
      return 0;
    }

    const ageDifMs = Date.now() - birthdateAsDate.getTime();
    const ageDate = new Date(ageDifMs);

    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}
