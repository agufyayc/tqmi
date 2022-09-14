import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LegalEntityService } from '../service/legal-entity.service';

import { LegalEntityComponent } from './legal-entity.component';

describe('LegalEntity Management Component', () => {
  let comp: LegalEntityComponent;
  let fixture: ComponentFixture<LegalEntityComponent>;
  let service: LegalEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'legal-entity', component: LegalEntityComponent }]), HttpClientTestingModule],
      declarations: [LegalEntityComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(LegalEntityComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LegalEntityComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LegalEntityService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.legalEntities?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to legalEntityService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLegalEntityIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLegalEntityIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
