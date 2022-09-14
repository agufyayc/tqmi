import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILegalEntity } from '../legal-entity.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../legal-entity.test-samples';

import { LegalEntityService } from './legal-entity.service';

const requireRestSample: ILegalEntity = {
  ...sampleWithRequiredData,
};

describe('LegalEntity Service', () => {
  let service: LegalEntityService;
  let httpMock: HttpTestingController;
  let expectedResult: ILegalEntity | ILegalEntity[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LegalEntityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a LegalEntity', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const legalEntity = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(legalEntity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LegalEntity', () => {
      const legalEntity = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(legalEntity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LegalEntity', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LegalEntity', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LegalEntity', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLegalEntityToCollectionIfMissing', () => {
      it('should add a LegalEntity to an empty array', () => {
        const legalEntity: ILegalEntity = sampleWithRequiredData;
        expectedResult = service.addLegalEntityToCollectionIfMissing([], legalEntity);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(legalEntity);
      });

      it('should not add a LegalEntity to an array that contains it', () => {
        const legalEntity: ILegalEntity = sampleWithRequiredData;
        const legalEntityCollection: ILegalEntity[] = [
          {
            ...legalEntity,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLegalEntityToCollectionIfMissing(legalEntityCollection, legalEntity);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LegalEntity to an array that doesn't contain it", () => {
        const legalEntity: ILegalEntity = sampleWithRequiredData;
        const legalEntityCollection: ILegalEntity[] = [sampleWithPartialData];
        expectedResult = service.addLegalEntityToCollectionIfMissing(legalEntityCollection, legalEntity);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(legalEntity);
      });

      it('should add only unique LegalEntity to an array', () => {
        const legalEntityArray: ILegalEntity[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const legalEntityCollection: ILegalEntity[] = [sampleWithRequiredData];
        expectedResult = service.addLegalEntityToCollectionIfMissing(legalEntityCollection, ...legalEntityArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const legalEntity: ILegalEntity = sampleWithRequiredData;
        const legalEntity2: ILegalEntity = sampleWithPartialData;
        expectedResult = service.addLegalEntityToCollectionIfMissing([], legalEntity, legalEntity2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(legalEntity);
        expect(expectedResult).toContain(legalEntity2);
      });

      it('should accept null and undefined values', () => {
        const legalEntity: ILegalEntity = sampleWithRequiredData;
        expectedResult = service.addLegalEntityToCollectionIfMissing([], null, legalEntity, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(legalEntity);
      });

      it('should return initial array if no LegalEntity is added', () => {
        const legalEntityCollection: ILegalEntity[] = [sampleWithRequiredData];
        expectedResult = service.addLegalEntityToCollectionIfMissing(legalEntityCollection, undefined, null);
        expect(expectedResult).toEqual(legalEntityCollection);
      });
    });

    describe('compareLegalEntity', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLegalEntity(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLegalEntity(entity1, entity2);
        const compareResult2 = service.compareLegalEntity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLegalEntity(entity1, entity2);
        const compareResult2 = service.compareLegalEntity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLegalEntity(entity1, entity2);
        const compareResult2 = service.compareLegalEntity(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
