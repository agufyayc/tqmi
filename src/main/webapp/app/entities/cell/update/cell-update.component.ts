import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CellFormService, CellFormGroup } from './cell-form.service';
import { ICell } from '../cell.model';
import { CellService } from '../service/cell.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { ILegalEntity } from 'app/entities/legal-entity/legal-entity.model';
import { LegalEntityService } from 'app/entities/legal-entity/service/legal-entity.service';

@Component({
  selector: 'jhi-cell-update',
  templateUrl: './cell-update.component.html',
})
export class CellUpdateComponent implements OnInit {
  isSaving = false;
  cell: ICell | null = null;

  employeesSharedCollection: IEmployee[] = [];
  legalEntitiesSharedCollection: ILegalEntity[] = [];

  editForm: CellFormGroup = this.cellFormService.createCellFormGroup();

  constructor(
    protected cellService: CellService,
    protected cellFormService: CellFormService,
    protected employeeService: EmployeeService,
    protected legalEntityService: LegalEntityService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEmployee = (o1: IEmployee | null, o2: IEmployee | null): boolean => this.employeeService.compareEmployee(o1, o2);

  compareLegalEntity = (o1: ILegalEntity | null, o2: ILegalEntity | null): boolean => this.legalEntityService.compareLegalEntity(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cell }) => {
      this.cell = cell;
      if (cell) {
        this.updateForm(cell);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cell = this.cellFormService.getCell(this.editForm);
    if (cell.id !== null) {
      this.subscribeToSaveResponse(this.cellService.update(cell));
    } else {
      this.subscribeToSaveResponse(this.cellService.create(cell));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICell>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(cell: ICell): void {
    this.cell = cell;
    this.cellFormService.resetForm(this.editForm, cell);

    this.employeesSharedCollection = this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(
      this.employeesSharedCollection,
      cell.bod,
      cell.ebod
    );
    this.legalEntitiesSharedCollection = this.legalEntityService.addLegalEntityToCollectionIfMissing<ILegalEntity>(
      this.legalEntitiesSharedCollection,
      cell.legalEntity
    );
  }

  protected loadRelationshipsOptions(): void {
    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, this.cell?.bod, this.cell?.ebod)
        )
      )
      .subscribe((employees: IEmployee[]) => (this.employeesSharedCollection = employees));

    this.legalEntityService
      .query()
      .pipe(map((res: HttpResponse<ILegalEntity[]>) => res.body ?? []))
      .pipe(
        map((legalEntities: ILegalEntity[]) =>
          this.legalEntityService.addLegalEntityToCollectionIfMissing<ILegalEntity>(legalEntities, this.cell?.legalEntity)
        )
      )
      .subscribe((legalEntities: ILegalEntity[]) => (this.legalEntitiesSharedCollection = legalEntities));
  }
}
