import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILegalEntity } from '../legal-entity.model';
import { LegalEntityService } from '../service/legal-entity.service';

@Injectable({ providedIn: 'root' })
export class LegalEntityRoutingResolveService implements Resolve<ILegalEntity | null> {
  constructor(protected service: LegalEntityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILegalEntity | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((legalEntity: HttpResponse<ILegalEntity>) => {
          if (legalEntity.body) {
            return of(legalEntity.body);
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
