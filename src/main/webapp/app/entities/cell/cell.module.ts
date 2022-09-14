import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CellComponent } from './list/cell.component';
import { CellDetailComponent } from './detail/cell-detail.component';
import { CellUpdateComponent } from './update/cell-update.component';
import { CellDeleteDialogComponent } from './delete/cell-delete-dialog.component';
import { CellRoutingModule } from './route/cell-routing.module';

@NgModule({
  imports: [SharedModule, CellRoutingModule],
  declarations: [CellComponent, CellDetailComponent, CellUpdateComponent, CellDeleteDialogComponent],
})
export class CellModule {}
