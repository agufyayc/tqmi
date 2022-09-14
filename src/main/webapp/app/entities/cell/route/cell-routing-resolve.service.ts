import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICell } from '../cell.model';
import { CellService } from '../service/cell.service';

@Injectable({ providedIn: 'root' })
export class CellRoutingResolveService implements Resolve<ICell | null> {
  constructor(protected service: CellService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICell | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cell: HttpResponse<ICell>) => {
          if (cell.body) {
            return of(cell.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
