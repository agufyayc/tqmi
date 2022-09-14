import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICell, NewCell } from '../cell.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICell for edit and NewCellFormGroupInput for create.
 */
type CellFormGroupInput = ICell | PartialWithRequiredKeyOf<NewCell>;

type CellFormDefaults = Pick<NewCell, 'id'>;

type CellFormGroupContent = {
  id: FormControl<ICell['id'] | NewCell['id']>;
  cellName: FormControl<ICell['cellName']>;
  bod: FormControl<ICell['bod']>;
  ebod: FormControl<ICell['ebod']>;
  legalEntity: FormControl<ICell['legalEntity']>;
};

export type CellFormGroup = FormGroup<CellFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CellFormService {
  createCellFormGroup(cell: CellFormGroupInput = { id: null }): CellFormGroup {
    const cellRawValue = {
      ...this.getFormDefaults(),
      ...cell,
    };
    return new FormGroup<CellFormGroupContent>({
      id: new FormControl(
        { value: cellRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      cellName: new FormControl(cellRawValue.cellName, {
        validators: [Validators.required],
      }),
      bod: new FormControl(cellRawValue.bod),
      ebod: new FormControl(cellRawValue.ebod),
      legalEntity: new FormControl(cellRawValue.legalEntity),
    });
  }

  getCell(form: CellFormGroup): ICell | NewCell {
    return form.getRawValue() as ICell | NewCell;
  }

  resetForm(form: CellFormGroup, cell: CellFormGroupInput): void {
    const cellRawValue = { ...this.getFormDefaults(), ...cell };
    form.reset(
      {
        ...cellRawValue,
        id: { value: cellRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CellFormDefaults {
    return {
      id: null,
    };
  }
}
