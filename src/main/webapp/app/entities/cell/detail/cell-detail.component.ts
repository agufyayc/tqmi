import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICell } from '../cell.model';

@Component({
  selector: 'jhi-cell-detail',
  templateUrl: './cell-detail.component.html',
})
export class CellDetailComponent implements OnInit {
  cell: ICell | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cell }) => {
      this.cell = cell;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
