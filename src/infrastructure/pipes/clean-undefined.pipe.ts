import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class CleanUndefinedPipe implements PipeTransform {
  constructor(private readonly options?: { stripNullValues?: boolean }) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object' || value === null || value === undefined) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.transform(item, metadata));
    }

    const cleanedObject: { [key: string]: any } = {};

    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const propValue = value[key];

        if (
          propValue === undefined ||
          (this.options?.stripNullValues && propValue === null)
        ) {
          continue;
        }

        if (typeof propValue === 'object' && propValue !== null) {
          cleanedObject[key] = this.transform(propValue, metadata);
          continue;
        }

        cleanedObject[key] = propValue;
      }
    }

    return cleanedObject;
  }
}
