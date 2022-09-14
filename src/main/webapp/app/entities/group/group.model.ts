import { IEmployee } from 'app/entities/employee/employee.model';

export interface IGroup {
  id: number;
  groupName?: string | null;
  ceog?: Pick<IEmployee, 'id' | 'abbreviation'> | null;
}

export type NewGroup = Omit<IGroup, 'id'> & { id: null };
