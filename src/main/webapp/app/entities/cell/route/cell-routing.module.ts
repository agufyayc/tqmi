import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CellComponent } from '../list/cell.component';
import { CellDetailComponent } from '../detail/cell-detail.component';
import { CellUpdateComponent } from '../update/cell-update.component';
import { CellRoutingResolveService } from './cell-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const cellRoute: Routes = [
  {
    path: '',
    component: CellComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CellDetailComponent,
    resolve: {
      cell: CellRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CellUpdateComponent,
    resolve: {
      cell: CellRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CellUpdateComponent,
    resolve: {
      cell: CellRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cellRoute)],
  exports: [RouterModule],
})
export class CellRoutingModule {}
