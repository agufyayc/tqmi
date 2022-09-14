import { IGroup } from 'app/entities/group/group.model';

export interface ILegalEntity {
  id: number;
  legalEntityName?: string | null;
  streetAddress?: string | null;
  postalCode?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  group?: Pick<IGroup, 'id' | 'groupName'> | null;
}

export type NewLegalEntity = Omit<ILegalEntity, 'id'> & { id: null };
