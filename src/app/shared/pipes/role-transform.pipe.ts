import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleTransform',
  standalone: true,
})
export class RoleTransformPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'ROLE_ADMIN':
        return 'Administrador(a)';
      case 'ROLE_MEDICO':
        return 'Médico(a)';
      case 'ROLE_PACIENTE':
        return 'Paciente';
      default:
        return value;
    }
  }
}