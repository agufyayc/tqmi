import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CellFormService } from './cell-form.service';
import { CellService } from '../service/cell.service';
import { ICell } from '../cell.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { ILegalEntity } from 'app/entities/legal-entity/legal-entity.model';
import { LegalEntityService } from 'app/entities/legal-entity/service/legal-entity.service';

import { CellUpdateComponent } from './cell-update.component';

describe('Cell Management Update Component', () => {
  let comp: CellUpdateComponent;
  let fixture: ComponentFixture<CellUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cellFormService: CellFormService;
  let cellService: CellService;
  let employeeService: EmployeeService;
  let legalEntityService: LegalEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CellUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CellUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CellUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cellFormService = TestBed.inject(CellFormService);
    cellService = TestBed.inject(CellService);
    employeeService = TestBed.inject(EmployeeService);
    legalEntityService = TestBed.inject(LegalEntityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Employee query and add missing value', () => {
      const cell: ICell = { id: 456 };
      const bod: IEmployee = { id: 55412 };
      cell.bod = bod;
      const ebod: IEmployee = { id: 26037 };
      cell.ebod = ebod;

      const employeeCollection: IEmployee[] = [{ id: 80595 }];
      jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [bod, ebod];
      const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
      jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ cell });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(
        employeeCollection,
        ...additionalEmployees.map(expect.objectContaining)
      );
      expect(comp.employeesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call LegalEntity query and add missing value', () => {
      const cell: ICell = { id: 456 };
      const legalEntity: ILegalEntity = { id: 9594 };
      cell.legalEntity = legalEntity;

      const legalEntityCollection: ILegalEntity[] = [{ id: 48227 }];
      jest.spyOn(legalEntityService, 'query').mockReturnValue(of(new HttpResponse({ body: legalEntityCollection })));
      const additionalLegalEntities = [legalEntity];
      const expectedCollection: ILegalEntity[] = [...additionalLegalEntities, ...legalEntityCollection];
      jest.spyOn(legalEntityService, 'addLegalEntityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ cell });
      comp.ngOnInit();

      expect(legalEntityService.query).toHaveBeenCalled();
      expect(legalEntityService.addLegalEntityToCollectionIfMissing).toHaveBeenCalledWith(
        legalEntityCollection,
        ...additionalLegalEntities.map(expect.objectContaining)
      );
      expect(comp.legalEntitiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const cell: ICell = { id: 456 };
      const bod: IEmployee = { id: 25757 };
      cell.bod = bod;
      const ebod: IEmployee = { id: 5208 };
      cell.ebod = ebod;
      const legalEntity: ILegalEntity = { id: 69695 };
      cell.legalEntity = legalEntity;

      activatedRoute.data = of({ cell });
      comp.ngOnInit();

      expect(comp.employeesSharedCollection).toContain(bod);
      expect(comp.employeesSharedCollection).toContain(ebod);
      expect(comp.legalEntitiesSharedCollection).toContain(legalEntity);
      expect(comp.cell).toEqual(cell);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICell>>();
      const cell = { id: 123 };
      jest.spyOn(cellFormService, 'getCell').mockReturnValue(cell);
      jest.spyOn(cellService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cell });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cell }));
      saveSubject.complete();

      // THEN
      expect(cellFormService.getCell).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(cellService.update).toHaveBeenCalledWith(expect.objectContaining(cell));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICell>>();
      const cell = { id: 123 };
      jest.spyOn(cellFormService, 'getCell').mockReturnValue({ id: null });
      jest.spyOn(cellService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cell: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cell }));
      saveSubject.complete();

      // THEN
      expect(cellFormService.getCell).toHaveBeenCalled();
      expect(cellService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICell>>();
      const cell = { id: 123 };
      jest.spyOn(cellService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cell });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cellService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEmployee', () => {
      it('Should forward to employeeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(employeeService, 'compareEmployee');
        comp.compareEmployee(entity, entity2);
        expect(employeeService.compareEmployee).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLegalEntity', () => {
      it('Should forward to legalEntityService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(legalEntityService, 'compareLegalEntity');
        comp.compareLegalEntity(entity, entity2);
        expect(legalEntityService.compareLegalEntity).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
