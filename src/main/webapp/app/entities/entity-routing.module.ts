import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'group',
        data: { pageTitle: 'tqmiApp.group.home.title' },
        loadChildren: () => import('./group/group.module').then(m => m.GroupModule),
      },
      {
        path: 'legal-entity',
        data: { pageTitle: 'tqmiApp.legalEntity.home.title' },
        loadChildren: () => import('./legal-entity/legal-entity.module').then(m => m.LegalEntityModule),
      },
      {
        path: 'cell',
        data: { pageTitle: 'tqmiApp.cell.home.title' },
        loadChildren: () => import('./cell/cell.module').then(m => m.CellModule),
      },
      {
        path: 'employee',
        data: { pageTitle: 'tqmiApp.employee.home.title' },
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
