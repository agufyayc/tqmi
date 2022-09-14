import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILegalEntity, NewLegalEntity } from '../legal-entity.model';

export type PartialUpdateLegalEntity = Partial<ILegalEntity> & Pick<ILegalEntity, 'id'>;

export type EntityResponseType = HttpResponse<ILegalEntity>;
export type EntityArrayResponseType = HttpResponse<ILegalEntity[]>;

@Injectable({ providedIn: 'root' })
export class LegalEntityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/legal-entities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(legalEntity: NewLegalEntity): Observable<EntityResponseType> {
    return this.http.post<ILegalEntity>(this.resourceUrl, legalEntity, { observe: 'response' });
  }

  update(legalEntity: ILegalEntity): Observable<EntityResponseType> {
    return this.http.put<ILegalEntity>(`${this.resourceUrl}/${this.getLegalEntityIdentifier(legalEntity)}`, legalEntity, {
      observe: 'response',
    });
  }

  partialUpdate(legalEntity: PartialUpdateLegalEntity): Observable<EntityResponseType> {
    return this.http.patch<ILegalEntity>(`${this.resourceUrl}/${this.getLegalEntityIdentifier(legalEntity)}`, legalEntity, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILegalEntity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILegalEntity[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLegalEntityIdentifier(legalEntity: Pick<ILegalEntity, 'id'>): number {
    return legalEntity.id;
  }

  compareLegalEntity(o1: Pick<ILegalEntity, 'id'> | null, o2: Pick<ILegalEntity, 'id'> | null): boolean {
    return o1 && o2 ? this.getLegalEntityIdentifier(o1) === this.getLegalEntityIdentifier(o2) : o1 === o2;
  }

  addLegalEntityToCollectionIfMissing<Type extends Pick<ILegalEntity, 'id'>>(
    legalEntityCollection: Type[],
    ...legalEntitiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const legalEntities: Type[] = legalEntitiesToCheck.filter(isPresent);
    if (legalEntities.length > 0) {
      const legalEntityCollectionIdentifiers = legalEntityCollection.map(
        legalEntityItem => this.getLegalEntityIdentifier(legalEntityItem)!
      );
      const legalEntitiesToAdd = legalEntities.filter(legalEntityItem => {
        const legalEntityIdentifier = this.getLegalEntityIdentifier(legalEntityItem);
        if (legalEntityCollectionIdentifiers.includes(legalEntityIdentifier)) {
          return false;
        }
        legalEntityCollectionIdentifiers.push(legalEntityIdentifier);
        return true;
      });
      return [...legalEntitiesToAdd, ...legalEntityCollection];
    }
    return legalEntityCollection;
  }
}
