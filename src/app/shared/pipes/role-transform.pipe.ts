import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleTransform',
  standalone: true,
})
export class RoleTransformPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'SCOPE_ADMIN':
        return 'Admin';
      case 'SCOPE_MEDICO':
        return 'Médico(a)';
      case 'SCOPE_PACIENTE':
        return 'Paciente';
      default:
        return value;
    }
  }
}