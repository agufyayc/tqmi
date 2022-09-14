import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LegalEntityFormService, LegalEntityFormGroup } from './legal-entity-form.service';
import { ILegalEntity } from '../legal-entity.model';
import { LegalEntityService } from '../service/legal-entity.service';
import { IGroup } from 'app/entities/group/group.model';
import { GroupService } from 'app/entities/group/service/group.service';

@Component({
  selector: 'jhi-legal-entity-update',
  templateUrl: './legal-entity-update.component.html',
})
export class LegalEntityUpdateComponent implements OnInit {
  isSaving = false;
  legalEntity: ILegalEntity | null = null;

  groupsSharedCollection: IGroup[] = [];

  editForm: LegalEntityFormGroup = this.legalEntityFormService.createLegalEntityFormGroup();

  constructor(
    protected legalEntityService: LegalEntityService,
    protected legalEntityFormService: LegalEntityFormService,
    protected groupService: GroupService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareGroup = (o1: IGroup | null, o2: IGroup | null): boolean => this.groupService.compareGroup(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ legalEntity }) => {
      this.legalEntity = legalEntity;
      if (legalEntity) {
        this.updateForm(legalEntity);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const legalEntity = this.legalEntityFormService.getLegalEntity(this.editForm);
    if (legalEntity.id !== null) {
      this.subscribeToSaveResponse(this.legalEntityService.update(legalEntity));
    } else {
      this.subscribeToSaveResponse(this.legalEntityService.create(legalEntity));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILegalEntity>>): void {
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

  protected updateForm(legalEntity: ILegalEntity): void {
    this.legalEntity = legalEntity;
    this.legalEntityFormService.resetForm(this.editForm, legalEntity);

    this.groupsSharedCollection = this.groupService.addGroupToCollectionIfMissing<IGroup>(this.groupsSharedCollection, legalEntity.group);
  }

  protected loadRelationshipsOptions(): void {
    this.groupService
      .query()
      .pipe(map((res: HttpResponse<IGroup[]>) => res.body ?? []))
      .pipe(map((groups: IGroup[]) => this.groupService.addGroupToCollectionIfMissing<IGroup>(groups, this.legalEntity?.group)))
      .subscribe((groups: IGroup[]) => (this.groupsSharedCollection = groups));
  }
}
