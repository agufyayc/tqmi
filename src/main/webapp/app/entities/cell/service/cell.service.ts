import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICell, NewCell } from '../cell.model';

export type PartialUpdateCell = Partial<ICell> & Pick<ICell, 'id'>;

export type EntityResponseType = HttpResponse<ICell>;
export type EntityArrayResponseType = HttpResponse<ICell[]>;

@Injectable({ providedIn: 'root' })
export class CellService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cells');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(cell: NewCell): Observable<EntityResponseType> {
    return this.http.post<ICell>(this.resourceUrl, cell, { observe: 'response' });
  }

  update(cell: ICell): Observable<EntityResponseType> {
    return this.http.put<ICell>(`${this.resourceUrl}/${this.getCellIdentifier(cell)}`, cell, { observe: 'response' });
  }

  partialUpdate(cell: PartialUpdateCell): Observable<EntityResponseType> {
    return this.http.patch<ICell>(`${this.resourceUrl}/${this.getCellIdentifier(cell)}`, cell, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICell>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICell[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCellIdentifier(cell: Pick<ICell, 'id'>): number {
    return cell.id;
  }

  compareCell(o1: Pick<ICell, 'id'> | null, o2: Pick<ICell, 'id'> | null): boolean {
    return o1 && o2 ? this.getCellIdentifier(o1) === this.getCellIdentifier(o2) : o1 === o2;
  }

  addCellToCollectionIfMissing<Type extends Pick<ICell, 'id'>>(
    cellCollection: Type[],
    ...cellsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const cells: Type[] = cellsToCheck.filter(isPresent);
    if (cells.length > 0) {
      const cellCollectionIdentifiers = cellCollection.map(cellItem => this.getCellIdentifier(cellItem)!);
      const cellsToAdd = cells.filter(cellItem => {
        const cellIdentifier = this.getCellIdentifier(cellItem);
        if (cellCollectionIdentifiers.includes(cellIdentifier)) {
          return false;
        }
        cellCollectionIdentifiers.push(cellIdentifier);
        return true;
      });
      return [...cellsToAdd, ...cellCollection];
    }
    return cellCollection;
  }
}
