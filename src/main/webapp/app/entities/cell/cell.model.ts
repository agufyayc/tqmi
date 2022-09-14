import { IEmployee } from 'app/entities/employee/employee.model';
import { ILegalEntity } from 'app/entities/legal-entity/legal-entity.model';

export interface ICell {
  id: number;
  cellName?: string | null;
  bod?: Pick<IEmployee, 'id' | 'abbreviation'> | null;
  ebod?: Pick<IEmployee, 'id' | 'abbreviation'> | null;
  legalEntity?: Pick<ILegalEntity, 'id' | 'legalEntityName'> | null;
}

export type NewCell = Omit<ICell, 'id'> & { id: null };
