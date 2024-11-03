import { JwtPayload } from 'jwt-decode';

export interface CustomJwtPayload extends JwtPayload {
  userFullName: string;
  scope: string;
  patientId?: any;
}