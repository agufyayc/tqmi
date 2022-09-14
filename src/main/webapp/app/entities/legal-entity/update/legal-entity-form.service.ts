import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILegalEntity, NewLegalEntity } from '../legal-entity.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILegalEntity for edit and NewLegalEntityFormGroupInput for create.
 */
type LegalEntityFormGroupInput = ILegalEntity | PartialWithRequiredKeyOf<NewLegalEntity>;

type LegalEntityFormDefaults = Pick<NewLegalEntity, 'id'>;

type LegalEntityFormGroupContent = {
  id: FormControl<ILegalEntity['id'] | NewLegalEntity['id']>;
  legalEntityName: FormControl<ILegalEntity['legalEntityName']>;
  streetAddress: FormControl<ILegalEntity['streetAddress']>;
  postalCode: FormControl<ILegalEntity['postalCode']>;
  city: FormControl<ILegalEntity['city']>;
  stateProvince: FormControl<ILegalEntity['stateProvince']>;
  group: FormControl<ILegalEntity['group']>;
};

export type LegalEntityFormGroup = FormGroup<LegalEntityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LegalEntityFormService {
  createLegalEntityFormGroup(legalEntity: LegalEntityFormGroupInput = { id: null }): LegalEntityFormGroup {
    const legalEntityRawValue = {
      ...this.getFormDefaults(),
      ...legalEntity,
    };
    return new FormGroup<LegalEntityFormGroupContent>({
      id: new FormControl(
        { value: legalEntityRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      legalEntityName: new FormControl(legalEntityRawValue.legalEntityName, {
        validators: [Validators.required],
      }),
      streetAddress: new FormControl(legalEntityRawValue.streetAddress),
      postalCode: new FormControl(legalEntityRawValue.postalCode),
      city: new FormControl(legalEntityRawValue.city),
      stateProvince: new FormControl(legalEntityRawValue.stateProvince),
      group: new FormControl(legalEntityRawValue.group),
    });
  }

  getLegalEntity(form: LegalEntityFormGroup): ILegalEntity | NewLegalEntity {
    return form.getRawValue() as ILegalEntity | NewLegalEntity;
  }

  resetForm(form: LegalEntityFormGroup, legalEntity: LegalEntityFormGroupInput): void {
    const legalEntityRawValue = { ...this.getFormDefaults(), ...legalEntity };
    form.reset(
      {
        ...legalEntityRawValue,
        id: { value: legalEntityRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LegalEntityFormDefaults {
    return {
      id: null,
    };
  }
}
