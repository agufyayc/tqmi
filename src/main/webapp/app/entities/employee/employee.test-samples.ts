import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: 7813,
  abbreviation: 'transmitting',
};

export const sampleWithPartialData: IEmployee = {
  id: 67981,
  abbreviation: 'Cambridgeshire asymmetric',
  firstName: 'Alena',
  email: 'Ricardo.Gldemeister29@hotmail.com',
  phoneNumber: 'internet Ville strategic',
};

export const sampleWithFullData: IEmployee = {
  id: 22575,
  abbreviation: 'sensor',
  firstName: 'Sara',
  lastName: 'Tegethof',
  email: 'Finnja.Zwiener@yahoo.com',
  phoneNumber: 'Representative user-centric',
};

export const sampleWithNewData: NewEmployee = {
  abbreviation: 'open-source pixel',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
