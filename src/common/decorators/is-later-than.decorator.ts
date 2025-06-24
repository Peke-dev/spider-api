import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import * as dayjs from 'dayjs';

@ValidatorConstraint({ async: false })
export class IsLaterThanConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (!propertyValue || !relatedValue) return true;

    const dateFormat = 'YYYY-MM-DD';

    const fromDay = dayjs(relatedValue, dateFormat, true);
    const toDay = dayjs(propertyValue, dateFormat, true);

    if (!fromDay.isValid() || !toDay.isValid()) return false;

    return toDay.isAfter(fromDay);
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = args.object[relatedPropertyName];
    return `The date '${args.property}' (${args.value}) must be after to the date '${relatedPropertyName}' (${relatedValue}).`;
  }
}

export function IsLaterThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsLaterThanConstraint,
    });
  };
}
