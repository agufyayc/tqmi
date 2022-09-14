import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../legal-entity.test-samples';

import { LegalEntityFormService } from './legal-entity-form.service';

describe('LegalEntity Form Service', () => {
  let service: LegalEntityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LegalEntityFormService);
  });

  describe('Service methods', () => {
    describe('createLegalEntityFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLegalEntityFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            legalEntityName: expect.any(Object),
            streetAddress: expect.any(Object),
            postalCode: expect.any(Object),
            city: expect.any(Object),
            stateProvince: expect.any(Object),
            group: expect.any(Object),
          })
        );
      });

      it('passing ILegalEntity should create a new form with FormGroup', () => {
        const formGroup = service.createLegalEntityFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            legalEntityName: expect.any(Object),
            streetAddress: expect.any(Object),
            postalCode: expect.any(Object),
            city: expect.any(Object),
            stateProvince: expect.any(Object),
            group: expect.any(Object),
          })
        );
      });
    });

    describe('getLegalEntity', () => {
      it('should return NewLegalEntity for default LegalEntity initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLegalEntityFormGroup(sampleWithNewData);

        const legalEntity = service.getLegalEntity(formGroup) as any;

        expect(legalEntity).toMatchObject(sampleWithNewData);
      });

      it('should return NewLegalEntity for empty LegalEntity initial value', () => {
        const formGroup = service.createLegalEntityFormGroup();

        const legalEntity = service.getLegalEntity(formGroup) as any;

        expect(legalEntity).toMatchObject({});
      });

      it('should return ILegalEntity', () => {
        const formGroup = service.createLegalEntityFormGroup(sampleWithRequiredData);

        const legalEntity = service.getLegalEntity(formGroup) as any;

        expect(legalEntity).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILegalEntity should not enable id FormControl', () => {
        const formGroup = service.createLegalEntityFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLegalEntity should disable id FormControl', () => {
        const formGroup = service.createLegalEntityFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
