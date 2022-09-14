import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../cell.test-samples';

import { CellFormService } from './cell-form.service';

describe('Cell Form Service', () => {
  let service: CellFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CellFormService);
  });

  describe('Service methods', () => {
    describe('createCellFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCellFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cellName: expect.any(Object),
            bod: expect.any(Object),
            ebod: expect.any(Object),
            legalEntity: expect.any(Object),
          })
        );
      });

      it('passing ICell should create a new form with FormGroup', () => {
        const formGroup = service.createCellFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cellName: expect.any(Object),
            bod: expect.any(Object),
            ebod: expect.any(Object),
            legalEntity: expect.any(Object),
          })
        );
      });
    });

    describe('getCell', () => {
      it('should return NewCell for default Cell initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCellFormGroup(sampleWithNewData);

        const cell = service.getCell(formGroup) as any;

        expect(cell).toMatchObject(sampleWithNewData);
      });

      it('should return NewCell for empty Cell initial value', () => {
        const formGroup = service.createCellFormGroup();

        const cell = service.getCell(formGroup) as any;

        expect(cell).toMatchObject({});
      });

      it('should return ICell', () => {
        const formGroup = service.createCellFormGroup(sampleWithRequiredData);

        const cell = service.getCell(formGroup) as any;

        expect(cell).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICell should not enable id FormControl', () => {
        const formGroup = service.createCellFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCell should disable id FormControl', () => {
        const formGroup = service.createCellFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
