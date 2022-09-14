import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EmployeeFormService } from './employee-form.service';
import { EmployeeService } from '../service/employee.service';
import { IEmployee } from '../employee.model';
import { ICell } from 'app/entities/cell/cell.model';
import { CellService } from 'app/entities/cell/service/cell.service';

import { EmployeeUpdateComponent } from './employee-update.component';

describe('Employee Management Update Component', () => {
  let comp: EmployeeUpdateComponent;
  let fixture: ComponentFixture<EmployeeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let employeeFormService: EmployeeFormService;
  let employeeService: EmployeeService;
  let cellService: CellService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmployeeUpdateComponent],
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
      .overrideTemplate(EmployeeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmployeeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    employeeFormService = TestBed.inject(EmployeeFormService);
    employeeService = TestBed.inject(EmployeeService);
    cellService = TestBed.inject(CellService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Cell query and add missing value', () => {
      const employee: IEmployee = { id: 456 };
      const cell: ICell = { id: 70255 };
      employee.cell = cell;

      const cellCollection: ICell[] = [{ id: 7216 }];
      jest.spyOn(cellService, 'query').mockReturnValue(of(new HttpResponse({ body: cellCollection })));
      const additionalCells = [cell];
      const expectedCollection: ICell[] = [...additionalCells, ...cellCollection];
      jest.spyOn(cellService, 'addCellToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(cellService.query).toHaveBeenCalled();
      expect(cellService.addCellToCollectionIfMissing).toHaveBeenCalledWith(
        cellCollection,
        ...additionalCells.map(expect.objectContaining)
      );
      expect(comp.cellsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const employee: IEmployee = { id: 456 };
      const cell: ICell = { id: 15994 };
      employee.cell = cell;

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(comp.cellsSharedCollection).toContain(cell);
      expect(comp.employee).toEqual(employee);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployee>>();
      const employee = { id: 123 };
      jest.spyOn(employeeFormService, 'getEmployee').mockReturnValue(employee);
      jest.spyOn(employeeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employee }));
      saveSubject.complete();

      // THEN
      expect(employeeFormService.getEmployee).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(employeeService.update).toHaveBeenCalledWith(expect.objectContaining(employee));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployee>>();
      const employee = { id: 123 };
      jest.spyOn(employeeFormService, 'getEmployee').mockReturnValue({ id: null });
      jest.spyOn(employeeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employee }));
      saveSubject.complete();

      // THEN
      expect(employeeFormService.getEmployee).toHaveBeenCalled();
      expect(employeeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployee>>();
      const employee = { id: 123 };
      jest.spyOn(employeeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(employeeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCell', () => {
      it('Should forward to cellService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(cellService, 'compareCell');
        comp.compareCell(entity, entity2);
        expect(cellService.compareCell).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
