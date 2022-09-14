import { IGroup, NewGroup } from './group.model';

export const sampleWithRequiredData: IGroup = {
  id: 82913,
  groupName: 'interactive',
};

export const sampleWithPartialData: IGroup = {
  id: 96789,
  groupName: 'Towels withdrawal',
};

export const sampleWithFullData: IGroup = {
  id: 51736,
  groupName: 'Helena Personal transmitter',
};

export const sampleWithNewData: NewGroup = {
  groupName: 'Refined methodologies',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
