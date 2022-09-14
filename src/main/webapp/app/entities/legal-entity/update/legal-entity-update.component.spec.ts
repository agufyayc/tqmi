import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LegalEntityFormService } from './legal-entity-form.service';
import { LegalEntityService } from '../service/legal-entity.service';
import { ILegalEntity } from '../legal-entity.model';
import { IGroup } from 'app/entities/group/group.model';
import { GroupService } from 'app/entities/group/service/group.service';

import { LegalEntityUpdateComponent } from './legal-entity-update.component';

describe('LegalEntity Management Update Component', () => {
  let comp: LegalEntityUpdateComponent;
  let fixture: ComponentFixture<LegalEntityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let legalEntityFormService: LegalEntityFormService;
  let legalEntityService: LegalEntityService;
  let groupService: GroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LegalEntityUpdateComponent],
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
      .overrideTemplate(LegalEntityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LegalEntityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    legalEntityFormService = TestBed.inject(LegalEntityFormService);
    legalEntityService = TestBed.inject(LegalEntityService);
    groupService = TestBed.inject(GroupService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Group query and add missing value', () => {
      const legalEntity: ILegalEntity = { id: 456 };
      const group: IGroup = { id: 22432 };
      legalEntity.group = group;

      const groupCollection: IGroup[] = [{ id: 88327 }];
      jest.spyOn(groupService, 'query').mockReturnValue(of(new HttpResponse({ body: groupCollection })));
      const additionalGroups = [group];
      const expectedCollection: IGroup[] = [...additionalGroups, ...groupCollection];
      jest.spyOn(groupService, 'addGroupToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ legalEntity });
      comp.ngOnInit();

      expect(groupService.query).toHaveBeenCalled();
      expect(groupService.addGroupToCollectionIfMissing).toHaveBeenCalledWith(
        groupCollection,
        ...additionalGroups.map(expect.objectContaining)
      );
      expect(comp.groupsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const legalEntity: ILegalEntity = { id: 456 };
      const group: IGroup = { id: 43289 };
      legalEntity.group = group;

      activatedRoute.data = of({ legalEntity });
      comp.ngOnInit();

      expect(comp.groupsSharedCollection).toContain(group);
      expect(comp.legalEntity).toEqual(legalEntity);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILegalEntity>>();
      const legalEntity = { id: 123 };
      jest.spyOn(legalEntityFormService, 'getLegalEntity').mockReturnValue(legalEntity);
      jest.spyOn(legalEntityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ legalEntity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: legalEntity }));
      saveSubject.complete();

      // THEN
      expect(legalEntityFormService.getLegalEntity).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(legalEntityService.update).toHaveBeenCalledWith(expect.objectContaining(legalEntity));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILegalEntity>>();
      const legalEntity = { id: 123 };
      jest.spyOn(legalEntityFormService, 'getLegalEntity').mockReturnValue({ id: null });
      jest.spyOn(legalEntityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ legalEntity: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: legalEntity }));
      saveSubject.complete();

      // THEN
      expect(legalEntityFormService.getLegalEntity).toHaveBeenCalled();
      expect(legalEntityService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILegalEntity>>();
      const legalEntity = { id: 123 };
      jest.spyOn(legalEntityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ legalEntity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(legalEntityService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareGroup', () => {
      it('Should forward to groupService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(groupService, 'compareGroup');
        comp.compareGroup(entity, entity2);
        expect(groupService.compareGroup).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
