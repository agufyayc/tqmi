import { ICell } from 'app/entities/cell/cell.model';

export interface IEmployee {
  id: number;
  abbreviation?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  cell?: Pick<ICell, 'id' | 'cellName'> | null;
}

export type NewEmployee = Omit<IEmployee, 'id'> & { id: null };
