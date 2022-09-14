import { ILegalEntity, NewLegalEntity } from './legal-entity.model';

export const sampleWithRequiredData: ILegalEntity = {
  id: 57260,
  legalEntityName: 'Automotive Tuna mission-critical',
};

export const sampleWithPartialData: ILegalEntity = {
  id: 95262,
  legalEntityName: 'Unbranded state',
  streetAddress: 'bypassing Granite',
};

export const sampleWithFullData: ILegalEntity = {
  id: 52341,
  legalEntityName: 'Buckinghamshire Checking',
  streetAddress: 'Borders',
  postalCode: 'synthesizing Berkshire',
  city: 'Travanscheid',
  stateProvince: 'Monetary',
};

export const sampleWithNewData: NewLegalEntity = {
  legalEntityName: 'Afghani',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
