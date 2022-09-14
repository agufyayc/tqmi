import { ICell, NewCell } from './cell.model';

export const sampleWithRequiredData: ICell = {
  id: 28109,
  cellName: 'Garden Granite',
};

export const sampleWithPartialData: ICell = {
  id: 59025,
  cellName: 'Tasty Chips',
};

export const sampleWithFullData: ICell = {
  id: 24290,
  cellName: 'interface Concrete',
};

export const sampleWithNewData: NewCell = {
  cellName: 'neural',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
