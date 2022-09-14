import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CellDetailComponent } from './cell-detail.component';

describe('Cell Management Detail Component', () => {
  let comp: CellDetailComponent;
  let fixture: ComponentFixture<CellDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CellDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ cell: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CellDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CellDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load cell on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.cell).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
