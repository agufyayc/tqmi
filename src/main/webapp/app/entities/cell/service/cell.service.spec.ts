import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICell } from '../cell.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../cell.test-samples';

import { CellService } from './cell.service';

const requireRestSample: ICell = {
  ...sampleWithRequiredData,
};

describe('Cell Service', () => {
  let service: CellService;
  let httpMock: HttpTestingController;
  let expectedResult: ICell | ICell[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CellService);
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

    it('should create a Cell', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cell = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(cell).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Cell', () => {
      const cell = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(cell).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Cell', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Cell', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Cell', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCellToCollectionIfMissing', () => {
      it('should add a Cell to an empty array', () => {
        const cell: ICell = sampleWithRequiredData;
        expectedResult = service.addCellToCollectionIfMissing([], cell);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cell);
      });

      it('should not add a Cell to an array that contains it', () => {
        const cell: ICell = sampleWithRequiredData;
        const cellCollection: ICell[] = [
          {
            ...cell,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCellToCollectionIfMissing(cellCollection, cell);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Cell to an array that doesn't contain it", () => {
        const cell: ICell = sampleWithRequiredData;
        const cellCollection: ICell[] = [sampleWithPartialData];
        expectedResult = service.addCellToCollectionIfMissing(cellCollection, cell);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cell);
      });

      it('should add only unique Cell to an array', () => {
        const cellArray: ICell[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const cellCollection: ICell[] = [sampleWithRequiredData];
        expectedResult = service.addCellToCollectionIfMissing(cellCollection, ...cellArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const cell: ICell = sampleWithRequiredData;
        const cell2: ICell = sampleWithPartialData;
        expectedResult = service.addCellToCollectionIfMissing([], cell, cell2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cell);
        expect(expectedResult).toContain(cell2);
      });

      it('should accept null and undefined values', () => {
        const cell: ICell = sampleWithRequiredData;
        expectedResult = service.addCellToCollectionIfMissing([], null, cell, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cell);
      });

      it('should return initial array if no Cell is added', () => {
        const cellCollection: ICell[] = [sampleWithRequiredData];
        expectedResult = service.addCellToCollectionIfMissing(cellCollection, undefined, null);
        expect(expectedResult).toEqual(cellCollection);
      });
    });

    describe('compareCell', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCell(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCell(entity1, entity2);
        const compareResult2 = service.compareCell(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCell(entity1, entity2);
        const compareResult2 = service.compareCell(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCell(entity1, entity2);
        const compareResult2 = service.compareCell(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
